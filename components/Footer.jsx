import React from "react";
import {
  TiSocialPinterestCircular,
  TiSocialYoutube,
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialInstagram,
} from "react-icons/ti";
import { FooterICON } from "./index";

const Footer = () => {
  const socials = [
    {
      icon: <TiSocialPinterestCircular />,
      link: "https://www.pinterest.com/",
      name: "Pinterest",
    },
    {
      icon: <TiSocialYoutube />,
      link: "https://www.youtube.com/",
      name: "Youtube",
    },
    {
      icon: <TiSocialFacebook />,
      link: "https://www.facebook.com/",
      name: "Facebook",
    },
    {
      icon: <TiSocialTwitter />,
      link: "https://twitter.com/",
      name: "Twitter",
    },
    {
      icon: <TiSocialInstagram />,
      link: "https://www.instagram.com/",
      name: "Instagram",
    },
  ];
  return (
    <footer className="footer" id="site-footer">
      <canvas id="can"></canvas>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-sm-offset-0 col-xs-12">
            <div className="widget w-info">
              <a href="/" className="site-logo">
                <img src="img/logo-primary.png" alt="" />
                <FooterICON />
              </a>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              </p>
            </div>
            <div className="widget w-contacts">
              <ul className="socials socials--white">
                {socials.map((social, index) => (
                  <li key={index} className="social-item">
                    <a href={social.link} className="woox-icon">
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="sub-footer">
        <div className="container">
          <div className="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-sm-offset-0 col-xs-12">
            <span>@ All right reserved 2024</span>
            <span>
              <a href="/">The Woox</a> - ICO and CryptoCurrency
            </span>
            <div className="logo-design">
              <img src="img/logo-fire.png" alt="" />
              <div className="design-wrap">
                <div className="sup-title">Design By</div>
                <a href="/" className="logo-title">
                  Douglas Duarte
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a href="#" className="back-to-top">
        <svg className="woox-icon icon-top-arrow">
          <use xlinkHref="#icon-top-arrow"></use>
        </svg>
      </a>
    </footer>
  );
};

export default Footer;
