'use client';
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Scrollbar } from "swiper";
// internal
import SingleCategory from "./single-category";

// ProInfo Solutions Data
const solutions_data = [
  {
    id: 1,
    parent: "Information Systems",
    img: "/assets/img/product/category/category-1.jpg",
    description: "Automation systems, electronic catalogs, and cloud solutions"
  },
  {
    id: 2,
    parent: "RFID Technology",
    img: "/assets/img/product/category/category-2.jpg",
    description: "Radio-frequency identification for library automation"
  },
  {
    id: 3,
    parent: "Professional Scanners",
    img: "/assets/img/product/category/category-3.jpg",
    description: "High-quality scanners for archives and libraries"
  },
  {
    id: 4,
    parent: "AI Technology",
    img: "/assets/img/product/category/category-4.jpg",
    description: "Interactive robots, AR/VR, and recommendation systems"
  },
  {
    id: 5,
    parent: "Additional Equipment",
    img: "/assets/img/product/category/category-5.jpg",
    description: "Info kiosks, computers, printers, and resources"
  },
];

const ShopCategoryArea = () => {
  const [loop, setLoop] = useState(false);
  useEffect(() => setLoop(true), []);

  return (
    <section className="product__category pt-100 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="section__title-wrapper text-center mb-55">
              <h3 className="section__title">Our Solutions</h3>
              <p>We offer a range of solutions for developing your organization</p>
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
                loop={loop}
                modules={[Scrollbar]}
                scrollbar={{
                  el: ".tp-scrollbar",
                  clickable: true,
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

              <div className="tp-scrollbar"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopCategoryArea;
