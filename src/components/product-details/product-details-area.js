import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
// internal
import { HeartTwo, CartTwo } from "@svg/index";
import { SocialShare } from "@components/social";
import ProductDetailsPrice from "./product-details-price";
import ProductQuantity from "./product-quantity";
import ProductDetailsCategories from "./product-details-categories";
import ProductDetailsTags from "./product-details-tags";
import { add_cart_product } from "src/redux/features/cartSlice";
import { add_to_wishlist } from "src/redux/features/wishlist-slice";

const ProductDetailsArea = ({ product }) => {
  const {
    _id,
    image,
    relatedImages = [],
    title,
    quantity,
    price,
    originalPrice,
    discount,
    tags,
    sku,
    category,
  } = product || {};
  const [activeImg, setActiveImg] = useState(image);
  const gallery = relatedImages.length > 0 ? relatedImages : [image].filter(Boolean);
  const stockQuantity = quantity ?? 1;
  const displaySku = sku || _id;
  const categoryName = typeof category === "string" ? category : category?.name;
  const displayOriginalPrice = originalPrice || price || 0;
  useEffect(() => {
    setActiveImg(image);
  }, [image]);

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isWishlistAdded = wishlist.some((item) => item._id === _id);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  // handle add wishlist
  const handleAddWishlist = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  return (
    <section className="product__details-area pb-115">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="product__details-thumb-tab mr-70">
              <div className="product__details-thumb-content w-img">
                <div>
                  <Image
                    src={activeImg}
                    alt="details img"
                    width={960}
                    height={1125}
                    style={{
                      width: "100%",
                      maxHeight: "575px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className="product__details-thumb-nav tp-tab">
                <nav>
                  <div className="d-flex justify-content-center flex-wrap">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        className={activeImg === img ? "nav-link active" : ""}
                      >
                        <Image src={img} alt="image" width={110} height={110} />
                      </button>
                    ))}
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-xl-5 col-lg-6">
            <div className="product__details-wrapper">
              <div className="product__details-stock">
                <span>{stockQuantity} In Stock</span>
              </div>
              <h3 className="product__details-title">{title}</h3>

              <p className="mt-20">
                Shop Harry.com for every day low prices. Free shipping on orders
                $35+ or Pickup In-store and get
              </p>

              {/* Product Details Price */}
              <ProductDetailsPrice price={displayOriginalPrice} discount={discount || 0} />
              {/* Product Details Price */}

              {/* quantity */}
              <ProductQuantity />
              {/* quantity */}

              <div className="product__details-action d-flex flex-wrap align-items-center">
                <button
                  onClick={() => handleAddProduct(product)}
                  type="button"
                  className="product-add-cart-btn product-add-cart-btn-3"
                >
                  <CartTwo />
                  Add to Cart
                </button>
                <button
                  onClick={() => handleAddWishlist(product)}
                  type="button"
                  className={`product-action-btn ${
                    isWishlistAdded ? "active" : ""
                  }`}
                >
                  <HeartTwo />
                  <span className="product-action-tooltip">
                    Add To Wishlist
                  </span>
                </button>
              </div>
              <div className="product__details-sku product__details-more">
                <p>SKU:</p>
                <span>{displaySku}</span>
              </div>
              {/* ProductDetailsCategories */}
              <ProductDetailsCategories name={categoryName} />
              {/* ProductDetailsCategories */}

              {/* Tags */}
              <ProductDetailsTags tag={tags} />
              {/* Tags */}

              <div className="product__details-share">
                <span>Share:</span>
                <SocialShare />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsArea;
