import { Button } from '@mantine/core';
import { Timer, Animation } from '../../components';
import { State } from './HomeState';

function cumputeTimestamp(minuteToAdd: number): number {
  const SEC_IN_A_MINUTE = 60;
  const timestamp = new Date().getTime() / 1000; // time in js is with miliseconds
  return timestamp + minuteToAdd * SEC_IN_A_MINUTE;
}

export function HomeCenter({
  state,
  openModal,
  harvestATree,
  finishGrowing,
}: {
  state: State;
  openModal: () => void;
  harvestATree: () => void;
  finishGrowing: () => void;
}) {
  if (state === State.Growing) {
    return (
      <>
        <Timer
          onGrowingFinish={finishGrowing}
          expiryTimestamp={cumputeTimestamp(0.5)}
        />
        <Animation />
      </>
    );
  }
  if (state === State.Ready) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1rem',
          minHeight: '70vh',
        }}
      >
        <Button onClick={harvestATree}>collect trees</Button>
      </div>
    );
  }
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}
      >
        <Button onClick={openModal}>plant a tree</Button>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <video style={{ width: '70vw' }} autoPlay loop muted>
          <source src="/room.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  );
}
