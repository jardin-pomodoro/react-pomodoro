import type { Duration } from 'luxon';
import { useEffect, useState } from 'react';

export const Timer = ({ start }: {start: Duration}) => {
    const [duration, setDuration] = useState<Duration>(start);
    useEffect(() => {
        // setInterval(() => {
        // }, 1000);
        // find use effect that run only once
        // duration minus go beyound 0 
        setDuration(duration.minus({seconds: 1}))
    }, []);
    return (<h2>{duration.hours}.{duration.minutes}.{duration.seconds}</h2>);
}