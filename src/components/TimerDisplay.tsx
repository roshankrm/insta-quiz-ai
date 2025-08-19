"use client";

import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { formatTimeDelta } from '@/lib/utils';
import { Timer } from 'lucide-react';

type Props = {
  timeStarted: Date;
};

const TimerDisplay = ({ timeStarted }: Props) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex self-start mt-3 text-slate-400">
      <Timer className='mr-2' />
      <span>{formatTimeDelta(differenceInSeconds(now, timeStarted))}</span>
    </div>
  );
};

export default TimerDisplay;