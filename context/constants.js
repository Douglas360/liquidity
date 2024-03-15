//Woox deployed to: 0x3AFDa1b2f78A02c13b143f3cD2B0f4A1508B61C9
//ICO WOOX deployed to: 0x948395162c919Fc2deB2E8d8cCB1A1b139613Ea8
//Liquidity deployed to: 0xfF28aDD6cbFCE87A05D7b5A629e209D9Bfc32c6D
import { ethers } from "ethers";
import Web3Modal from "web3modal";

//INTERNALIMPORT
import factoryAbi from "./factoryAbi.json";
import ERC20ABI from "./abi.json";

import Woox from "./Woox.json";
import ICOWoox from "./ICOWoox.json";
import Liquidity from "./Liquidity.json";

//TOKEN
export const Woox_ADDRESS = "0x3AFDa1b2f78A02c13b143f3cD2B0f4A1508B61C9";
export const Woox_ABI = Woox.abi;

//TOKEN SALE
export const ICOWoox_ADDRESS = "0x948395162c919Fc2deB2E8d8cCB1A1b139613Ea8";
export const ICOWoox_ABI = ICOWoox.abi;

//LIQUIDITY
export const Liquidity_ADDRESS = "0xfF28aDD6cbFCE87A05D7b5A629e209D9Bfc32c6D";
export const Liquidity_ABI = Liquidity.abi;

//FACTORY
export const FACTORY_ADDRESS = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
export const FACTORY_ABI = factoryAbi;
export const positionManagerAddress =
  "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";

const fetchContract = (signer, ABI, ADDRESS) => {
  return new ethers.Contract(ADDRESS, ABI, signer);
};

export const web3Provider = async () => {
  try {
    const providerOptions = {
      /* See Provider Options Section */
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });

    const provider = await web3Modal.connect();
    return new ethers.providers.Web3Provider(provider);
  } catch (error) {
    console.error(error);
  }
};

export const CONNECTION_CONTRACT = async (ADDRESS) => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const network = await provider.getNetwork();

    const signer = provider.getSigner();
    const contract = fetchContract(signer, ERC20ABI, ADDRESS);

    //USER ADDRESS
    const userAddress = await signer.getAddress();
    const balance = await contract.balanceOf(userAddress);

    const name = await contract.name();
    const symbol = await contract.symbol();
    const supply = await contract.totalSupply();
    const decimals = await contract.decimals();
    const address = contract.address;

    const token = {
      address: address,
      name: name,
      symbol: symbol,
      supply: ethers.utils.formatEther(supply.toString()),
      decimals: decimals,
      balance: ethers.utils.formatEther(balance.toString()),
      userAddress: userAddress,
    };

    return token;
  } catch (error) {
    console.error(error);
  }
};

export const internalWooxContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = fetchContract(provider, Woox_ABI, Woox_ADDRESS);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const internalICOWooxContract = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = fetchContract(provider, ICOWoox_ABI, ICOWoox_ADDRESS);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const internalAddLiquidity = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const contract = fetchContract(provider, Liquidity_ABI, Liquidity_ADDRESS);

    return contract;
  } catch (error) {
    console.log(error);
  }
};

export const getBalance = async () => {
  try {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    return await signer.getBalance();
  } catch (error) {
    console.log(error);
  }
};
