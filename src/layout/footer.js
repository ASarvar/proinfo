"use client";

import Link from "next/link";
import Image from "next/image";
// internal
import logo from '@assets/img/logo/logo-black.svg';
import SocialLinks from "@components/social";
import CopyrightText from "./copyright-text";
import { useI18n } from "@i18n/i18n-context";

// single widget with updated styling
function SingleWidget({ col, col_2, col_3, title, contents }) {
  return (
    <div
      className={`col-xxl-${col} col-xl-${col} col-lg-3 col-md-${col_2} col-sm-6`}
    >
      <div className={`footer__widget mb-50 footer-col-11-${col_3} footer__widget-wrapper`}>
        <h3 className="footer__widget-title">{title}</h3>
        <div className="footer__widget-content">
          <ul className="footer__widget-list">
            {contents.map((l, i) => (
              <li key={i} style={{ marginBottom: '10px' }}>
                <Link href={l.url} className="footer__widget-link">
                  {l.title}
                </Link>
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
          style={{ background: '#F5F6F8', borderTop: '1px solid #EAEAF0' }}
        >
          <div className="footer__top">
            <div className="container">
              <div className="row">

                {/* Logo & About */}
                <div className="col-xxl-4 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget mb-50 footer-col-11-1">
                    <div className="footer__logo" style={{ marginBottom: '18px' }}>
                      <Link href={`/${locale}`}>
                        <Image src={logo} alt="ProInfo logo" style={{ height: 'auto' }} />
                      </Link>
                    </div>

                    <div className="footer__widget-content">
                      <div className="footer__info">
                        <p className="footer__about-text">
                          {t("footer.aboutText")}
                        </p>
                        <div className="footer__social footer__social-11">
                          <SocialLinks/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Nav */}
                <SingleWidget
                  col="2.5"
                  col_2="4"
                  col_3="2"
                  title={t("footer.navigation")}
                  contents={[
                    { url: `/${locale}`, title: t("nav.home") },
                    { url: `/${locale}/about`, title: t("footer.aboutUs") },
                    { url: `/${locale}/products`, title: t("nav.products") },
                    { url: `/${locale}/policy`, title: t("footer.privacyPolicy") },
                    { url: `/${locale}/terms`, title: t("footer.terms") },
                  ]}
                />

                {/* Resources / Secondary Nav */}
                <SingleWidget
                  col="2"
                  col_2="4"
                  col_3="2"
                  title={t("footer.resources")}
                  contents={[
                    { url: `/${locale}/blog`, title: t("footer.blog") },
                    { url: `/${locale}/faq`, title: t("footer.faq") },
                    { url: `/${locale}/download`, title: t("footer.downloads") },
                    { url: `/${locale}/contact`, title: t("nav.contactUs") },
                  ]}
                />

                {/* Contact */}
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-5 col-sm-6">
                  <div className="footer__widget mb-50 footer-col-11-5">
                    <h3 className="footer__widget-title">{t("footer.talkToUs")}</h3>

                    <div className="footer__widget-content">
                      <p className="footer__about-text">
                        {t("footer.talkText")}
                      </p>
                      <div className="footer__contact footer__contact-container">
                        <div className="footer__contact-call footer__contact-item">
                          <span className="footer__contact-icon">📞</span>
                          <a href="tel:+998770796600" className="footer__contact-link">
                            +998-77-079-66-00
                          </a>
                        </div>
                        <div className="footer__contact-mail footer__contact-item">
                          <span className="footer__contact-icon">✉️</span>
                          <a href="mailto:salom@proinfo.uz" className="footer__contact-link">
                            salom@proinfo.uz
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="footer__bottom" style={{ background: '#fff', borderTop: '1px solid #EAEAF0' }}>
            <div className="container">
              <div className="footer__bottom-inner">
                <div className="row">
                  <div className="col-sm-12">
                    <div className="footer__copyright text-center">
                      <p className="footer__copyright-text">
                        <CopyrightText />
                      </p>
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

