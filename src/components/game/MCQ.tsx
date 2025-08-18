"use client";

import { Game, Question } from '@prisma/client'
import { ChevronRight, Timer } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button';
import MCQCounter from './MCQCounter';

type Props = {
    game: Game & {questions: Pick<Question, 'id' | 'options' | 'question'>[]}
}

const MCQ = ({ game }: Props) => {
    const [questionIndex, setQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(0);

    const curQuestion = useMemo(() => {
        return game.questions[questionIndex];
    }, [questionIndex, game.questions]);

    const options = useMemo(() => {
        if(!curQuestion?.options) return [];
        return JSON.parse(curQuestion.options as string) as string[];
    }, [curQuestion]);

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
                <div className="flex self-start mt-3 text-slate-400">
                    <Timer className='mr-2' />
                    <span>00:00</span>
                </div>
            </div>
            <MCQCounter correctAnswers={3} wrongAnswers={2}/>
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
            <Button className='mt-2'>
                Next <ChevronRight className='ml-2 w-4 h-4' />
            </Button>
        </div>
    </div>
  )
}

export default MCQ