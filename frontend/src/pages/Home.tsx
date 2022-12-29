import { HeaderMenu } from '../components/common/header';

function Home({ provider, signer }: any) {
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
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
