import React, { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import Web3Modal, { local } from "web3modal";
import axios from "axios";
import UniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json";
import toast from "react-hot-toast";

import { Token } from "@uniswap/sdk-core";
import { Pool, Position, nearestUsableTick } from "@uniswap/v3-sdk";
import { abi as IUniswapV3PoolABI } from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { abi as INonfungiblePositionManager } from "@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json";
import ERC20ABI from "./abi.json";

//INTERNAL IMPORT
import {
  ERC20ABI,
  TOKEN_ABI,
  V3_SWAP_ROUTER_ADDRESS,
  CONNECTING_CONTRACT,
  FACTORY_ABI,
  FACTORY_ADDRESS,
  web3Provider,
  positionManagerAddress,
  internalWooxContract,
  internalICOWooxContract,
  internalAddLiquidity,
  getBalance,
} from "./constants";
import { parseErrorMsg } from "./utils";

export const CONTEXT = React.createContext();

export const CONTEXT_Provider = ({ children }) => {
  const DAPP_NAME = "Woox";
  const [loader, setLoader] = useState(false);
  const [address, setAddress] = useState("");
  const [chainID, setChainID] = useState();

  //TOKEN
  const [balance, setBalance] = useState();
  const [nativeToken, setNativeToken] = useState();
  const [tokenHolder, setTokenHolder] = useState([]);
  const [tokenSale, setTokenSale] = useState();
  const [currentHolder, setCurrentHolder] = useState();

  //NOTIFICATION
  const notifyError = (msg) => toast.error(msg, { duration: 4000 });
  const notifySuccess = (msg) => toast.success(msg, { duration: 4000 });

  //CONNECT WALLET
  const connect = async () => {
    try {
      if (!window.ethereum) {
        notifyError("No wallet detected");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
      } else {
        notifyError("No account found");
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setChainID(network.chainId);
    } catch (error) {
      notifyError(parseErrorMsg(error));
      console.log("Error in connect: ", error);
    }
  };

  //CHECK IF WALLET IS CONNECTED
  const checkIfWalletConnected = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    return accounts[0];
  };

  const LOAD_TOKEN = async (token) => {
    try {
      const tokenDetail = await CONNECTING_CONTRACT(token);
      return tokenDetail;
    } catch (error) {
      notifyError(parseErrorMsg(error));
      console.log("Error in LOAD_TOKEN: ", error);
    }
  };

  //GET POOL ADDRESS
  const GET_POOL_ADDRESS = async (token_1, token_2, fee) => {
    try {
      setLoader(true);
      const PROVIDER = await web3Provider();

      const factoryContract = new Contract(
        FACTORY_ADDRESS,
        FACTORY_ABI,
        web3Provider
      );
      const poolAddress = await factoryContract.getPool(
        token_1,
        token_2,
        Number(fee)
      );
      const poolHistory = {
        token_A: token_1,
        token_B: token_2,
        fee: fee,
        network: token_1.chainId,
        poolAddress: poolAddress,
      };

      const zeroAdd = "0x0000000000000000000000000000000000000000";

      if (poolAddress === zeroAdd) {
        notifySuccess("Pool not found");
      } else {
        let poolArray = [];
        const poolLists = localStorage.getItem("poolHistory");
        if (poolLists) {
          poolArray = JSON.parse(localStorage.getItem("poolHistory"));
          poolArray.push(poolHistory);
          localStorage.setItem("poolHistory", JSON.stringify(poolArray));
        } else {
          poolArray.push(poolHistory);
          localStorage.setItem("poolHistory", JSON.stringify(poolArray));
        }
        setLoader(false);
        notifySuccess("Succesfully Completed");
      }
      return poolAddress;
    } catch (error) {
      setLoader(false);
      notifyError(parseErrorMsg(error));
      console.log("Error in GET_POOL_ADDRESS: ", error);
    }
  };

  //CREATE LIQUIDITY
  async function getPoolData(poolContract) {
    const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
      poolContract.tickSpacing(),
      poolContract.fee(),
      poolContract.liquidity(),
      poolContract.slot0(),
    ]);

    return {
      tickSpacing: tickSpacing,
      fee: fee,
      liquidity: liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  }

  const CREATE_LIQUIDITY = async (pool, liquidityAmount, approveAmount) => {
    try {
      setLoader(true);
      const address = await checkIfWalletConnected();
      const PROVIDER = await web3Provider();
      const signer = PROVIDER.getSigner();

      const TOKEN_1 = new Token(
        pool.token_A.chainId,
        pool.token_A.address,
        pool.token_A.decimals,
        pool.token_A.symbol,
        pool.token_A.name
      );

      const TOKEN_2 = new Token(
        pool.token_B.chainId,
        pool.token_B.address,
        pool.token_B.decimals,
        pool.token_B.symbol,
        pool.token_B.name
      );

      const pollAddress = pool.poolAddress[0];

      const nonfungiblePositionManagerContract = new ethers.Contract(
        positionManagerAddress,
        INonfungiblePositionManager,
        PROVIDER
      );
      const poolContract = new ethers.Contract(
        pollAddress,
        IUniswapV3PoolABI,
        PROVIDER
      );

      const poolData = await getPoolData(poolContract);

      const TOKEN_1_TOKEN_2_POOL = new Pool(
        TOKEN_1,
        TOKEN_2,
        poolData.fee,
        poolData.sqrtPriceX96.toString(),
        poolData.liquidity.toString(),
        poolData.tick
      );

      const position = new Position({
        pool: TOKEN_1_TOKEN_2_POOL,
        liquidity: ethers.utils.parseUnits(liquidityAmount, 18),
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
      });

      const approvalAmount = ethers.utils
        .parseUnits(liquidityAmount, 18)
        .toString();

      const tokenContract0 = new ethers.Contract(
        pool.token_A.address,
        ERC20ABI,
        PROVIDER
      );

      await tokenContract0
        .connect(signer)
        .approve(positionManagerAddress, approvalAmount);

      const tokenContract1 = new ethers.Contract(
        pool.token_B.address,
        ERC20ABI,
        PROVIDER
      );

      await tokenContract1
        .connect(signer)
        .approve(positionManagerAddress, approvalAmount);

      const { amount0: amount0Desired, amount1: amount1Desired } =
        position.mintAmounts;
      //mintAmountWithSlippage

      const params = {
        token0: pool.token_A.address,
        token1: pool.token_B.address,
        fee: poolData.fee,
        tickLower:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) -
          poolData.tickSpacing * 2,
        tickUpper:
          nearestUsableTick(poolData.tick, poolData.tickSpacing) +
          poolData.tickSpacing * 2,
        amount0Desired: amount0Desired.toString(),
        amount1Desired: amount1Desired.toString(),
        amount0Min: amount0Desired.toString(),
        amount1Min: amount1Desired.toString(),
        recipient: address,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      };

      const tx = await nonfungiblePositionManagerContract
        .connect(signer)
        .mint(params, { gasLimit: ethers.utils.hexlify(1000000) })
        .then((res) => {
          setLoader(false);
          notifySuccess("Liquidity Added Successfully");
          return res.hash;
        });

      if (tx) {
        const liquidityContract = await internalAddLiquidity();
        const addLiquidityData = await liquidityContract
          .connect(signer)
          .addLiquidity(
            pool.token_A.name,
            pool.token_B.name,
            pool.token_A.address,
            pool.token_B.address,
            pollAddress,
            pool.token_B.chainId.toString(),
            tx
          );
        await addLiquidityData.wait();

        setLoader(false);
        notifySuccess("Liquidity Added Successfully");
        window.location.reload();
      }
    } catch (error) {
      setLoader(false);
      notifyError(parseErrorMsg(error));
      console.log("Error in CREATE_LIQUIDITY: ", error);
    }
  };

  //NATIVE TOKEN
  const fetchInitialData = async () => {
    try {
      //GET USER ACCOUNT
      const account = await checkIfWalletConnected();

      //GET USER BALANCE
      const balance = await getBalance();
      setBalance(ethers.utils.formatEther(balance.toString()));
      setAddress(account);

      //WOOX_TOKEN_CONTRACT
      const WOOX_TOKEN_CONTRACT = await internalWooxContract();

      let tokenBalance;
      if (account) {
        tokenBalance = await WOOX_TOKEN_CONTRACT.balanceOf(account);
      } else {
        tokenBalance = 0;
      }

      const tokenName = await WOOX_TOKEN_CONTRACT.name();
      const tokenSymbol = await WOOX_TOKEN_CONTRACT.symbol();
      const tokenTotalSupply = await WOOX_TOKEN_CONTRACT.totalSupply();
      const tokenStandard = await WOOX_TOKEN_CONTRACT.standard();
      const tokenHolder = await WOOX_TOKEN_CONTRACT._userId();
      const tokenOwnerOfContract = await WOOX_TOKEN_CONTRACT.ownerOfContract();
      const tokenAddress = WOOX_TOKEN_CONTRACT.address;

      const nativeToken = {
        tokenAddress: tokenAddress,
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        tokenStandard: tokenStandard,
        tokenTotalSupply: ethers.utils.formatEther(tokenTotalSupply.toString()),
        tokenBalance: ethers.utils.formatEther(tokenBalance.toString()),
        tokenOwnerOfContract: tokenOwnerOfContract,
        tokenHolder: tokenHolder.toNumber(),
      };
      setNativeToken(nativeToken);

      //GETTING TOKEN HOLDERS
      const getTokenHolder = await WOOX_TOKEN_CONTRACT.getTokenHolder();
      setTokenHolder(getTokenHolder);

      //GETTING TOKEN HOLDER DATA
      if (account) {
        const getTokenHolderData = await WOOX_TOKEN_CONTRACT.getTokenHolderData(
          account
        );

        const currentHolder = {
          tokenId: getTokenHolderData[0].toNumber(),
          from: getTokenHolderData[1],
          to: getTokenHolderData[2],
          totalToken: ethers.utils.formatEther(
            getTokenHolderData[3].toString()
          ),
          tokenHolder: getTokenHolderData[4],
        };
        setCurrentHolder(currentHolder);
      }

      //TOKEN SALE CONTRACT
      const ICO_WOOX_CONTRACT = await internalICOWooxContract();
      const tokenPrice = await ICO_WOOX_CONTRACT.tokenPrice();
      const tokenSold = await ICO_WOOX_CONTRACT.tokensSold();
      const tokenSaleBalance = await WOOX_TOKEN_CONTRACT.balanceOf(
        ICO_WOOX_CONTRACT.address //AQUI CHAMOU HARDCODED
      );

      const tokenSale = {
        tokenPrice: ethers.utils.formatEther(tokenPrice.toString()),
        tokenSold: ethers.utils.formatEther(tokenSold.toString()),
        tokenSaleBalance: ethers.utils.formatEther(tokenSaleBalance.toString()),
      };

      setTokenSale(tokenSale);
      console.log(tokenSale);
      console.log(nativeToken);
    } catch (error) {
      notifyError(parseErrorMsg(error));
      console.log("Error in fetchInitialData: ", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const buyToken = async (nToken) => {
    try {
      setLoader(true);
      const PROVIDER = await web3Provider();
      const signer = PROVIDER.getSigner();

      const contract = await internalICOWooxContract();
      console.log(contract);

      const price = 0.0001 * nToken;
      const amount = ethers.utils.parseUnits(price.toString(), "ether");

      const buying = await contract.connect(signer).buyTokens(nToken, {
        value: amount.toString(),
        gasLimit: ethers.utils.hexlify(1000000),
      });

      await buying.wait();
      setLoader(false);
      notifySuccess("Token Bought Successfully");
      window.location.reload();
    } catch (error) {
      setLoader(false);
      notifyError(parseErrorMsg(error));
      console.log("Error in buyToken: ", error);
    }
  };

  //NATIVE TOKEN TRANSFER metodo um pouco diferente do video 2:03:42
  const transferNativeToken = async (to, amount) => {
    try {
      setLoader(true);
      const PROVIDER = await web3Provider();
      const signer = PROVIDER.getSigner();

      const contract = await internalWooxContract();
      const transfer = await contract
        .connect(signer)
        .transfer(to, ethers.utils.parseUnits(amount, "ether"));

      await transfer.wait();
      setLoader(false);
      notifySuccess("Token Transfered Successfully");
      window.location.reload();
    } catch (error) {
      setLoader(false);
      notifyError(parseErrorMsg(error));
      console.log("Error in transferToken: ", error);
    }
  };

  //LIQUIDITY HISTORY
  const GET_ALL_LIQUIDITY = async () => {
    try {
      //GET USER ACCOUNT
      const account = await checkIfWalletConnected();

      const contract = await internalAddLiquidity();
      const liquidityHistory = await contract.getAllLiquidity(account);

      const AllLiquidity = liquidityHistory.map((liquidity) => {
        const liquidityArray = {
          id: liquidity.id.toNumber(),
          network: liquidity.network,
          owner: liquidity.owner,
          poolAddress: liquidity.poolAddress,
          tokenA: liquidity.tokenA,
          tokenB: liquidity.tokenB,
          tokenA_Address: liquidity.tokenA_Address,
          tokenB_Address: liquidity.tokenB_Address,
          timeCreated: liquidity.timeCreated.toNumber(),
          transactionHash: liquidity.transactionHash,
        };
        return liquidityArray;
      });

      return AllLiquidity;
    } catch (error) {
      console.log("Error in GET_ALL_LIQUIDITY: ", error);
    }
  };

  return (
    <CONTEXT.Provider
      value={{
        loader,
        address,
        chainID,
        balance,
        nativeToken,
        tokenHolder,
        tokenSale,
        currentHolder,
        DAPP_NAME,
        notifyError,
        notifySuccess,
        connect,
        LOAD_TOKEN,
        GET_POOL_ADDRESS,
        CREATE_LIQUIDITY,
        buyToken,
        transferNativeToken,
        GET_ALL_LIQUIDITY,
      }}
    >
      {children}
    </CONTEXT.Provider>
  );
};
