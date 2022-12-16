import { Grid } from '@mantine/core';
import { FeaturesCard } from '../components/gallery/card';

function Gallery() {
  return (
    <Grid grow>
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
  );
}

export default Gallery;
