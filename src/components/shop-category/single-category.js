import Image from "next/image";
import Link from "next/link";
import React from "react";

const SingleCategory = ({ item }) => {
  const categoryLink = item.link || "/category";

  return (
    <div className="product__category-item mb-20 text-center">
      <div className="product__category-thumb w-img">
        <Link href={categoryLink}>
          <Image
            src={item.img}
            alt={item.parent}
            width={272}
            height={181}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Link>
      </div>
      <div className="product__category-content">
        <h3 className="product__category-title">
          <Link href={categoryLink}>
            {item.parent}
          </Link>
        </h3>
        {item.description && (
          <p className="product__category-description">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SingleCategory;
