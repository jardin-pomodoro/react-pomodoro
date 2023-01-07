import { ethers } from 'ethers';
import { contractAbi, treeToken } from './constants';

export function getContract(
  provider: ethers.providers.Web3Provider
): ethers.Contract {
  return new ethers.Contract(
    treeToken.Token,
    contractAbi,
    provider.getSigner(0)
  );
}
