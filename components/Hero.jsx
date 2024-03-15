import React from "react";

const Hero = ({ transferNativeToken }) => {
  return (
    <section
      data-settings="particles-1"
      className="main-section curmina-flying-balls particles-js bg-1"
    >
      <div className="container">
        <div className="row medium-padding120 align-center">
          <div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12">
            <header className="crumina-module curmina-heading heading--h2 heading--with-decoration">
              <div className="heading-sup-title">Coin Market</div>
              <h2 className="heading-title heading--half-colored">
                Created Liquidity Marketplace
              </h2>
              <div className="heading-text">
                Coin Market is a decentralized finance (DeFi) application that
                allows users to create liquidity pools and trade tokens. It also
                allows users to create and participate in token sales.
              </div>
            </header>
            <a
              onClick={() => transferNativeToken()}
              href="#buyWoox"
              className="btn btn--large btn--primary btn--transparent"
            >
              Get Woox Token Now!
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
