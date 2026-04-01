"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Scrollbar } from "swiper/modules";
// internal
import SingleCategory from "./single-category";
import { getCategoryGroups } from "@data/catalog-categories";
import { useI18n } from "@i18n/i18n-context";

const groupImageMap = {
  rfid: "/assets/img/product/category/category-1.jpg",
  automation: "/assets/img/product/category/category-2.jpg",
  software: "/assets/img/product/category/category-3.jpg",
  equipment: "/assets/img/product/category/category-4.jpg",
  interactive: "/assets/img/product/category/category-5.jpg",
  infrastructure: "/assets/img/product/category/category-1.jpg",
  innovation: "/assets/img/product/category/category-2.jpg",
};

const ShopCategoryArea = () => {
  const { locale, t } = useI18n();
  const scrollbarRef = useRef(null);
  const localizedSolutions = t("solutions.categories");
  const hasLocalizedSolutions = Array.isArray(localizedSolutions);

  const solutions_data = getCategoryGroups().map((group, index) => ({
    id: index + 1,
    parent: hasLocalizedSolutions
      ? localizedSolutions[index]?.name || group.name
      : group.name,
    description: hasLocalizedSolutions
      ? localizedSolutions[index]?.description
      : undefined,
    img:
      groupImageMap[group.key] || "/assets/img/product/category/category-1.jpg",
    link: group.categories[0]
      ? `/${locale}/category/${group.categories[0].slug}/products`
      : `/${locale}/category`,
  }));

  return (
    <section className="product__category pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="section__title-wrapper text-center mb-55">
              <h3 className="section__title">{t("solutions.title")}</h3>
              <p>{t("solutions.subtitle")}</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xxl-12">
            <div className="product__category-slider">
              <Swiper
                className="product__category-slider-active swiper-container"
                slidesPerView={4}
                spaceBetween={30}
                loop={solutions_data.length > 4}
                speed={800}
                grabCursor={true}
                watchOverflow={true}
                modules={[Scrollbar, Autoplay]}
                autoplay={{
                  delay: 2600,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                scrollbar={{
                  el: scrollbarRef.current,
                  clickable: true,
                  draggable: true,
                }}
                onBeforeInit={(swiper) => {
                  if (
                    swiper.params.scrollbar &&
                    typeof swiper.params.scrollbar !== "boolean"
                  ) {
                    swiper.params.scrollbar.el = scrollbarRef.current;
                  }
                }}
                breakpoints={{
                  1601: {
                    slidesPerView: 4,
                  },
                  1400: {
                    slidesPerView: 4,
                  },
                  1200: {
                    slidesPerView: 4,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  576: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                  },
                }}
              >
                {solutions_data.map((item) => (
                  <SwiperSlide key={item.id}>
                    <SingleCategory item={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCategoryArea;
