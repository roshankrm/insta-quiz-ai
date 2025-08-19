import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function POST(req: Request, res: Response) {
    try {
        const session = await getAuthSession();
        if(!session?.user) {
            return NextResponse.json(
                {
                    error: "Unauthorized! You must be logged in to create a game.",
                },
                { 
                    status: 401 
                }
            );
        }
        const body = await req.json();
        const { amount, topic, type } = quizCreationSchema.parse(body);

        const game = await prisma.game.create({
            data: {
                gameType: type,
                timeStarted: new Date(),
                userId: session.user.id,
                topic
            }
        })
        
        // Ensure that the topic count is updated if exists or inserted
        await prisma.topicCount.upsert({
            where: {
                topic
            },
            create: {
                topic,
                count: 1
            },
            update: {
                count: {
                    increment: 1
                }
            }
        });

        const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
            amount,
            topic,
            type
        })

        if(type === "mcq") {
            type mcqQuestion = {
                question: string,
                answer: string,
                option1: string,
                option2: string,
                option3: string
            }
            let manyData = data.questions.map( (question: mcqQuestion) => {
                let options = [question.answer, question.option1, question.option2, question.option3];
                options = options.sort(() => Math.random() - 0.5);
                return {
                    question: question.question,
                    answer: question.answer,
                    options: JSON.stringify(options),
                    gameId: game.id,
                    questionType: 'mcq'
                }
            })
            await prisma.question.createMany({
                data: manyData
            });
        } else if(type === 'open_ended') {
            type openEndedQuestion = {
                question: string,
                answer: string
            }
            let manyData = data.questions.map( (question: openEndedQuestion) => {
                return {
                    question: question.question,
                    answer: question.answer,
                    gameId: game.id,
                    questionType: 'open_ended'
                }
            })

            await prisma.question.createMany({
                data: manyData
            })
        }
        return NextResponse.json({
            gameId: game.id
        })

    } catch (error) {
        if(error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.issues,
                },
                { 
                    status: 400 
                }
            );
        }
        console.error("Error in game route:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while creating the game.",
            },
            { 
                status: 500
            }
        )
    }
}