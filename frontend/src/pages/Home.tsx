import { Button, Text, Modal } from '@mantine/core';
import { useState } from 'react';
import { HeaderMenu } from '../components/common/header';
import { Animation } from '../components';
import { useNftStore } from '../stores';

function Home() {
  /* const PlanTreeService = useServiceStore((state) =>
    state.services.get('PlantTreeService')
  ) as PlantTreeService; */

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showAnimation, setAnimation] = useState<boolean>(false);
  const plantATree = useNftStore((store) => store.plantATree);
  const handleClick = () => {
    plantATree();
    console.log('tree seeded');
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
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
      <Button onClick={handleClick}>plant a tree</Button>
      <Button onClick={openModal}>open modal</Button>
      <Button onClick={toggleAnimation}>toggle animation</Button>
      <Modal centered opened={isModalOpen} onClose={closeModal}>
        <Text>Les seeds Possible</Text>
      </Modal>
      {showAnimation && <Animation />}
    </>
  );
}

export default Home;
