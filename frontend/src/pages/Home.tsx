import { Button } from '@mantine/core';
import { HeaderMenu } from '../components/common/header';

function Home() {
  /* const PlanTreeService = useServiceStore((state) =>
    state.services.get('PlantTreeService')
  ) as PlantTreeService; */

  const plantTree = () => {
    // todo faire un truc avec
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
      <Button onClick={plantTree}>plant a tree</Button>
    </>
  );
}

export default Home;
