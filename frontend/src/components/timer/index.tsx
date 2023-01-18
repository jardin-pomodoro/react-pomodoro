import { useTimer } from 'react-timer-hook';

export function Timer({
  expiryTimestamp,
  onGrowingFinish,
}: {
  expiryTimestamp: number;
  onGrowingFinish: () => void;
}) {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(expiryTimestamp * 1000),
    onExpire: () => onGrowingFinish(),
  });
  return (
    <h2 style={{ textAlign: 'center' }}>{`${hours}.${minutes}.${seconds}`}</h2>
  );
}
