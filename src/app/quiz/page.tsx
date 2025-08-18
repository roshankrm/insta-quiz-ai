import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {}

export const meatadat = {
    title: "Quiz | IQ-AI",
};

const QuizPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect('/');
    }
    return (
        <div>QuizPage</div>
    )
}

export default QuizPage