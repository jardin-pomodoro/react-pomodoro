import { Button } from '@mantine/core';
import { useRive } from 'rive-react';
import { useState } from 'react';

function Home() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationText, setAnimationText] = useState('');
  const { rive, RiveComponent: RiveComponentPlayback } = useRive({
    src: 'tree.riv',
    artboard: 'Grow',
    autoplay: true,
    onPause: () => {
      setAnimationText('Animation paused!');
    },
    onPlay: () => {
      setAnimationText('Animation is playing..');
    },
  });

  const togglePlaying = () => {
    if (rive === null) {
      return;
    }
    if (isPlaying) {
      rive.pause();
      setIsPlaying(false);
    } else {
      rive.play();
      setIsPlaying(true);
    }
  };
  return (
    <>
      <br />
      <h1>Hello World !</h1>
      <div className="center">
        <RiveComponentPlayback className="base-canvas-size" />
        <p>{animationText}</p>
        <Button onClick={togglePlaying}>{isPlaying ? 'Pause' : 'Play'}</Button>
      </div>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
