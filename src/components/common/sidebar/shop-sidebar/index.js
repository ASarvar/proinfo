import React from "react";
// internal
import ShopCategory from "../../shop-filtering/shop-category";

const ShopSidebar = ({ all_products }) => {
  return (
    <div className={`shop__sidebar on-left`}>
      <div className="shop__widget tp-accordion">
        <div className="accordion" id="shop_category">
          <ShopCategory />
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
