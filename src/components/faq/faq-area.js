import { DotsTwo, General, Support } from "@svg/index";
import FaqThumb from "./faq-thumb";
import SingleFaq from "./single-faq";

// single nav
function NavItem({ active, id, title, icon }) {
  return (
    <button
      className={`nav-link ${active ? "active" : ""}`}
      id={`nav-${id}-tab`}
      data-bs-toggle="tab"
      data-bs-target={`#${id}`}
      type="button"
      role="tab"
      aria-controls={`nav-${id}`}
      aria-selected={active ? "true" : "false"}
      tabIndex="-1"
    >
      <span>{icon}</span>
      {title}
    </button>
  );
}

// TabItem
export function TabItem({ active, id, accordion_items }) {
  return (
    <div
      className={`tab-pane fade ${active ? "show active" : ""}`}
      id={`${id}`}
      role="tabpanel"
      aria-labelledby={`nav-${id}-tab`}
    >
      {/* <!-- faq item one of community question --> */}
      {accordion_items.map((item, i) => (
        <div key={i} className="faq__item pb-95">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-4">
              <div className="faq__content">
                <h3 className="faq__title-2">{item.title}</h3>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-8">
              <div className="faq__wrapper faq__style-4 tp-accordion">
                <div className="accordion" id={`${id}-${i + 1}_accordion`}>
                  {item.accordions.map((item) => (
                    <SingleFaq key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const FaqArea = ({ element_faq = false }) => {
  // tab item
  return (
    <>
      {/* faq thumb start */}
      {/* {!element_faq && <FaqThumb />} */}
      {/* faq thumb end */}

      {/* faq area start */}
      <section className="faq__area pt-100 pb-25">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="section__title-wrapper text-center mb-55">
                <h3 className="section__title">Frequently Asked Questions</h3>
              </div>
              <div className="faq__tab-2 tp-tab mb-50">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <NavItem
                      active={true}
                      id="general"
                      icon={<General />}
                      title="General Questions"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem
                      id="technical"
                      icon={<DotsTwo />}
                      title="Technical Specs"
                    />
                  </li>
                  <li className="nav-item" role="presentation">
                    <NavItem
                      id="support"
                      icon={<Support />}
                      title="Support & Implementation"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="faq__item-wrapper">
            <div className="tab-content" id="faqTabContent">
              {/* general */}
              <TabItem
                active={true}
                id="general"
                accordion_items={[
                  {
                    title: (
                      <>
                        About <br />
                        ProInfo
                      </>
                    ),
                    accordions: [
                      {
                        id: "One",
                        title: "What services does ProInfo provide?",
                        show: true,
                        desc: "ProInfo specializes in comprehensive library automation solutions including RFID technology, professional scanning equipment, self-service terminals, AI-powered assistants, and complete information management systems for libraries, archives, and knowledge centers.",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Two",
                        title: "What industries do you serve?",
                        desc: "We serve libraries, universities, archives, research institutions, government agencies, and corporate information centers. Our solutions are tailored for any organization managing books, documents, and information resources.",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "Three",
                        title: "Do you offer custom solutions?",
                        desc: "Yes, we provide customized solutions tailored to your specific needs. Our team works closely with you to understand your requirements and design systems that integrate seamlessly with your existing infrastructure.",
                        parent: "general-1_accordion",
                      },
                      {
                        id: "four",
                        title: "How can I request a quote?",
                        desc: "You can request a quote by contacting us through our website, calling +998-77-079-66-00, or emailing salom@proinfo.uz. Our sales team will schedule a consultation to understand your needs and provide a detailed proposal.",
                        parent: "general-1_accordion",
                      },
                    ],
                  },
                  {
                    title: (
                      <>
                        Products <br />& Equipment
                      </>
                    ),
                    accordions: [
                      {
                        id: "five",
                        title: "What types of scanners do you offer?",
                        show: true,
                        desc: "We offer a complete range of professional scanners including book scanners, flatbed scanners, overhead scanners, archive scanners for fragile documents, microfilm scanners, and portable scanning solutions with resolutions up to 1200 DPI.",
                        parent: "general-2_accordion",
                      },
                      {
                        id: "six",
                        title: "How does RFID technology benefit libraries?",
                        desc: "RFID technology provides automated check-in/check-out, inventory management, theft prevention, reduced staff workload, faster processing times, and improved patron experience. Our systems offer 99.9% detection accuracy and support for unlimited items.",
                        parent: "general-2_accordion",
                      },
                      {
                        id: "seven",
                        title: "What is included with equipment purchases?",
                        desc: "All equipment includes installation, configuration, staff training, technical documentation, warranty coverage, and ongoing technical support. We also provide maintenance packages and software updates.",
                        parent: "general-2_accordion",
                      },
                    ],
                  },
                  {
                    title: "Pricing",
                    accordions: [
                      {
                        id: "eight",
                        title: "What payment methods do you accept?",
                        show: true,
                        desc: "We accept bank transfers, purchase orders, and corporate payment arrangements. For large projects, we offer flexible payment plans and financing options to accommodate your budget requirements.",
                        parent: "general-3_accordion",
                      },
                      {
                        id: "nine",
                        title: "Do you offer volume discounts?",
                        desc: "Yes, we provide competitive pricing for bulk orders and multi-location deployments. Contact our sales team to discuss volume pricing and special institutional rates.",
                        parent: "general-3_accordion",
                      },
                      {
                        id: "ten",
                        title: "What is your warranty policy?",
                        desc: "All equipment comes with manufacturer warranty ranging from 1-3 years depending on the product. Extended warranty and comprehensive maintenance packages are available for purchase.",
                        parent: "general-3_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* technical */}
              <TabItem
                id="technical"
                accordion_items={[
                  {
                    title: (
                      <>
                        Technical <br />
                        Specifications
                      </>
                    ),
                    accordions: [
                      {
                        id: "eleven",
                        title:
                          "What are the system requirements for your software?",
                        show: true,
                        desc: "Our systems are compatible with Windows 10/11 and Linux platforms. Minimum requirements include Intel i5 processor, 8GB RAM, and 256GB storage. Cloud-based options are also available with minimal local infrastructure needs.",
                        parent: "technical-1_accordion",
                      },
                      {
                        id: "twelve",
                        title:
                          "Can your systems integrate with existing library management software?",
                        desc: "Yes, our solutions integrate with major library management systems including Koha, ALEPH, Symphony, and Alma. We provide APIs and middleware for seamless data exchange and custom integrations.",
                        parent: "technical-1_accordion",
                      },
                      {
                        id: "thirteen",
                        title: "What RFID frequency standards do you support?",
                        desc: "We support ISO 15693 and ISO 18000-3 standards operating at 13.56 MHz frequency. Our tags and readers are compliant with international library standards and compatible with most existing RFID infrastructure.",
                        parent: "technical-1_accordion",
                      },
                      {
                        id: "fourteen",
                        title:
                          "What is the scanning resolution of your equipment?",
                        desc: "Our professional scanners offer resolutions ranging from 600 DPI for standard documents to 1200 DPI for archival materials. Ultra-high resolution options up to 2400 DPI are available for special preservation projects.",
                        parent: "technical-1_accordion",
                      },
                    ],
                  },
                ]}
              />

              {/* support */}
              <TabItem
                id="support"
                accordion_items={[
                  {
                    title: (
                      <>
                        Support & <br />
                        Implementation
                      </>
                    ),
                    accordions: [
                      {
                        id: "fifteen",
                        title: "How long does implementation take?",
                        show: true,
                        desc: "Implementation timeline varies based on project scope. Simple scanner installations take 1-2 days, while complete RFID systems require 2-4 weeks including hardware installation, software configuration, data migration, and staff training.",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "sixteen",
                        title: "What training do you provide?",
                        desc: "We provide comprehensive on-site and remote training for staff covering system operation, maintenance, troubleshooting, and best practices. Training materials include video tutorials, user manuals, and quick reference guides in multiple languages.",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "seventeen",
                        title: "What support channels are available?",
                        desc: "We offer 24/7 technical support via phone (+998-77-079-66-00, +998-77-708-33-31), email (salom@proinfo.uz), and remote assistance. Priority support packages include dedicated account managers and guaranteed response times.",
                        parent: "support-1_accordion",
                      },
                      {
                        id: "eighteen",
                        title: "Do you provide ongoing maintenance?",
                        desc: "Yes, we offer comprehensive maintenance packages including regular system checkups, software updates, hardware servicing, spare parts replacement, and preventive maintenance. Annual and multi-year contracts are available with discounted rates.",
                        parent: "support-1_accordion",
                      },
                    ],
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>
      {/* faq area end */}
    </>
  );
};

export default FaqArea;
