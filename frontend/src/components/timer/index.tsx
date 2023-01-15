import { useTimer } from 'react-timer-hook';
import { useNftStore } from '../../stores';

export function Timer({
  expiryTimestamp,
  toggleAnimation,
}: {
  expiryTimestamp: number;
  toggleAnimation: () => void;
}) {
  const harvestATree = useNftStore((state) => state.harvestATree);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(expiryTimestamp * 1000),
    onExpire: () => {
      harvestATree();
      toggleAnimation();
      console.log('collect');
    },
  });
  return (
    <h2 style={{ textAlign: 'center' }}>{`${hours}.${minutes}.${seconds}`}</h2>
  );
}
