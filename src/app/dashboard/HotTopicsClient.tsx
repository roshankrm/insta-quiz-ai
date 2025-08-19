"use client";

import React from 'react';
import dynamic from 'next/dynamic';

const WordCloud = dynamic(() => import('@/components/dashboard/WordCloud'), {
    ssr: false,
    loading: () => <p className='text-center'>Loading chart...</p>,
});

type Props = {
    formattedTopics: { text: string; value: number }[];
};

const HotTopicsClient = ({ formattedTopics }: Props) => {
    return <WordCloud formattedTopics={formattedTopics} />;
};

export default HotTopicsClient;