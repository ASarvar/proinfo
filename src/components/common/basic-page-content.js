import Link from "next/link";

const BasicPageContent = ({ title, description, links = [] }) => {
  return (
    <section className="tp-blog-area pt-120 pb-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="text-center mb-50">
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            {links.length > 0 && (
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {links.map((item) => (
                  <Link key={item.href} href={item.href} className="tp-btn-border">
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicPageContent;