/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Modal } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { HeaderMenu } from '../../components/common/header';
import { SmartContractService } from '../../services';
import { useNftStore } from '../../stores';
import { HomeCenter } from './HomeCenter';
import { HomeModal } from './HomeModal';
import { State } from './HomeState';

export function Home({ moneyCount }: { moneyCount: number | undefined }) {
  const harvestATree = useNftStore((store) => store.harvestATree);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [state, setState] = useState<State>(State.IDLE);
  const [trees, loadImage] = useNftStore((store) => [
    store.nfts,
    store.loadImage,
  ]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const finshGrowing = () => setState(State.Ready);
  const startGrowing = () => setState(State.Growing);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  useEffect(() => {
    SmartContractService.listenToEvent('TreePlanted', (event) => {
      console.log(event);
      startGrowing();
    });
    SmartContractService.listenToEvent('TreeCollected', (event) => {
      console.log('tree collected');
      if (state === State.Ready) {
        console.log(event);
      }
      setState(State.IDLE);
    });
  }, []);

  return (
    <>
      <HeaderMenu
        links={[
          { link: '/', label: 'Home', links: [] },
          { link: '/gallery', label: 'Gallery', links: [] },
          { link: '/buy', label: 'Acheter', links: [] },
        ]}
        moneyCount={moneyCount}
      />
      <Modal centered size="xl" opened={isModalOpen} onClose={closeModal}>
        <HomeModal nfts={trees} closeModal={closeModal} />
      </Modal>
      <HomeCenter
        state={state}
        openModal={openModal}
        finishGrowing={finshGrowing}
        harvestATree={harvestATree}
      />
    </>
  );
}
