import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
// internal
import { Eye } from "@svg/index";
import { initialOrderQuantity } from "src/redux/features/cartSlice";
import { setProduct } from "src/redux/features/productSlice";

const SingleProduct = ({ product }) => {
  const { _id, image, title } = product || {};
  const dispatch = useDispatch();

  // handle quick view
  const handleQuickView = (prd) => {
    dispatch(initialOrderQuantity());
    dispatch(setProduct(prd));
  };

  return (
    <React.Fragment>
      <div className="product__item p-relative transition-3 mb-50">
        <div className="product__thumb w-img p-relative fix">
          <Link href={`#`}>
            <Image
              src={image}
              alt="product image"
              width={960}
              height={1125}
              style={{ width: "100%", height: "100%" }}
            />
          </Link>

          <div className="product__action d-flex flex-column flex-wrap">
            <button
              onClick={() => handleQuickView(product)}
              type="button"
              className="product-action-btn"
            >
              <Eye />
              <span className="product-action-tooltip">Quick view</span>
            </button>
            <Link href={`#`}>
              <button type="button" className="product-action-btn">
                <i className="fa-solid fa-link"></i>
                <span className="product-action-tooltip">View Details</span>
              </button>
            </Link>
          </div>
          <Link href={`#`}>
            <div className="product__add transition-3">
              <button type="button" className="product-add-cart-btn w-100">
                View Details
              </button>
            </div>
          </Link>
        </div>
        <div className="product__content">
          <h3 className="product__title">
            <Link href={`#`}>{title}</Link>
          </h3>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SingleProduct;
