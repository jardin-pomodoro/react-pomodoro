import { HeaderMenu } from '../components/common/header';
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
      <MyGallery />
    </>
  );
}

export default Gallery;
