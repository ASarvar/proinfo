import React, { useState } from "react";
import PriceItem from "./price-item";

// price items for ProInfo equipment (in USD)
const price_items = [
  { id: "one", min: 0, max: 2999 },
  { id: "two", min: 3000, max: 7999 },
  { id: "three", min: 8000, max: 14999 },
  { id: "four", max: 15000 },
];

const ShopPrice = () => {

  return (
    <div className="accordion-item">
      <h2 className="accordion-header" id="price__widget">
        <button
          className="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#price_widget_collapse"
          aria-expanded="true"
          aria-controls="price_widget_collapse"
        >
          Price Range
        </button>
      </h2>
      <div
        id="price_widget_collapse"
        className="accordion-collapse collapse show"
        aria-labelledby="price__widget"
        data-bs-parent="#shop_price"
      >
        <div className="accordion-body">
          <div className="shop__widget-list">
            {price_items.map((item, i) => (
              <PriceItem
                key={i}
                {...item}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPrice;
