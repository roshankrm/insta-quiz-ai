import { NextResponse } from "next/server"
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gemini";
import { getAuthSession } from "@/lib/nextauth";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json();
        const {amount, topic, type} = quizCreationSchema.parse(body);

        let questions: any;
        if (type === "open_ended") {
            questions = await strict_output(
              "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array",
              new Array(amount).fill(
                `You are to generate one random easy to medium or medium to hard (be random) open-ended question (must be relevant and useful) about the topic: ${topic}. I am going to use this question as a fill in the blanks question for the user to answer. The question should be in the form of a question, and the answer should be distinct and relevant to the question.`
              ),
              {
                question: "question",
                answer: "answer with max length of 15 words",
              }
            );
        } else if (type === "mcq") {
            questions = await strict_output(
              "You are a helpful AI that is able to generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
              new Array(amount).fill(
                `You are to generate one random easy to medium or medium to hard (be random) multiple choice question (must be relevant and useful) about the topic: ${topic}. The question should have one correct answer and three distinct incorrect options. It should be in the form of a question, and the options should be distinct and relevant to the question. 
                The answer should be the correct answer make the options similar to the correct answer so that it is not obvious which one is correct.`
              ),
              {
                question: "question",
                answer: "answer with max length of 15 words",
                option1: "distinct incorrect option1 with max length of 15 words",
                option2: "distinct incorrect option2 with max length of 15 words",
                option3: "distinct incorrect option3 with max length of 15 words"
              }
            );
        }
        return NextResponse.json(
            {
                questions
            },
            {
                status: 200
            }
        )
    } catch (err) {
        if(err instanceof ZodError) {
            return NextResponse.json({
                error: err.issues,
            },
            {
            status: 400,
            });
        }
        else {
            console.error("Error in /api/questions:", err);
        }
    }
}