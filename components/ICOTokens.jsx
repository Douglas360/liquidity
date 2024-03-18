import React from "react";

const ICOTokens = () => {
  return (
    <section className="medium-padding100">
      <div className="container">
        <div className="row align-center" id="started">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="crumina-module crumina-module-slider pagination-bottom-center">
              <div
                className="swiper-container"
                data-show-items="3"
                data-prev-next="1"
              >
                <div className="new_flex">
                  {/*FIRST SWIPER */}
                  <div className="swiper-slide">
                    <div className="crumina-module crumina-pricing-table pricing-table--small">
                      <div className="pricing-thumb">
                        <img
                          src="img/if_Bitcoin_2745023.png"
                          alt=""
                          className="woox-icon"
                        />
                        <h5 className="pricing-title">
                          Bitcoin <span>BTC</span>
                        </h5>
                        <div className="gain-drop-arrow">
                          <svg className="woox-icon icon-arrow-up arrow-up active">
                            <use xlinkHref="#icon-arrow-up" />
                          </svg>
                          <svg className="woox-icon icon-arrow-up arrow-down active">
                            <use xlinkHref="#icon-arrow-down" />
                          </svg>
                        </div>
                      </div>
                      <div className="price">
                        <div className="prive-sup-title">1 Bitcoin equals:</div>
                        <div className="price-value">$94772.3</div>
                        <div className="growth">+ 1.25%</div>
                      </div>
                      <a className="btn btn--large btn--datk-lighter btn--transparent full-width">
                        Buy Bitcoin Now!
                      </a>
                    </div>
                  </div>

                  {/*SECOND SWIPER */}
                  <div className="swiper-slide">
                    <div className="crumina-module crumina-pricing-table pricing-table--small">
                      <div className="pricing-thumb">
                        <img
                          src="img/if_etherium_eth_ethcoin_crypto_2844386.png"
                          alt=""
                          className="woox-icon"
                        />
                        <h5 className="pricing-title">
                          Ethereum <span>ETH</span>
                        </h5>
                        <div className="gain-drop-arrow">
                          <svg className="woox-icon icon-arrow-up arrow-up active">
                            <use xlinkHref="#icon-arrow-up" />
                          </svg>
                          <svg className="woox-icon icon-arrow-up arrow-down active">
                            <use xlinkHref="#icon-arrow-down" />
                          </svg>
                        </div>
                      </div>
                      <div className="price">
                        <div className="prive-sup-title">1 Bitcoin equals:</div>
                        <div className="price-value">$4772.3</div>
                        <div className="growth">+ 3.25%</div>
                      </div>
                      <a className="btn btn--large btn--datk-lighter btn--transparent full-width">
                        Buy Ethereum Now!
                      </a>
                    </div>
                  </div>

                  {/*THIRD SWIPER */}
                  <div className="swiper-slide">
                    <div className="crumina-module crumina-pricing-table pricing-table--small">
                      <div className="pricing-thumb">
                        <img
                          src="img/if_dash_dashcoin_2844383.png"
                          alt=""
                          className="woox-icon"
                        />
                        <h5 className="pricing-title">
                          Dash <span>Dash</span>
                        </h5>
                        <div className="gain-drop-arrow">
                          <svg className="woox-icon icon-arrow-up arrow-up active">
                            <use xlinkHref="#icon-arrow-up" />
                          </svg>
                          <svg className="woox-icon icon-arrow-up arrow-down active">
                            <use xlinkHref="#icon-arrow-down" />
                          </svg>
                        </div>
                      </div>
                      <div className="price">
                        <div className="prive-sup-title">1 Bitcoin equals:</div>
                        <div className="price-value">$72.3</div>
                        <div className="growth">+ 1.95%</div>
                      </div>
                      <a className="btn btn--large btn--datk-lighter btn--transparent full-width">
                        Buy Dash Now!
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ICOTokens;
