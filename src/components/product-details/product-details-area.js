'use client';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// internal
import { SocialShare } from "@components/social";
import ProductDetailsCategories from "./product-details-categories";
import ProductDetailsTags from "./product-details-tags";
import SingleProduct from "@components/products/single-product";
import ErrorMessage from "@components/error-message/error";

const ProductDetailsArea = ({ product }) => {
  const {
    _id,
    id,
    image,
    imageUrl,
    relatedImages = [],
    images = [],
    title,
    quantity,
    tags,
    sku,
    category,
    categorySlug,
    description,
    longDescription,
    features = [],
    specifications,
    videoUrl,
    brochureUrl,
  } = product || {};

  const primaryImage = (Array.isArray(images) && images[0]) ? images[0] : (imageUrl || image);
  const gallery = Array.isArray(images) && images.length > 0
    ? images
    : [imageUrl || image].filter(Boolean);

  const [activeImg, setActiveImg] = useState(primaryImage);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    setActiveImg(primaryImage);
  }, [primaryImage]);

  useEffect(() => {
    if (!categorySlug) return;
    fetch(`/api/products?category=${encodeURIComponent(categorySlug)}&lang=RU&limit=5`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.success && Array.isArray(json.data)) {
          const others = json.data
            .filter((p) => p.slug !== (product?.slug || ""))
            .slice(0, 4)
            .map((p) => {
              let extras = {};
              try { if (p.content) extras = JSON.parse(p.content); } catch {}
              return { ...p, ...extras, image: extras.images?.[0] || p.imageUrl };
            });
          setRelatedProducts(others);
        }
      })
      .catch(() => {});
  }, [categorySlug, product?.slug]);

  if (!product) return null;

  const stockQuantity = quantity ?? 1;
  const displaySku = sku || id;
  const categoryName = typeof category === "string" ? category : category?.name || categorySlug;

  return (
    <section className="product__details-area pt-120 pb-80">
      <div className="container">

        {/* ── Row 1: Image gallery + right-column info ── */}
        <div className="row">

          {/* Left col: image gallery */}
          <div className="col-xl-7 col-lg-6">
            <div className="product__details-thumb-wrapper tp-tab">
              <div className="product__details-gallery-layout">
                <div className="product__details-thumb-nav tp-tab">
                  <nav>
                    <div className="product__details-thumb-list">
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
              </div>
            </div>
          </div>

          {/* Right col: product info */}
          <div className="col-xl-5 col-lg-6">
            <div className="product__details-wrapper">

              {/* 1. Availability badge */}
              <div className="product__details-stock mb-15">
                <span className={`product__details-availability${stockQuantity > 0 ? " product__details-availability--instock" : " product__details-availability--order"}`}>
                  {stockQuantity > 0 ? "В наличии" : "Под заказ"}
                </span>
              </div>

              {/* 2. Product name */}
              <h3 className="product__details-title">{title}</h3>

              {/* 3. Short description */}
              {description && (
                <p className="product__details-short-desc">{description}</p>
              )}

              {/* 4. Связаться button */}
              <div className="product__details-action mb-25 pt-25">
                <Link href="/contact" className="product-add-cart-btn-3">
                  Связаться
                </Link>
              </div>

              {/* 5. SKU */}
              <div className="product__details-sku product__details-more">
                <p>SKU:</p>
                <span>{displaySku}</span>
              </div>

              {/* 6. Category */}
              <ProductDetailsCategories name={categoryName} />

              {/* 7. Tags */}
              <ProductDetailsTags tag={tags} />

              {/* 8. Share */}
              <div className="product__details-share">
                <span>Поделиться:</span>
                <SocialShare />
              </div>

            </div>
          </div>
        </div>

        {/* ── Row 2: Tabs — Описание | Характеристика ── */}
        <div className="row mt-60">
          <div className="col-xl-12">
            <div className="product__details-tab">
              <nav className="product__details-tab-nav">
                <button
                  type="button"
                  className={`product__details-tab-btn${activeTab === "description" ? " active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  Описание
                </button>
                <button
                  type="button"
                  className={`product__details-tab-btn${activeTab === "specification" ? " active" : ""}`}
                  onClick={() => setActiveTab("specification")}
                >
                  Характеристика
                </button>
              </nav>

              <div className="product__details-tab-content">
                {activeTab === "description" && (
                  <div className="product__details-tab-pane" style={{ wordBreak: "normal", overflowWrap: "break-word", hyphens: "none" }}>
                    {longDescription ? (
                      <div
                        className="product__details-rich-text"
                        style={{ wordBreak: "normal", overflowWrap: "break-word", hyphens: "none", whiteSpace: "pre-wrap" }}
                      >
                        {longDescription.replace(/\u00AD/g, '')}
                      </div>
                    ) : (
                      <>
                        <p>{description}</p>
                        {features.length > 0 && (
                          <ul className="product__details-feature-list mt-20">
                            {features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                )}

                {activeTab === "specification" && (
                  <div className="product__details-tab-pane" style={{ wordBreak: "normal", overflowWrap: "break-word" }}>
                    {specifications && Object.keys(specifications).length > 0 ? (
                      <table className="product__details-spec-table">
                        <tbody>
                          {Object.entries(specifications).map(([key, val]) => (
                            <tr key={key}>
                              <td>{key}</td>
                              <td>{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Характеристики не указаны.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Video / Brochure buttons ── */}
        <div className="row mt-40">
          <div className="col-xl-12">
            <div className="product__details-media-actions">
              {videoUrl ? (
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product__details-media-btn product__details-media-btn--video"
                >
                  <i className="fa-solid fa-play"></i>
                  Видео
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="product__details-media-btn product__details-media-btn--video"
                >
                  <i className="fa-solid fa-play"></i>
                  Видео
                </button>
              )}
              {brochureUrl ? (
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product__details-media-btn product__details-media-btn--brochure"
                >
                  <i className="fa-regular fa-file-pdf"></i>
                  Брошюра
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="product__details-media-btn product__details-media-btn--brochure"
                >
                  <i className="fa-regular fa-file-pdf"></i>
                  Брошюра
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 4: Related Products ── */}
        <div className="row mt-70">
          <div className="col-xl-12">
            <div className="section__title-wrapper-13 mb-35">
              <h3 className="section__title-13">Похожие продукты</h3>
            </div>
          </div>
        </div>
        <div className="row">
          {relatedProducts.length === 0 ? (
            <ErrorMessage message="Похожие продукты не найдены." />
          ) : (
            relatedProducts.map((p, index) => (
              <div key={p.id || p._id || p.slug || `related-${index}`} className="col-lg-3 col-md-6">
                <SingleProduct product={p} />
              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};

export default ProductDetailsArea;
