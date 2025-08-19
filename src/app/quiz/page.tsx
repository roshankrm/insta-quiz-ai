import QuizCreation from '@/components/quiz/QuizCreation';
import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

interface Props {
    searchParams: {
      topic?: string;
    };
}

export const meatadat = {
    title: "Quiz | IQ-AI",
    description: "Quiz yourself on anything!",
};

const QuizPage = async ({searchParams}: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }
    return (
        <QuizCreation topic={searchParams.topic ?? ""} />
    )
}

export default QuizPage