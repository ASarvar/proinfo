"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
// internal
import { RightArrow } from "@svg/index";
import { useI18n } from "@i18n/i18n-context";

const slider_data = [1, 2, 3];

const HeroBanner = () => {
  const [loop, setLoop] = useState(false);
  const { t, locale } = useI18n();

  useEffect(() => setLoop(true), []);

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
                    <span className="slider__title-pre-13 pb-20">{t(`hero.slide${id}.preTitle`)}</span>
                    <h3 className="slider__title-13">{t(`hero.slide${id}.title`)}</h3>
                    <p className="hero-solid-description">{t(`hero.slide${id}.description`)}</p>

                    <div className="slider__btn-13 hero-solid-actions">
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
