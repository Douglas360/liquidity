import React, { useState, useContext } from "react";

import {
  Header,
  Footer,
  Hero,
  ICOTokens,
  LiquidityHistory,
  ICOSale,
  Access,
  Analytic,
  App,
  AddLiquidity,
  AddPool,
  SuccessPool,
  NoPool,
  Loader,
  Input,
  PoolInput,
  HeaderICON,
  FooterICON,
} from "../components";

import { CONTEXT } from "../context";

const index = () => {
  const {
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
  } = useContext(CONTEXT);

  //MODEL STATE
  const [openAddPool, setOpenAddPool] = useState(false);
  const [openAllLiquidity, setOpenAllLiquidity] = useState(false);
  return (
    <div className="crumina-grid">
      <Header
        setOpenAddPool={setOpenAddPool}
        setOpenAllLiquidity={setOpenAllLiquidity}
        connect={connect}
        address={address}
      />
      <div className="main-content-wrapper">
        <Hero transferNativeToken={transferNativeToken} />
        <ICOTokens />
        <LiquidityHistory GET_ALL_LIQUIDITY={GET_ALL_LIQUIDITY} />
        <App />
        <Analytic />
        <Access />
        <ICOSale
          tokenSale={tokenSale}
          buyToken={buyToken}
          nativeToken={nativeToken}
        />
      </div>
      {openAddPool && (
        <div className="new_center">
          <AddPool
            setOpenAddPool={setOpenAddPool}
            LOAD_TOKEN={LOAD_TOKEN}
            notifyError={notifyError}
            notifySuccess={notifySuccess}
            GET_POOL_ADDRESS={GET_POOL_ADDRESS}
          />
        </div>
      )}

      {openAllLiquidity && (
        <div className="new_center">
          <AddLiquidity
            CREATE_LIQUIDITY={CREATE_LIQUIDITY}
            setOpenAllLiquidity={setOpenAllLiquidity}
          />
        </div>
      )}

      {loader && (
        <div className="new_center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default index;
