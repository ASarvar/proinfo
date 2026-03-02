

const TextArea = () => {
  return (
    <section className="about__text pt-115 pb-100">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-4">
            <div
              className="about__text-wrapper wow fadeInUp"
              data-wow-delay=".3s"
              data-wow-duration="1s"
            >
              <h3 className="about__text-title">
                Leading Library <br /> Automation in Uzbekistan
              </h3>
            </div>
          </div>
          <div className="col-xl-8 col-lg-8">
            <div
              className="about__text wow fadeInUp"
              data-wow-delay=".6s"
              data-wow-duration="1s"
            >
              <p>
                ProInfo.uz specializes in providing cutting-edge library automation solutions across Uzbekistan. 
                With years of experience in the information technology sector, we deliver comprehensive systems 
                that transform traditional libraries into modern, efficient information centers. Our solutions 
                integrate RFID technology, advanced barcode systems, self-service kiosks, and intelligent 
                management software designed specifically for educational institutions and public libraries.
              </p>

              <p>
                We partner with leading global manufacturers to bring world-class library equipment and software 
                to Uzbekistan. Our team of certified specialists provides full-cycle support from consultation 
                and system design to installation, training, and ongoing technical support. Whether you're 
                modernizing a university library or building a new public information center, ProInfo.uz 
                delivers reliable, scalable solutions tailored to your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextArea;
