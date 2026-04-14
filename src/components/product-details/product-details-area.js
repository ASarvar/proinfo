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
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);

  const {
    _id,
    id,
    image,
    imageUrl,
    relatedImages = [],
    images = [],
    title,
    quantity,
    price,
    originalPrice,
    discount,
    tags,
    sku,
    category,
    categorySlug,
    description,
    features = [],
  } = product || {};

  const primaryImage = imageUrl || image;
  const gallerySource = Array.isArray(images) && images.length > 0 ? images : relatedImages;
  const gallery = gallerySource.length > 0 ? gallerySource : [primaryImage].filter(Boolean);

  const [activeImg, setActiveImg] = useState(primaryImage);

  useEffect(() => {
    setActiveImg(primaryImage);
  }, [primaryImage]);

  if (!product) return null;

  const stockQuantity = quantity ?? 1;
  const displayOriginalPrice = originalPrice || price || 0;
  const displaySku = sku || id || _id;
  const categoryName = typeof category === "string" ? category : category?.name || categorySlug;
  const isWishlistAdded = wishlist.some((item) => item?._id === (_id || id));

  const handleAddWishlist = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };

  return (
    <section className="product__details-area pt-120 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-7 col-lg-6">
            <div className="product__details-thumb-wrapper tp-tab">
              <div className="product__details-thumb-tab-content">
                <div>
                  {activeImg && (
                    <Image
                      src={activeImg}
                      alt="details img"
                      width={960}
                      height={1125}
                      className="product__details-main-image"
                    />
                  )}
                </div>
              </div>

              <div className="product__details-thumb-nav tp-tab">
                <nav>
                  <div className="d-flex justify-content-center flex-wrap">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        className={activeImg === img ? "nav-link active" : "nav-link"}
                        type="button"
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

              <p className="mt-20">{description || ""}</p>

              {features.length > 0 && (
                <ul className="product__details-feature-list">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              )}

              <ProductDetailsPrice price={displayOriginalPrice} discount={discount || 0} />

              <ProductQuantity />

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
                  className={`product-action-btn ${isWishlistAdded ? "active" : ""}`}
                >
                  <HeartTwo />
                  <span className="product-action-tooltip">Add To Wishlist</span>
                </button>
              </div>

              <div className="product__details-sku product__details-more">
                <p>SKU:</p>
                <span>{displaySku}</span>
              </div>

              <ProductDetailsCategories name={categoryName} />

              <ProductDetailsTags tag={tags} />

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
