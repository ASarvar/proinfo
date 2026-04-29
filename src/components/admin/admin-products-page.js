"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { categoryGroups, getCategoryBySlug } from "@data/catalog-categories";
import Pagination from "@ui/Pagination";
import {
  adminActionDeleteStyle,
  adminActionEditStyle,
  adminActionGroupStyle,
  adminActionViewStyle,
  adminAlertErrorStyle,
  adminAlertSuccessStyle,
  adminAmbientGlowSideStyle,
  adminAmbientGlowTopStyle,
  adminGroupBodyStyle,
  adminGroupCardStyle,
  adminGroupHeaderStyle,
  adminHeroStyle,
  adminHeroSubtitleStyle,
  adminLoadingTextStyle,
  adminHeroMetaWrapStyle,
  adminMetaLabelStyle,
  adminMetaPillStyle,
  adminMetaValueStyle,
  adminPageShellStyle,
  adminPageTitleStyle,
  adminPrimaryCtaStyle,
  adminSummaryTextStyle,
  adminTableContainerStyle,
  adminTableHeadRowStyle,
  adminTableStyle,
  adminTdStyle,
  adminThStyle,
} from "./admin-ui-tokens";

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [itemOffset, setItemOffset] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/categories?lang=RU&limit=200"),
      ]);
      const [prodJson, catJson] = await Promise.all([prodRes.json(), catRes.json()]);
      if (!prodRes.ok || !prodJson?.success) throw new Error(prodJson?.error || "Failed to load products");
      if (!catRes.ok || !catJson?.success) throw new Error(catJson?.error || "Failed to load categories");
      setProducts(Array.isArray(prodJson.data) ? prodJson.data : []);
      setDbCategories(Array.isArray(catJson.data) ? catJson.data : []);
    } catch (e) {
      setError(e.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onDelete = async (id, slug) => {
    if (!confirm(`Delete product "${slug}"?`)) return;
    setMessage("");
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json?.success) throw new Error(json?.error || "Delete failed");
      setMessage(`Deleted: ${slug}`);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const catTitleMap = new Map(dbCategories.map((c) => [c.slug, c.title || c.slug]));

  const { currentItems, pageCount } = useMemo(() => {
    const endOffset = itemOffset + ITEMS_PER_PAGE;
    return {
      currentItems: products.slice(itemOffset, endOffset),
      pageCount: Math.ceil(products.length / ITEMS_PER_PAGE),
    };
  }, [itemOffset, products]);

  useEffect(() => {
    if (itemOffset >= products.length && products.length > 0) {
      setItemOffset(0);
    }
  }, [itemOffset, products.length]);

  const handlePageClick = (event) => {
    if (products.length === 0) return;
    const newOffset = (event.selected * ITEMS_PER_PAGE) % products.length;
    setItemOffset(newOffset);
  };

  const productsByGroup = categoryGroups.map((group) => ({
    ...group,
    products: currentItems.filter((p) => {
      const catalogCat = getCategoryBySlug(p.categorySlug);
      return catalogCat?.groupKey === group.key;
    }),
  }));
  const uncategorisedProducts = currentItems.filter((p) => !getCategoryBySlug(p.categorySlug));
  const totalCatsWithProducts = new Set(products.map((p) => p.categorySlug)).size;

  return (
    <section style={pageShellStyle}>
      <div style={ambientGlowTopStyle} />
      <div style={ambientGlowSideStyle} />

      <div style={heroStyle}>
        <div style={{ minWidth: 0 }}>
          <h1 style={pageTitleStyle}>Products</h1>
          <p style={heroSubtitleStyle}>
            Manage your catalog with grouped categories, fast actions, and paginated visibility.
          </p>
        </div>
        <div style={heroActionsStyle}>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Total</span>
            <strong style={metaValueStyle}>{products.length}</strong>
          </div>
          <div style={metaPillStyle}>
            <span style={metaLabelStyle}>Categories</span>
            <strong style={metaValueStyle}>{totalCatsWithProducts}</strong>
          </div>
          <button
            type="button"
            onClick={() => router.push("/admin/products/new")}
            style={btnPrimaryStyle}
          >
            + Create New
          </button>
        </div>
      </div>

      <p style={summaryTextStyle}>
        Showing {currentItems.length} of {products.length} product{products.length !== 1 ? "s" : ""} across {totalCatsWithProducts} categor{totalCatsWithProducts !== 1 ? "ies" : "y"}.
      </p>

      {message && <div style={alertSuccessStyle}>{message}</div>}
      {error && <div style={alertErrorStyle}>{error}</div>}

      {productsByGroup.map((group) => {
        if (group.products.length === 0) return null;
        return (
          <div key={group.key} style={groupCardStyle}>
            <div style={groupHeaderStyle}>{group.name}</div>
            <div style={groupBodyStyle}>
              <ProductTable
                products={group.products}
                catTitleMap={catTitleMap}
                onEdit={(p) => router.push(`/admin/products/${p.id}/edit`)}
                onDelete={onDelete}
              />
            </div>
          </div>
        );
      })}

      {uncategorisedProducts.length > 0 && (
        <div style={groupCardStyle}>
          <div style={{ ...groupHeaderStyle, background: "#475569" }}>Other / Custom</div>
          <div style={groupBodyStyle}>
            <ProductTable
              products={uncategorisedProducts}
              catTitleMap={catTitleMap}
              onEdit={(p) => router.push(`/admin/products/${p.id}/edit`)}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}

      {!loading && products.length === 0 && (
        <p style={emptyStateStyle}>
          No products yet.{" "}
          <button type="button" onClick={() => router.push("/admin/products/new")} style={emptyStateActionStyle}>
            Create one →
          </button>
        </p>
      )}
      {loading && <p style={loadingStyle}>Loading…</p>}

      {!loading && products.length > ITEMS_PER_PAGE && (
        <div className="tp-pagination tp-pagination-style-2" style={paginationWrapStyle}>
          <Pagination
            handlePageClick={handlePageClick}
            pageCount={pageCount}
            focusPage={Math.floor(itemOffset / ITEMS_PER_PAGE)}
          />
        </div>
      )}
    </section>
  );
}

function ProductTable({ products, catTitleMap, onEdit, onDelete }) {
  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeadRowStyle}>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>SKU</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Stock</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Slug</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            let extras = {};
            try { if (p.content) extras = JSON.parse(p.content); } catch {}
            const stock = extras.quantity ?? null;
            return (
              <tr key={p.id}>
                <td style={tdStyle}>{p.title || "—"}</td>
                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{extras.sku || "—"}</td>
                <td style={tdStyle}>{catTitleMap.get(p.categorySlug) || p.categorySlug || "—"}</td>
                <td style={tdStyle}>
                  {stock === null ? (
                    <span style={{ color: "#A3A3AA", fontSize: 12 }}>—</span>
                  ) : stock > 0 ? (
                    <span style={{ color: "#2E7D32", fontSize: 12, fontWeight: 700 }}>В наличии ({stock})</span>
                  ) : (
                    <span style={{ color: "#E65100", fontSize: 12, fontWeight: 700 }}>Под заказ</span>
                  )}
                </td>
                <td style={tdStyle}>{p.price != null ? p.price : "—"}</td>
                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12 }}>{p.slug}</td>
                <td style={tdStyle}>
                  <div style={actionGroupStyle}>
                    <button type="button" onClick={() => onEdit(p)} style={btnEditStyle}>Edit</button>
                    <a href={`/ru/product-details/${p.slug}`} target="_blank" rel="noopener noreferrer" style={btnViewStyle}>View</a>
                    <button type="button" onClick={() => onDelete(p.id, p.slug)} style={btnDeleteStyle}>Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const pageShellStyle = adminPageShellStyle;

const ambientGlowTopStyle = adminAmbientGlowTopStyle;

const ambientGlowSideStyle = adminAmbientGlowSideStyle;

const heroStyle = {
  ...adminHeroStyle,
  alignItems: "center",
};

const pageTitleStyle = {
  ...adminPageTitleStyle,
  margin: "0 0 6px",
};

const heroSubtitleStyle = adminHeroSubtitleStyle;

const heroActionsStyle = adminHeroMetaWrapStyle;

const metaPillStyle = adminMetaPillStyle;

const metaLabelStyle = adminMetaLabelStyle;

const metaValueStyle = adminMetaValueStyle;

const summaryTextStyle = adminSummaryTextStyle;

const alertSuccessStyle = adminAlertSuccessStyle;

const alertErrorStyle = adminAlertErrorStyle;

const groupCardStyle = adminGroupCardStyle;

const btnPrimaryStyle = adminPrimaryCtaStyle;

const btnDeleteStyle = adminActionDeleteStyle;

const btnViewStyle = adminActionViewStyle;

const btnEditStyle = adminActionEditStyle;

const groupHeaderStyle = adminGroupHeaderStyle;

const groupBodyStyle = adminGroupBodyStyle;

const tableContainerStyle = adminTableContainerStyle;

const tableStyle = adminTableStyle;

const tableHeadRowStyle = adminTableHeadRowStyle;

const thStyle = adminThStyle;

const tdStyle = adminTdStyle;

const actionGroupStyle = adminActionGroupStyle;

const emptyStateStyle = {
  color: "#667085",
  marginTop: 8,
  fontSize: 14,
  background: "#fff",
  border: "1px solid #E6E9F2",
  borderRadius: 12,
  padding: "14px 16px",
};

const emptyStateActionStyle = {
  color: "#1D4ED8",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  padding: 0,
  fontWeight: 700,
};

const loadingStyle = adminLoadingTextStyle;

const paginationWrapStyle = {
  marginTop: 16,
  padding: "12px 14px",
  background: "#fff",
  border: "1px solid #E6E9F2",
  borderRadius: 12,
};
