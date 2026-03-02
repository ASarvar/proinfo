'use client';
import React, { useState } from "react";
// internal
import SingleProduct from "./single-product";
import products from "@data/products";
// internal

// tab items
const tabs = ["Featured", "Scanners", "RFID Systems"];

const ShopProducts = () => {
  const [activeTab, setActiveTab] = useState("Featured");
  
  // handle tab product
  const handleTabProduct = (value) => {
    setActiveTab(value);
  };

  // Filter products based on active tab
  let filteredProducts = [];
  
  switch (activeTab) {
    case "Featured":
      filteredProducts = products.filter((product) => product.topRated);
      break;
    case "Scanners":
      filteredProducts = products.filter((product) => product.bestSelling);
      break;
    case "RFID Systems":
      filteredProducts = products.filter((product) => product.latestProduct);
      break;
    default:
      filteredProducts = products.filter((product) => product.topRated);
  }

  return (
    <>
      <section className={`product__popular-area pb-20`}>
        <div className="container">
          <div className="row align-items-end">
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="section__title-wrapper-13 mb-35">
                <h3 className="section__title-13">Featured Equipment</h3>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6">
              <div className="product__tab tp-tab  mb-35">
                <ul
                  className="nav nav-tabs justify-content-md-end"
                  id="productTab"
                >
                  {tabs.map((tab, i) => (
                    <li
                      key={i}
                      className="nav-item"
                      onClick={() => handleTabProduct(tab)}
                    >
                      <button
                        className={`nav-link ${
                          activeTab === tab ? "active" : ""
                        }`}
                        id="top-tab"
                        type="button"
                      >
                        {tab}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="product__tab-wrapper">
            <div className="row">
              {filteredProducts.map((product) => (
                <div key={product._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <SingleProduct product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopProducts;
