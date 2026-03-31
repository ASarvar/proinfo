import React from "react";
import ErrorMessage from "@components/error-message/error";
import SingleProduct from "@components/products/single-product";
import productsData from "@data/products";

const RelatedProducts = ({ id, category }) => {
  const relatedProducts = productsData
    .filter((product) => product._id !== id && product.category === category)
    .slice(0, 4);


  let content = null;

  if (relatedProducts.length === 0) {
    content = <ErrorMessage message="No related products found!" />;
  }

  if (relatedProducts.length > 0) {
    content = relatedProducts.map((product) => (
      <div key={product._id} className="col-lg-3 col-md-6">
        <SingleProduct product={product} />
      </div>
    ));
  }

  return (
    <React.Fragment>
      <section className="product__related-area pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="section__title-wrapper-13 mb-35">
                <h3 className="section__title-13">Related Products</h3>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="product__related-slider">
                <div className="row">
                  {content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default RelatedProducts;
