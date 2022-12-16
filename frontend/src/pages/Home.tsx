import { HeaderMenu } from '../components/common/header';

function Home() {
  return (
    <>
      <HeaderMenu
        links={[
          { link: '', label: 'Home', links: [] },
          { link: '', label: 'gallery', links: [] },
        ]}
      />
      <h1>Hello World !</h1>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
