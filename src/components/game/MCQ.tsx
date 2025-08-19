"use client";

import { Game, Question } from '@prisma/client'
import { BarChart, ChevronRight, Loader2, Timer } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button, buttonVariants } from '../ui/button';
import MCQCounter from './MCQCounter';
import { useMutation } from '@tanstack/react-query';
import { checkAnswerSchema } from '@/schemas/form/quiz';
import z, { set } from 'zod';
import axios from 'axios';
import { toast } from "sonner";
import Link from 'next/link';
import { formatTimeDelta } from '@/lib/utils';
import { differenceInSeconds } from 'date-fns';
import TimerDisplay from '../TimerDisplay';

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
}

const MCQ = ({ game }: Props) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [hasEnded, setHasEnded] = useState(false);

    const curQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions]);

    const options = useMemo(() => {
        if(!curQuestion?.options) return [];
        return JSON.parse(curQuestion.options as string) as string[];
    }, [curQuestion]);

    const {mutate: checkAnswer, isPending: isChecking} = useMutation({
        mutationFn: async () => {
            const payload: z.infer<typeof checkAnswerSchema> = {
                questionId: curQuestion.id,
                userAnswer: options[selectedOption]
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
            onSuccess: ({isCorrect}) => {
                if(isCorrect) {
                    toast.success("Correct!");
                    setCorrectAnswers(prev => prev + 1);
                } else {
                    toast.error("Incorrect!");
                    setWrongAnswers(prev => prev + 1);
                }
                if(questionIndex === game.questions.length - 1) {
                    setHasEnded(true);
                    return;
                }
                setQuestionIndex(prev => prev + 1);
            }
        })
    }, [checkAnswer, toast, isChecking, questionIndex, game.questions.length]); 
    // the function re-initiates whenever these variables change

    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === '1') {
                setSelectedOption(0);
            } else if(e.key === '2') {
                setSelectedOption(1);
            } else if(e.key === '3') {
                setSelectedOption(2);
            } else if(e.key === '4') {
                setSelectedOption(3);
            } else if(e.key === 'Enter') {
                handleNext();
            }
        });
        return () => {
            document.removeEventListener('keydown', (e) => {
                if(e.key === '1') {
                    setSelectedOption(0);
                } else if(e.key === '2') {
                    setSelectedOption(1);
                } else if(e.key === '3') {
                    setSelectedOption(2);
                } else if(e.key === '4') {
                    setSelectedOption(3);
                } else if(e.key === 'Enter') {
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
                <div className="px-4 py-1 min-h-6 flex items-center justify-center font-semibold text-white bg-green-600 rounded-md whitespace-nowrap">
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
            <MCQCounter correctAnswers={correctAnswers} wrongAnswers={wrongAnswers}/>
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
            {options.map((option, index) => (
                <Button
                    key={index}
                    className='justify-start w-full py-8 mb-4'
                    variant={selectedOption === index ? 'default' : 'secondary'}
                    onClick={() => {
                        setSelectedOption(index);
                    }}
                >
                    <div className="flex items-center justify-start">
                        <div className="p-2 px-3 mr-5 border rounded-md">
                            {index+1}
                        </div>
                        <div className="text-start">
                            {option}
                        </div>
                    </div>
                </Button>
            ))}
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

export default MCQ