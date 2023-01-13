import { useTimer } from 'react-timer-hook';

export function Timer({ expiryTimestamp }: { expiryTimestamp: number }) {
  const {seconds, minutes, hours} = useTimer({
    expiryTimestamp: new Date(expiryTimestamp * 1000),
    onExpire: () => console.log('collect'),
  });
  return (
    <h2>
      { `${hours}.${minutes}.${seconds}` }
    </h2>
  );
}
