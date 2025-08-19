"use client";

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Progress } from '../ui/progress'

type Props = {
    finished: boolean
}

const loadingTextList = [
    'Loading questions...',
    'Unleashing the quiz magic...',
    'Diving Deep into the ocean of knowledge...',
    'Gathering the best questions for you...',
    'Igniting the flame of curiosity...',
    'Crafting the ultimate quiz experience...',
    'Preparing your brain for a challenge...',
    'Loading your quiz adventure...',
    'Summoning the quiz spirits...',
    'Fetching the finest trivia...',
    'Unlocking the secrets of knowledge...'
];

const LoadingQuestions = ({ finished }: Props) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState<string>(loadingTextList[0]);

    // To set up loading text that changes every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const randIndex = Math.floor(Math.random() * loadingTextList.length);
            setLoadingText(loadingTextList[randIndex]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // to simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if(finished) {
                    return 100;
                }
                if(prev == 100) {
                    return 50;
                }
                if(Math.random() < 0.1) {
                    return prev + 2;
                }
                return prev + 0.5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [finished]);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
        <Image src='/loading.gif' alt='Loading Questions' width={400} height={400} />
        <Progress value={progress} className='w-full mt-4' />
        <h1 className='mt-2 text-x1'>{loadingText}</h1>
    </div>
  )
}

export default LoadingQuestions