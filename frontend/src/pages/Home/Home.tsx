/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import { HeaderMenu } from '../../components/common/header';
import { Animation } from '../../components';
import { useNftStore } from '../../stores';
import { HomeModal } from './HomeModal';
import { Timer } from '../../components/timer';

function cumputeTimestamp(minuteToAdd: number): number {
  const SEC_IN_A_MINUTE = 60;
  const timestamp = new Date().getTime() / 1000;
  return timestamp + (minuteToAdd * SEC_IN_A_MINUTE);
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
  const closeModal = () => {
    setModalOpen(false);
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
      <h1>Hello World !</h1>
      <Button onClick={openModal}>plant a tree</Button>
      <Button onClick={toggleAnimation}>toggle animation</Button>

      <Modal centered size="xl" opened={isModalOpen} onClose={closeModal}>
        <HomeModal nfts={trees} closeModal={closeModal} />
      </Modal>
      {showAnimation && (
        <>
          <Timer expiryTimestamp={cumputeTimestamp(20)} />
          <Animation />
        </>
      )}
    </>
  );
}
