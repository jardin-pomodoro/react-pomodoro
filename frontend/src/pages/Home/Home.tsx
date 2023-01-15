/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Modal } from '@mantine/core';
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

export function Home() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showAnimation, setAnimation] = useState<boolean>(false);
  const [trees, loadImage] = useNftStore((store) => [
    store.nfts,
    store.loadImage,
  ]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  const openModal = () => setModalOpen(true);
  const toggleAnimation = () => setAnimation(!showAnimation);
  const closeModal = () => setModalOpen(false);
  const onSubmitModal = () => {
    closeModal();
    toggleAnimation();
  };

  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
      />
      <Modal centered size="xl" opened={isModalOpen} onClose={closeModal}>
        <HomeModal nfts={trees} closeModal={onSubmitModal} />
      </Modal>
      {!showAnimation && (
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
      )}
      {showAnimation && (
        <>
          <Timer
            toggleAnimation={toggleAnimation}
            expiryTimestamp={cumputeTimestamp(0.5)}
          />
          <Animation />
        </>
      )}
    </>
  );
}
