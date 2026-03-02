'use client';
import React from "react";
// internal
import { Play } from "@svg/index";
import faq_bg from "@assets/img/faq/faq-img.jpg";
import SingleFaq from "@components/faq/single-faq";
import VideoModal from "@components/common/modals/modal-video";
import useModal from "@hooks/use-modal";

const faq_items = [
  {
    id: "about-one",
    title: "What types of libraries do you work with?",
    show: true,
    desc: "We serve all types of libraries including university libraries, public libraries, school libraries, and specialized research centers. Our solutions are scalable and customizable to meet the unique requirements of institutions of any size, from small school libraries to large multi-branch public library systems.",
    parent: "faqaccordion",
  },
  {
    id: "about-two",
    title: "Do you provide training for library staff?",
    desc: "Yes, comprehensive training is a core part of our service. We provide on-site training for all library staff on system operation, RFID technology, self-service equipment, and management software. Training materials are available in Russian and Uzbek, and we offer ongoing support to ensure your team is confident using the new systems.",
    parent: "faqaccordion",
  },
  {
    id: "about-three",
    title: "What is your warranty and support policy?",
    desc: "All equipment comes with manufacturer warranties ranging from 1-3 years depending on the product. We provide local technical support, maintenance services, and software updates throughout the warranty period and beyond. Our support team is available via phone, email, and on-site visits to ensure your library automation system runs smoothly.",
    parent: "faqaccordion",
  },
];

const AboutFaqs = () => {
  const { isVideoOpen, setIsVideoOpen } = useModal();
  return (
    <React.Fragment>
      <section className="faq__area p-relative">
        <div
          className="faq__video"
          style={{ backgroundImage: `url(${faq_bg.src})` }}
        >
          <div className="faq__video-btn">
            <a
              style={{ cursor: "pointer" }}
              onClick={() => setIsVideoOpen(true)}
              className="tp-pulse-border popup-video"
            >
              <Play />
            </a>
          </div>
        </div>
        <div className="container-fluid">
          <div className="row justify-content-end">
            <div className="col-xxl-7 col-xl-7 col-lg-7">
              <div className="faq__wrapper-2 faq__gradient-border faq__style-2 tp-accordion pl-160">
                <div className="faq__title-wrapper">
                  <span className="faq__title-pre">
                   Learn more about our services
                  </span>
                  <h3 className="faq__title">
                    Modern Library Solutions for Your Institution
                  </h3>
                </div>
                <div className="accordion" id="faqaccordion">
                  {faq_items.map((item) => (
                    <SingleFaq key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* video modal start */}
      <VideoModal
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"FWrz3bT-YoE"}
      />
      {/* video modal end */}
    </React.Fragment>
  );
};

export default AboutFaqs;
