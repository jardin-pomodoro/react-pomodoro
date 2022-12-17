/* eslint-disable import/prefer-default-export */
import { Grid, Container } from '@mantine/core';
import { FeaturesCard } from './card';
import './my-gallery.css';

export function MyGallery() {
  //document.body.style.backgroundColor = '#50AA8D';
  return (
    <div className="gallery-body">
      <Container>
        <Grid>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#4B8673" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#4B8673" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#76BA99" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#76BA99" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#76BA99" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#76BA99" textColor="#FFFFFF" />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeaturesCard backgroundColor="#76BA99" textColor="#FFFFFF" />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
