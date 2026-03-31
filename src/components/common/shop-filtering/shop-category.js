import React from "react";
import Link from "next/link";
import { useI18n } from "@i18n/i18n-context";
import { getCategoryGroups } from "@data/catalog-categories";

const ShopCategory = () => {
  const { locale } = useI18n();
  const categoryGroups = getCategoryGroups();

  return (
    <div className="accordion-item">
      <div className="sidebar__widget-content">
        <div className="categories">
          <div id="accordion-items">
            {categoryGroups.map((group, i) => (
              <div key={group.key} className="card">
                <div className="card-header white-bg" id={`heading-${i + 1}`}>
                  <h5 className="mb-0">
                    <button
                      className={`shop-accordion-btn ${i === 0 ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${i + 1}`}
                      aria-expanded={i === 0 ? "true" : "false"}
                      aria-controls={`#collapse-${i + 1}`}
                    >
                      {group.name}
                    </button>
                  </h5>
                </div>

                <div
                  id={`collapse-${i + 1}`}
                  className={`accordion-collapse collapse ${i === 0 ? "show" : ""}`}
                  aria-labelledby={`heading-${i + 1}`}
                  data-bs-parent="#accordion-items"
                >
                  <div className="card-body">
                    <div className="categories__list">
                      <ul>
                        {group.categories.map((category) => (
                          <li key={category.slug}>
                            <Link href={`/${locale}/category/${category.slug}/products`}>
                              {category.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;
