import { useTimer } from 'react-timer-hook';
import { useNftStore } from '../../stores';

export function Timer({ expiryTimestamp }: { expiryTimestamp: number }) {
  const harvestATree = useNftStore((state) => state.harvestATree);
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp: new Date(expiryTimestamp * 1000),
    onExpire: () => {
      harvestATree();
      console.log('collect');
    },
  });
  return <h2>{`${hours}.${minutes}.${seconds}`}</h2>;
}
