"use client";

import { Game, Question } from '@prisma/client'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button, buttonVariants } from '../ui/button';
import { useMutation } from '@tanstack/react-query';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import z, { set } from 'zod';
import axios from 'axios';
import { toast } from "sonner";
import Link from 'next/link';
import { formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import BlankAnsInput from './BlankAnsInput';
import TimerDisplay from '../TimerDisplay';

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'answer' | 'question'>[]}
}

const OpenEnded = ({ game }: Props) => {

    const [questionIndex, setQuestionIndex] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);
    // const [now, setNow] = useState(new Date());
    const [blankAnswer, setBlankAnswer] = useState('');

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         if(!hasEnded) {
    //             setNow(new Date());
    //         }
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, [hasEnded]);

    const curQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions]);

    const {mutate: checkAnswer, isPending: isChecking} = useMutation({
        mutationFn: async () => {
            let filledAns = blankAnswer;
            document.querySelectorAll('.user-blank-input').forEach((input) => {
                const inputElement = input as HTMLInputElement;
                filledAns = filledAns.replace("_____", inputElement.value);
                inputElement.value = "";
            });
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: curQuestion.id,
                userAnswer: filledAns
            }
            const response = await axios.post('/api/checkAnswer', payload);
            return response.data;
        }
    });

    // new mutation to end the game
    const { mutate: endGame } = useMutation({
        mutationFn: async () => {
            const payload = { gameId: game.id };
            const response = await axios.post(`/api/endGame`, payload);
            return response.data;
        }
    });

    const handleNext = useCallback(() => {
        if(isChecking) return;
        checkAnswer( undefined, {
            onSuccess: ({ percentageCorrect }) => {
                if(percentageCorrect < 70) {
                    toast.error(`Your answer was ${percentageCorrect} % correct.`);
                } else {
                    toast.success(`Your answer was ${percentageCorrect} % correct!`);
                }
                if(questionIndex === game.questions.length - 1) {
                    setHasEnded(true);
                    return;
                }
                setQuestionIndex(prev => prev + 1);
            }
        })
    }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length, blankAnswer]); 
    // the function re-initiates whenever these variables change

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') {
                handleNext();
            }
        });
        return () => {
            document.removeEventListener('keydown', (e) => {
                if(e.key === 'Enter') {
                    handleNext();
                }
            });
        }
    }, [handleNext]);

    useEffect(() => {
        if (hasEnded) {
            endGame();
        }
    }, [hasEnded, endGame]);

    if(hasEnded) {
        return (
            <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
                    You have fininshed the quiz in {formatTimeDelta(differenceInSeconds((game.timeEnded || new Date()), game.timeStarted))}!
                </div>
                <Link href={`/statistics/${game.id}`} className={`${buttonVariants()} mt-2`}>
                    View Statistics 
                    <BarChart className='ml-2 w-4 h-4' />
                </Link>
            </div>
        );
    }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw">
        <div className="flex flex-row justify-between">
            <div className="flex flex-col">
                <p>
                    <span className='text-slate-400 mr-2'>Topic</span>
                    <span className='px-2 py-1 text-white rounded-lg bg-slate-800'>
                        {game.topic}
                    </span>
                </p>
                {/* <div className="flex self-start mt-3 text-slate-400">
                    <Timer className='mr-2' />
                    <span>{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}</span>
                </div> */}
                {!hasEnded && <TimerDisplay timeStarted={game.timeStarted} />}
            </div>
            {/* <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/> */}
        </div>

        <Card className='w-full mt-4'>
            <CardHeader className='flex flex-row items-center'>
                <CardTitle className='text-base text-slate-400'>
                    <div>{questionIndex+1}</div>
                    <div className="text-base text-slate-400">
                        {game.questions.length}
                    </div>
                </CardTitle>
                <CardDescription className='flex-grow text-lg'>
                    {curQuestion.question}
                </CardDescription>
            </CardHeader>
        </Card>

        <div className="flex flex-col items-center justify-center w-full mt-4">
            <BlankAnsInput answer={curQuestion.answer} setBlankAnswer={setBlankAnswer} />
            <Button 
                className='mt-2' 
                disabled={isChecking}
                onClick={ () => {handleNext();}} 
            >
                {isChecking && <Loader2 className='w-4 h-4 mr-2 animated-spin' />}
                Next <ChevronRight className='ml-2 w-4 h-4' />
            </Button>
        </div>
    </div>
  )
}

export default OpenEnded