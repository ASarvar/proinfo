const LocationArea = () => {
  return (
    <section className="contact__location-area pb-130 pt-60">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-wrapper-2 text-center mb-50">
              <span className="tp-section-subtitle-2 subtitle-mb-9">
                OUR OFFICE
              </span>
              <h3 className="tp-section-title-2 font-40">
                Visit Us in Tashkent
              </h3>
            </div>
          </div>
        </div>
        
        <div className="row">
          {/* Contact Information */}
          <div className="col-xl-5 col-lg-5 mb-30">
            <div className="contact__info-wrapper white-bg p-40" style={{height: '100%'}}>
              <h4 className="mb-30">Contact Information</h4>
              
              <div className="contact__info-item mb-25">
                <h5 className="mb-10">
                  <i className="fal fa-map-marker-alt mr-10"></i>
                  Location
                </h5>
                <p className="mb-0">Tashkent, Uzbekistan</p>
              </div>
              
              <div className="contact__info-item mb-25">
                <h5 className="mb-10">
                  <i className="fal fa-envelope mr-10"></i>
                  Email
                </h5>
                <p className="mb-0">
                  <a href="mailto:salom@proinfo.uz">salom@proinfo.uz</a>
                </p>
              </div>
              
              <div className="contact__info-item mb-25">
                <h5 className="mb-10">
                  <i className="fal fa-phone mr-10"></i>
                  Phone Numbers
                </h5>
                <p className="mb-5">
                  <a href="tel:+998770796600">+998-77-079-66-00</a>
                </p>
                <p className="mb-0">
                  <a href="tel:+998777083331">+998-77-708-33-31</a>
                </p>
              </div>
              
              <div className="contact__info-item mt-40">
                <h5 className="mb-15">Business Hours</h5>
                <p className="mb-5">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="mb-0">Saturday: 9:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="col-xl-7 col-lg-7 mb-30">
            <div className="contact__map" style={{height: '500px', borderRadius: '8px', overflow: 'hidden'}}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.347338053188!2d69.27187331542374!3d41.29606247927417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xdff808647d71c7a1!2s77WF%2BCJ%2C%20Tashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationArea;
