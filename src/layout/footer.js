"use client";

import Link from "next/link";
import Image from "next/image";
// internal
import logo from '@assets/img/logo/logo-black.svg';
import SocialLinks from "@components/social";
import CopyrightText from "./copyright-text";
import { useI18n } from "@i18n/i18n-context";

// single widget
function SingleWidget({ col, col_2, col_3, title, contents }) {
  return (
    <div
      className={`col-xxl-${col} col-xl-${col} col-lg-3 col-md-${col_2} col-sm-6"`}
    >
      <div className={`footer__widget mb-50 footer-col-11-${col_3}`}>
        <h3 className="footer__widget-title">{title}</h3>
        <div className="footer__widget-content">
          <ul>
            {contents.map((l, i) => (
              <li key={i}>
                <Link href={l.url}>{l.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Footer = () => {
  const { t, locale } = useI18n();

  return (
    <>
      <footer>
        <div
          className="footer__area footer__style-4"
          data-bg-color="footer-bg-white"
        >
          <div className="footer__top" >
            <div className="container pt-60" style={{ borderTop: '1px solid rgba(1, 15, 28, 0.1)' }}>
              <div className="row">
                <div className="col-xxl-5 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget footer__widget-11 mb-50 footer-col-11-1">
                    <div className="footer__logo">
                      <Link href={`/${locale}`}>
                        <Image src={logo} alt="logo" />
                      </Link>
                    </div>

                    <div className="footer__widget-content">
                      <div className="footer__info">
                        <p>
                          {t("footer.aboutText")}
                        </p>
                        <div className="footer__social footer__social-11">
                          <SocialLinks/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SingleWidget
                  col="3"
                  col_2="4"
                  col_3="2"
                  contents={[
                    { url: `/${locale}`, title: t("nav.home") },
                    { url: `/${locale}/about`, title: t("footer.aboutUs") },
                    { url: `/${locale}/products`, title: t("nav.products") },
                    { url: `/${locale}/policy`, title: t("footer.privacyPolicy") },
                    { url: `/${locale}/terms`, title: t("footer.terms") },
                  ]}
                />

                <div className="col-xxl-4 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget mb-50 footer-col-11-5">
                    <h3 className="footer__widget-title">{t("footer.talkToUs")}</h3>

                    <div className="footer__widget-content">
                      <p className="footer__text">
                        {t("footer.talkText")}
                      </p>
                      <div className="footer__contact">
                        <div className="footer__contact-call">
                          <span>
                            <a href="tel:+998770796600">+998-77-079-66-00</a>
                          </span>
                        </div>
                        <div className="footer__contact-mail">
                          <span>
                            <a href="mailto:salom@proinfo.uz">
                              salom@proinfo.uz
                            </a>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="container">
              <div className="footer__bottom-inner">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="footer__copyright text-center">
                      <CopyrightText />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

