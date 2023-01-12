/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Button, Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import { HeaderMenu } from '../../components/common/header';
import { Animation } from '../../components';
import { useNftStore } from '../../stores';
import { HomeModal } from './HomeModal';
import { Timer } from '../../components/timer';
import { Duration } from 'luxon';

export function Home() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showAnimation, setAnimation] = useState<boolean>(false);
  const [trees, loadImage] = useNftStore((store) => [
    store.nfts,
    store.loadImage,
  ]);

  useEffect(() => {
    loadImage()
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    toggleAnimation();
  };
  const toggleAnimation = () => setAnimation(!showAnimation);

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
      <Timer start={Duration.fromObject({minute: 20})} />
      {showAnimation && <Animation />}
    </>
  );
}
