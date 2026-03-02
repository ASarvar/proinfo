import Link from "next/link";

const TermsArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">
                  Last updated: February 24, 2026
                </h4>
                <p>
                  These Terms and Conditions govern your use of the ProInfo.uz website
                  and the business relationship between you (the client institution) and
                  ProInfo.uz (the service provider). These Terms and Conditions set out
                  the rights and obligations regarding product information, service inquiries,
                  quotations, orders, and support services for library automation solutions.
                  Your access to and use of our website is conditioned on your acceptance
                  of and compliance with these Terms and Conditions.
                </p>
                <p>
                  ProInfo.uz provides B2B library automation solutions including RFID systems,
                  barcode scanners, self-service kiosks, and library management software to
                  educational institutions, public libraries, and research centers in Uzbekistan.
                  Specific terms for equipment sales, installation services, software licensing,
                  warranties, and support are detailed in individual service agreements and
                  quotations provided to clients.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Service Scope</h3>
                <p>
                  ProInfo.uz offers comprehensive library automation solutions including
                  equipment supply, system integration, installation, configuration, staff
                  training, and ongoing technical support. Our services are designed for
                  institutional clients seeking to modernize their library operations with
                  advanced RFID technology, automated circulation systems, and intelligent
                  management software.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">
                  Key Terms:
                </h3>
                <ul>
                  <li>
                    <strong>Company</strong> - ProInfo.uz, a library automation solutions
                    provider operating in Uzbekistan, referred to as &quot;We&quot;,
                    &quot;Us&quot; or &quot;Our&quot; in this agreement.
                  </li>
                  <li>
                    <strong>Client</strong> - Educational institutions, public libraries,
                    research centers, or other organizations engaging our services.
                  </li>
                  <li>
                    <strong>Services</strong> - Library automation solutions including RFID
                    systems, barcode equipment, self-service kiosks, management software,
                    installation, training, and technical support.
                  </li>
                  <li>
                    <strong>Equipment</strong> - Physical hardware devices including RFID readers,
                    scanners, gates, kiosks, and related library automation equipment.
                  </li>
                  <li>
                    <strong>Software</strong> - Library management systems, cataloging tools,
                    circulation software, and related digital solutions.
                  </li>
                  <li>
                    <strong>Website</strong> - ProInfo.uz, accessible from{" "}
                    <Link
                      href="/"
                      rel="external nofollow noopener"
                      target="_blank"
                    >
                      proinfo.uz
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="policy__contact">
                <h3 className="policy__title policy__title-2">Contact us</h3>
                <p>For questions about our Terms and Conditions, please contact us:</p>

                <ul>
                  <li>
                    Email:{" "}
                    <span>
                      <a href="mailto:salom@proinfo.uz">salom@proinfo.uz</a>
                    </span>
                  </li>
                  <li>
                    Phone:{" "}
                    <span>
                      <a href="tel:+998770796600">+998-77-079-66-00</a>
                    </span>
                  </li>
                  <li>
                    Phone:{" "}
                    <span>
                      <a href="tel:+998777083331">+998-77-708-33-31</a>
                    </span>
                  </li>
                </ul>

                <div className="policy__address">
                  <p>
                    <a
                      rel="noreferrer"
                      href="https://www.google.com/maps/search/?api=1&query=Tashkent,Uzbekistan"
                      target="_blank"
                    >
                      ProInfo.uz <br /> Tashkent, Uzbekistan
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsArea;
