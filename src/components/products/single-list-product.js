import React from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import { Eye } from "@svg/index";
import { useDispatch } from "react-redux";
import { initialOrderQuantity } from "src/redux/features/cartSlice";
import { setProduct } from "src/redux/features/productSlice";

const SingleListProduct = ({ product }) => {
  const { _id, image, title, description } = product || {};
  // handle dispatch
  const dispatch = useDispatch();

  // handle quick view
  const handleQuickView = (prd) => {
    dispatch(initialOrderQuantity())
    dispatch(setProduct(prd))
  };

  return (
    <React.Fragment>
      <div className="product__list-item mb-30">
        <div className="row">
          <div className="col-xl-5 col-lg-5">
            <div className="product__thumb product__list-thumb p-relative fix m-img">
              <Link href={`#`}>
                <Image
                  src={image}
                  alt="image"
                  width={335}
                  height={325}
                  style={{
                    width: "335px",
                    height: "325px",
                    objectFit: "cover",
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="col-xl-7 col-lg-7">
            <div className="product__list-content">
              <h3 className="product__list-title">
                <Link href={`#`}>{title}</Link>
              </h3>
              <p>
                Professional library automation equipment for modern educational institutions 
                and public libraries. Contact us for detailed specifications, pricing, 
                and customized solutions for your library needs.
              </p>

              <div className="product__list-action d-flex flex-wrap align-items-center">
                <button
                  onClick={() => handleQuickView(product)}
                  type="button"
                  className="product-action-btn"
                >
                  <Eye />
                  <span className="product-action-tooltip">Quick view</span>
                </button>

                <Link href={`#`}>
                  <button
                    type="button"
                    className="product-action-btn product-action-btn-2"
                  >
                    <i className="fa-solid fa-link"></i>
                    <span className="product-action-tooltip">
                      View Details
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SingleListProduct;
