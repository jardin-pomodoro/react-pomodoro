import { HeaderMenu } from '../components/common/header';

function Home() {
  return (
    <>
      <HeaderMenu
        links={[
          { link: './', label: 'Home', links: [] },
          { link: './gallery', label: 'Gallery', links: [] },
          { link: './acheter', label: 'Acheter', links: [] },
        ]}
      />
      <h1>Hello World !</h1>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
