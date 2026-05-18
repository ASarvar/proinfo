"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import AOS from "aos";
// internal
import { RightArrow } from "@svg/index";
import { useI18n } from "@i18n/i18n-context";

const slider_data = [
  {
    id: 1,
    image: "/assets/img/banner/hero-1.jpg",
    btn1Href: "/products",
    btn2Href: "/contact",
  },
  {
    id: 2,
    image: "/assets/img/banner/hero-2.jpg",
    btn1Href: "/contact",
    btn2Href: "/contact",
  },
  {
    id: 3,
    image: "/assets/img/banner/hero-3.jpg",
    btn1Href: "/products",
    btn2Href: "/about",
  },
];

const HeroBanner = () => {
  const [mounted, setMounted] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => {
    setMounted(true);
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 40,
      startEvent: "load",
    });
    requestAnimationFrame(() => {
      AOS.refreshHard();
    });
  }, []);

  if (!mounted) {
    return <section className="slider__area hero-solid" />;
  }

  return (
    <section className="slider__area hero-solid">
      <Swiper
        className="slider__active slider__active-13 swiper-container hero-solid-swiper"
        slidesPerView={1}
        spaceBetween={0}
        effect="fade"
        loop={true}
        modules={[EffectFade, Autoplay]}
        speed={900}
        autoplay={{
          delay: 5200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChangeTransitionEnd={() => {}}
      >
        {slider_data.map(({ id, image, btn1Href, btn2Href }) => (
          <SwiperSlide
            key={id}
            className="slider__item-13 slider__height-13 d-flex align-items-center hero-solid-slide"
            style={{ "--slide-bg": `url('${image}')` }}
          >
            <div className="container">
              <div className="row">
                <div className="col-xxl-7 col-xl-8 col-lg-9">
                  <div className="slider__content-13 hero-solid-content">
                    <span className="slider__title-pre-13 pb-20">
                      {t(`hero.slide${id}.preTitle`)}
                    </span>
                    <h3 className="slider__title-13">
                      {t(`hero.slide${id}.title`)}
                    </h3>
                    <p className="hero-solid-description pt-20">
                      {t(`hero.slide${id}.description`)}
                    </p>

                    <div className="slider__btn-13 hero-solid-actions pt-20">
                      <Link href={`/${locale}${btn1Href}`} className="tp-btn-2">
                        {t(`hero.slide${id}.btn1`)}
                        <span className="pl-10">
                          <RightArrow />
                        </span>
                      </Link>
                      <Link href={`/${locale}${btn2Href}`} className="tp-btn-border">
                        {t(`hero.slide${id}.btn2`)}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroBanner;
