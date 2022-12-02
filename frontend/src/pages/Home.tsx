import { useRive, useStateMachineInput } from '@rive-app/react-canvas';

function Home() {
  const { rive, RiveComponent: RiveComponentPlayback } = useRive({
    src: '/tree.riv',
  });

  const levelInput = useStateMachineInput(rive);
  return (
    <>
      <RiveComponentPlayback height="80vh" />
      <button
        type="button"
        onClick={() => {
          if (levelInput) {
            (levelInput.value as number) -= 1;
          }
        }}
      >
        decrease 1
      </button>
    </>
  );

  // return <Rive src="/tree.riv" />;
}

export default Home;
