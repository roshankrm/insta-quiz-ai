import HistoryComponent from '@/components/HistoryComponent'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getAuthSession } from '@/lib/nextauth'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const RecentActivities = async (props: Props) => {
  const session = await getAuthSession();
  if(!session?.user) {
    return redirect('/');
  }
  return (
    <Card className='col-span-4 lg:col-span-3'>
        <CardHeader>
            <CardTitle className='text-2xl font-bold'>Recent Activities</CardTitle>
            <CardDescription>
                These are the last 5 games you played.
            </CardDescription>
        </CardHeader>

        <CardContent className='max-h-[580px] overflow-scroll'>
            <HistoryComponent limit={5} userId={session.user.id} />
        </CardContent>
    </Card>
  )
}

export default RecentActivities