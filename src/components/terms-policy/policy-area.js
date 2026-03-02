const PolicyArea = () => {
  return (
    <section className="policy__area pb-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="policy__wrapper policy__translate p-relative z-index-1">
              <div className="policy__item mb-35">
                <h4 className="policy__meta">Effective date: February 24, 2026</h4>
                <p>
                  ProInfo.uz understands that you care about how your personal and business information
                  is used and shared, and we take your privacy seriously.
                  Please read the following to learn more about our Privacy
                  Policy. This Privacy Policy explains how we collect, use, and protect
                  information when you visit our website or engage with our library automation services.
                </p>
                <p>
                  By using or accessing our website and services, you
                  acknowledge that you accept the practices and policies
                  outlined in this Privacy Policy. We collect only necessary information
                  to provide our B2B library automation solutions, including RFID systems,
                  barcode scanners, self-service kiosks, and library management software.
                  Your data is used solely for service delivery, support, and business communication.
                </p>
              </div>

              <div className="policy__item policy__item-2 mb-35">
                <h3 className="policy__title">Information Collection</h3>
                <p>
                  You can visit our website and browse products without disclosing any
                  personal information. However, when you request a quote, schedule a consultation,
                  or engage our services, we may collect business contact information including
                  organization name, contact person, email address, phone number, and project requirements.
                </p>

                <p>
                  For B2B services, we collect institutional information necessary to
                  design and implement library automation solutions. This may include library
                  specifications, technical requirements, and organizational details needed
                  to provide appropriate equipment and software recommendations. All information
                  is stored securely and used only for service delivery and support purposes.
                </p>
              </div>

              <div className="policy__list mb-35">
                <h3 className="policy__title">Use of Information</h3>
                <ul>
                  <li>To respond to your inquiries and provide product information;</li>
                  <li>To prepare customized proposals and quotations for library automation projects;</li>
                  <li>
                    To deliver, install, and configure library equipment and software systems;
                  </li>
                  <li>
                    To provide technical support, maintenance, and training services;
                  </li>
                  <li>To notify you about product updates, new solutions, and service improvements;</li>
                  <li>To process orders and manage business relationships with institutional clients;</li>
                  <li>To comply with legal obligations and maintain business records;</li>
                </ul>
              </div>
              <div className="policy__contact">
                <h3 className="policy__title policy__title-2">Contact us</h3>
                <p>For any privacy-related questions or concerns, please contact us:</p>

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

export default PolicyArea;
