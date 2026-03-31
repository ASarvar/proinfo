"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import AOS from "aos";
// internal
import { RightArrow } from "@svg/index";
import { useI18n } from "@i18n/i18n-context";

const slider_data = [1, 2, 3];

const HeroBanner = () => {
  const [loop, setLoop] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => {
    setLoop(true);
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

  return (
    <section className="slider__area hero-solid">
      <Swiper
        className="slider__active slider__active-13 swiper-container hero-solid-swiper"
        slidesPerView={1}
        spaceBetween={0}
        effect="fade"
        loop={loop}
        modules={[EffectFade, Autoplay]}
        speed={900}
        autoplay={{
          delay: 5200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSlideChangeTransitionEnd={() => AOS.refreshHard()}
      >
        {slider_data.map((id) => (
          <SwiperSlide
            key={id}
            className="slider__item-13 slider__height-13 d-flex align-items-center hero-solid-slide"
          >
            <div className="container">
              <div className="row">
                <div className="col-xxl-7 col-xl-8 col-lg-9">
                  <div className="slider__content-13 hero-solid-content">
                    <span className="slider__title-pre-13 pb-20" data-aos="fade-down" data-aos-delay="50">
                      {t(`hero.slide${id}.preTitle`)}
                    </span>
                    <h3 className="slider__title-13" data-aos="fade-up" data-aos-delay="130">
                      {t(`hero.slide${id}.title`)}
                    </h3>
                    <p
                      className="hero-solid-description"
                      data-aos="slide-up"
                      data-aos-delay="210"
                    >
                      {t(`hero.slide${id}.description`)}
                    </p>

                    <div className="slider__btn-13 hero-solid-actions" data-aos="fade-up" data-aos-delay="290">
                      <Link href={`/${locale}/products`} className="tp-btn-2">
                        {t("hero.actions.solutions")}
                        <span className="pl-10">
                          <RightArrow />
                        </span>
                      </Link>
                      <Link href={`/${locale}/contact`} className="tp-btn-border">
                        {t("hero.actions.contact")}
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
