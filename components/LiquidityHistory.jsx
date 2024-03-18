import React, { useState, useEffect } from "react";

//INTERNAL IMPORTS
import { shortenAddress } from "../Utils";

const LiquidityHistory = ({ GET_ALL_LIQUIDITY }) => {
  const [liquidity, setLiquidity] = useState([]);

  useEffect(() => {
    GET_ALL_LIQUIDITY().then((data) => {
      setLiquidity(data?.reverse());
    });
  }, []);
  return (
    <section>
      <div className="container">
        <div className="row medium-padding120">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div
              className="mCustomScrollbar scrollable-responsive-table"
              data-msc-theme="dark"
            >
              <table className="pricing-table-wrap-table-blurring">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Token A</th>
                    <th>Token B</th>
                    <th>Address A</th>
                    <th>Address B</th>
                    <th>PoolAddress</th>
                    <th>Created</th>
                    <th>Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {liquidity?.map((item, index) => (
                    <tr
                      key={index + 1}
                      className="crumina-module crumina-pricing-table pricing-table--style-table-blurring c-brown"
                    >
                      <td>{index + 1}</td>
                      <td className="pricing-thumb">
                        <div className="pricing-thumb">
                          <img
                            src={
                              item?.network == "80001"
                                ? "img/80001"
                                : item?.network == "157"
                                ? "img/80001"
                                : "img/logo-primary.png"
                            }
                            alt=""
                            className="woox-icon"
                          />
                          <h6 className="pricing-title">
                            {item?.tokeanA}
                            <span>
                              {item?.network == "80001"
                                ? "MATIC"
                                : item?.network == "137"
                                ? "MATIC"
                                : "WOO"}
                            </span>
                          </h6>
                        </div>
                      </td>
                      <td>
                        <div className="currency-details-item">
                          <div className="value">{item?.tokeanB}</div>
                        </div>
                      </td>
                      <td>
                        <div className="currency-details-item">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(
                                item.tokenA_Address
                              );
                            }}
                            className="value c-primary"
                          >
                            {shortenAddress(item.tokenA_Address)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="currency-details-item">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(
                                item.tokenB_Address
                              );
                            }}
                            className={`value ${
                              index % 2 === 0 ? "c-green-succes" : "c-red-light"
                            } `}
                          >
                            {shortenAddress(item.tokenB_Address)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="currency-details-item">
                          <div
                            onClick={() => {
                              navigator.clipboard.writeText(item.pollAdress);
                            }}
                            className={`value  `}
                          >
                            {shortenAddress(item.pollAdress)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="currency-details-item">
                          <div className={`value  `}>
                            {new Date(item?.timeCreated * 1000).toDateString()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <a
                          href={
                            item?.network == "80001"
                              ? `https://explorer-mumbai.maticvigil.com/tx/${item?.transactionHash}`
                              : item?.network == "137"
                              ? `https://explorer-mainnet.maticvigil.com/tx/${item?.transactionHash}`
                              : `https://explorer-mumbai.maticvigil.com/tx/${item?.transactionHash}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--small btn--green-light"
                        >
                          <i className="pencil-icon icon"></i>
                          Hash
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={8}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Delectus laboriosam voluptatem ducimus numquam, saepe
                      debitis quo ullam earum quis dolorem consequatur totam
                      velit quibusdam facere blanditiis a qui illo quaerat.
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiquidityHistory;
