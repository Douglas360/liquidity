import React, { useState, useEffect } from "react";

import { Input } from "./index";

const PoolInput = ({
  setPoolAddress,
  notifyError,
  notifySuccess,
  LOAD_TOKEN,
  GET_POOL_ADDRESS,
}) => {
  const [token_1, setToken_1] = useState();
  const [token_2, setToken_2] = useState();
  const [fee, setFee] = useState();
  //DISPLAY TOKENS
  const [token_A, setToken_A] = useState();
  const [token_B, setToken_B] = useState();

  useEffect(() => {
    const loadTokens = async () => {
      const token = await LOAD_TOKEN(token_B);
      if (token == undefined) {
        //console.log("Token not found");
      } else {
        setToken_A(token);
      }
    };
    loadTokens();
  }, [token_B]);

  useEffect(() => {
    const loadTokens = async () => {
      const token = await LOAD_TOKEN(token_A);
      console.log("INF-TOKEN: " + token);
      if (token == undefined) {
        //console.log("Token not found");
      } else {
        setToken_B(token);
      }
    };
    loadTokens();
  }, [token_A]);

  const CALLING_POOL_ADD = async () => {
    if (!token_1 || !token_2 || !fee) {
      return notifyError("Provide all the required fields");
    } else {
      const pool = await GET_POOL_ADDRESS(token_1, token_2, fee);
      if (pool == undefined) {
        notifyError("Pool not found");
      } else {
        setPoolAddress(pool[0]);
        notifySuccess("Pool found");
      }
    }
  };

  return (
    <>
      {token_1 ? (
        <Input
          value={`${token_1?.name}(${
            token_1?.symbol
          }) Bal: ${token_1?.balance.slice(0, 8)}`}
        />
      ) : (
        <Input
          placeHolder="Token A"
          handleClick={(e) => setToken_A(e.target.value)}
        />
      )}
      {token_2 ? (
        <Input
          value={`${token_2?.name}(${
            token_2?.symbol
          }) Bal: ${token_2?.balance.slice(0, 8)}`}
        />
      ) : (
        <Input
          placeHolder="Token B"
          handleClick={(e) => setToken_B(e.target.value)}
        />
      )}

      <Input
        placeHolder="Feee
      "
        handleClick={(e) => setFee(e.target.value)}
      />
      <button
        onClick={() => CALLING_POOL_ADD()}
        className="btn btn--large btn--green-light btn--with-icon btn--icon-right full-width"
      >
        Check Pool
        <svg className="woox-icon icon-arrow-right">
          <use xlinkHref="#icon-arrow-right"></use>
        </svg>
      </button>
    </>
  );
};

export default PoolInput;
