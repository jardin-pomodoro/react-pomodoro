import { Divider, Grid } from '@mantine/core';
import { HeaderMenu } from '../components/common/header';
import { FeaturesCard } from '../components/gallery/card';

function Gallery() {
  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'gallery', links: [] },
        ]}
      />
      <Grid>
        <Divider my="m" />
        <Grid.Col span={4}>
          <FeaturesCard />
        </Grid.Col>
        <Grid.Col span={4}>
          <FeaturesCard />
        </Grid.Col>
        <Grid.Col span={4}>
          <FeaturesCard />
        </Grid.Col>
        <Grid.Col span={4}>
          <FeaturesCard />
        </Grid.Col>
        <Grid.Col span={4}>
          <FeaturesCard />
        </Grid.Col>
      </Grid>
    </>
  );
}

export default Gallery;
