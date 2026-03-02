import React from "react";
import { useRouter } from "next/navigation";

// ProInfo Equipment Categories
const proInfoCategories = [
  {
    _id: "cat-1",
    parent: "Scanning Solutions",
    children: ["Professional Scanners", "Archive Scanners", "Book Scanners", "Document Scanners"]
  },
  {
    _id: "cat-2", 
    parent: "RFID Technology",
    children: ["RFID Gates", "RFID Readers", "RFID Tags", "Stock Management"]
  },
  {
    _id: "cat-3",
    parent: "Additional Equipment",
    children: ["Self-Service Terminals", "Information Kiosks", "Computers", "Printers"]
  },
  {
    _id: "cat-4",
    parent: "AI Technology",
    children: ["AI Assistants", "Smart Systems"]
  }
];

const ShopCategory = () => {
  const router = useRouter();

  return (
    <div className="accordion-item">
      <div className="sidebar__widget-content">
        <div className="categories">
          <div id="accordion-items">
            {proInfoCategories.map((category, i) => (
              <div key={category._id} className="card">
                <div className="card-header white-bg" id={`heading-${i + 1}`}>
                  <h5 className="mb-0">
                    <button
                      className={`shop-accordion-btn ${i === 0 ? "" : "collapsed"}`}
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${i + 1}`}
                      aria-expanded={i === 0 ? "true" : "false"}
                      aria-controls={`#collapse-${i + 1}`}
                    >
                      {category.parent}
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
                        {category.children.map((item, index) => (
                          <li key={index}>
                            <a
                              onClick={() =>
                                router.push(
                                  `/shop?category=${item
                                    .toLowerCase()
                                    .replace("&", "")
                                    .split(" ")
                                    .join("-")}`
                                )
                              }
                              style={{ cursor: "pointer", textTransform: "capitalize" }}
                            >
                              {item}
                            </a>
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
