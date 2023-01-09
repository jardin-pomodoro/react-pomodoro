import { Button, Text, Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import { HeaderMenu } from '../components/common/header';
import { Animation } from '../components';
import { useNftStore } from '../stores';
import { useSeedsStore } from '../stores/SeedStore';

function Home() {
  /* const PlanTreeService = useServiceStore((state) =>
    state.services.get('PlantTreeService')
  ) as PlantTreeService; */

  const urls = [
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.5C9gFPw7872f4tj_d4zHeAHaJ4%26pid%3DApi&f=1&ipt=43232372ee367777dad40c85d764ce8155ace8bf83bf532a278bbfd05853fe44&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.FAotVOTy2RCDRbCACgqM6AEsDH%26pid%3DApi&f=1&ipt=bf5b11dbd61cf0239a3cb13dfa58671907fb16ed1d12219d9dc9086afad45de0&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.aitV_SjOcEbY_pZryzVZjAHaLL%26pid%3DApi&f=1&ipt=206dd261020c0e02e5470fa84dff1c70c6d12e66c8732f245a2db60759b38ea0&ipo=images',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.6ixLndMedTwg8l15v3QE9QHaJ4%26pid%3DApi&f=1&ipt=a7e8e21eaf5cf3a5399190ce7468064551d40bfcc3563788bea51f6592261003&ipo=images',
  ];

  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [showAnimation, setAnimation] = useState<boolean>(false);
  const [plantATree, trees] = useNftStore((store) => [store.plantATree, store.nfts]);
  const [seeds, getSeeds] = useSeedsStore((store) => [
    store.seeds,
    store.getSeeds,
  ]);

  useEffect(() => {
    // for (tree in trees) {
    //   getSeeds(tree);
    // }
  }, [getSeeds]);

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
        <Text>{JSON.stringify(seeds)}</Text>
      </Modal>
      {showAnimation && <Animation />}
    </>
  );
}

export default Home;
