/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { HeaderMenu } from '../../components/common/header';
import { Animation, Timer } from '../../components';
import { useNftStore } from '../../stores';
import { HomeModal } from './HomeModal';

function cumputeTimestamp(minuteToAdd: number): number {
  const SEC_IN_A_MINUTE = 60;
  const timestamp = new Date().getTime() / 1000; // time in js is with miliseconds
  return timestamp + minuteToAdd * SEC_IN_A_MINUTE;
}

enum State {
  IDLE,
  Growing,
  Ready,
}

export function HomeCenter({
  state,
  openModal,
  returnToIdle,
  finishGrowing,
}: {
  state: State;
  openModal: () => void;
  returnToIdle: () => void;
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
          marginBottom: '1rem',
        }}
      >
        <Button onClick={returnToIdle}>collect trees</Button>
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

export function Home({ moneyCount }: { moneyCount: number | undefined }) {
  const harvestATree = useNftStore((store) => store.harvestATree);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [state, setState] = useState<State>(State.IDLE);
  const [trees, loadImage] = useNftStore((store) => [
    store.nfts,
    store.loadImage,
  ]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const finshGrowing = () => setState(State.Ready);
  const startGrowing = () => setState(State.Growing);
  const returnToIdle = () => {
    harvestATree();
    showNotification({
      message: 'You collected your trees',
    });
    setState(State.IDLE);
  };

  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
        moneyCount={moneyCount}
      />
      <Modal centered size="xl" opened={isModalOpen} onClose={closeModal}>
        <HomeModal
          nfts={trees}
          startGrowing={startGrowing}
          closeModal={closeModal}
        />
      </Modal>
      <HomeCenter
        state={state}
        openModal={openModal}
        finishGrowing={finshGrowing}
        returnToIdle={returnToIdle}
      />
    </>
  );
}
