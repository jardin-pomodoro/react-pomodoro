import { HeaderMenu } from '../components/common/header';
import { Banner } from '../components/gallery/Banner';
import { MyGallery } from '../components/gallery/MyGallery';

function Gallery() {
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/acheter', label: 'Acheter', links: [] },
        ]}
      />
      <Banner
        backgroundColor="#4B8673"
        textColor="white"
        title="Fusionnez vos arbres"
        description="Il ne vous manque qu'un arbre pour pouvoir procéder à la fusion"
        buttonText="Fusionner"
        buttonValidity={true}
      />
      <MyGallery />
    </>
  );
}

export default Gallery;
