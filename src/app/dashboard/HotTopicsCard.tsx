import WordCloud from '@/components/dashboard/WordCloud'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

type Props = {}

const HotTopicsCard = (props: Props) => {
  return (
    <Card className='col-span-4'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Hot Topics</CardTitle>
            <CardDescription>
                Click on a Topic to start a quiz based on it!
            </CardDescription>
        </CardHeader>

        <CardContent className='pl-2'>
            <WordCloud />
        </CardContent>
    </Card>
  )
}

export default HotTopicsCard