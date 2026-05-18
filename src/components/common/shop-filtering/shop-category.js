import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@i18n/i18n-context";

const ShopCategory = () => {
  const { locale } = useI18n();
  const lang = locale === "uz" ? "UZ" : locale === "en" ? "EN" : "RU";
  const pathname = usePathname();

  // Extract active slug from URL: /{locale}/category/{slug}/products
  const activeSlug = (() => {
    const match = pathname?.match(/\/category\/([^/]+)\/products/);
    return match ? match[1] : null;
  })();

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch(`/api/categories?lang=${lang}&limit=200`)
      .then((r) => r.json())
      .then((json) => {
        if (!json?.success || !Array.isArray(json?.data)) return;
        const cats = json.data;
        const topLevel = cats.filter((c) => !c.parentSlug);
        const built = topLevel.map((parent) => ({
          key: parent.slug,
          name: parent.title || parent.slug,
          categories: cats.filter((c) => c.parentSlug === parent.slug),
        }));
        setGroups(built);
      })
      .catch(() => {});
  }, [lang]);

  if (groups.length === 0) return null;

  return (
    <div className="accordion-item">
      <div className="sidebar__widget-content">
        <div className="categories">
          <div id="accordion-items">
            {groups.map((group, i) => {
              const childSlugs = group.categories.map((c) => c.slug);
              const isGroupActive =
                activeSlug === group.key || childSlugs.includes(activeSlug);

              return (
                <div key={group.key} className="card">
                  <div className="card-header white-bg" id={`heading-${i + 1}`}>
                    <h5 className="mb-0">
                      <button
                        className={`shop-accordion-btn ${isGroupActive ? "" : "collapsed"}`}
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${i + 1}`}
                        aria-expanded={isGroupActive ? "true" : "false"}
                        aria-controls={`#collapse-${i + 1}`}
                      >
                        {group.name}
                      </button>
                    </h5>
                  </div>

                  <div
                    id={`collapse-${i + 1}`}
                    className={`accordion-collapse collapse ${isGroupActive ? "show" : ""}`}
                    aria-labelledby={`heading-${i + 1}`}
                    data-bs-parent="#accordion-items"
                  >
                    <div className="card-body">
                      <div className="categories__list">
                        <ul>
                          {group.categories.length > 0 ? (
                            group.categories.map((category) => {
                              const isActive = activeSlug === category.slug;
                              return (
                                <li key={category.slug}>
                                  <Link
                                    href={`/${locale}/category/${category.slug}/products`}
                                    style={isActive ? { color: "#F50963", fontWeight: 600 } : undefined}
                                  >
                                    {category.title || category.slug}
                                  </Link>
                                </li>
                              );
                            })
                          ) : (
                            <li>
                              <Link
                                href={`/${locale}/category/${group.key}/products`}
                                style={activeSlug === group.key ? { color: "#F50963", fontWeight: 600 } : undefined}
                              >
                                {group.name}
                              </Link>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopCategory;

