"use client";

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import getMenuData from './menu-data';
import { useI18n } from '@i18n/i18n-context';

const Menus = () => {
  const { t, locale } = useI18n();
  const menu_data = useMemo(() => getMenuData(t, locale), [t, locale]);

  const [activeMainCategoryKey, setActiveMainCategoryKey] = useState("");
  const [activeSubcategorySlug, setActiveSubcategorySlug] = useState("");
  const [menuProducts, setMenuProducts] = useState([]);
  const [menuProductsLoading, setMenuProductsLoading] = useState(false);

  const productsMenu = useMemo(
    () => menu_data.find((item) => item.megaCatalog),
    [menu_data]
  );

  const allMainCategories = useMemo(
    () => productsMenu?.megaCatalog?.mainCategories || [],
    [productsMenu]
  );

  useEffect(() => {
    if (!allMainCategories.length) {
      setActiveMainCategoryKey("");
      setActiveSubcategorySlug("");
      return;
    }

    const firstMain = allMainCategories[0];
    const firstSub = firstMain?.subcategories?.[0];

    setActiveMainCategoryKey(firstMain.slug);
    setActiveSubcategorySlug(firstSub?.slug || "");
  }, [allMainCategories]);

  const activeMainCategory = useMemo(
    () => allMainCategories.find((category) => category.slug === activeMainCategoryKey) || allMainCategories[0],
    [allMainCategories, activeMainCategoryKey]
  );

  const activeSubcategory = useMemo(() => {
    const subcategories = activeMainCategory?.subcategories || [];
    return (
      subcategories.find((subcategory) => subcategory.slug === activeSubcategorySlug) ||
      subcategories[0]
    );
  }, [activeMainCategory, activeSubcategorySlug]);

  const handleMainCategoryActivate = (category) => {
    setActiveMainCategoryKey(category.slug);
    setActiveSubcategorySlug(category.subcategories?.[0]?.slug || "");
  };

  const handleSubcategoryActivate = (subcategory) => {
    setActiveSubcategorySlug(subcategory.slug);
  };

  useEffect(() => {
    if (!activeSubcategorySlug) return;
    setMenuProductsLoading(true);
    setMenuProducts([]);
    fetch(`/api/products?category=${activeSubcategorySlug}&lang=${locale?.toUpperCase() || "RU"}&limit=8`)
      .then((r) => r.json())
      .then((json) => { if (json?.success) setMenuProducts(Array.isArray(json.data) ? json.data : []); })
      .catch(() => {})
      .finally(() => setMenuProductsLoading(false));
  }, [activeSubcategorySlug, locale]);

  const handleMainCategoryClick = (event, category) => {
    if (activeMainCategoryKey !== category.slug) {
      event.preventDefault();
      handleMainCategoryActivate(category);
    }
  };

  const handleSubcategoryClick = (event, subcategory) => {
    if (activeSubcategorySlug !== subcategory.slug) {
      event.preventDefault();
      handleSubcategoryActivate(subcategory);
    }
  };

  const renderMegaMenu = (catalog) => {
    const mainCategories = catalog?.mainCategories || [];

    return (
      <div className="mega-menu proinfo-catalog-mega-menu">
        <div className="proinfo-catalog-column proinfo-main-category-column">
          <p className="proinfo-catalog-column-title">Категории</p>
          <ul className="proinfo-menu-list">
            {mainCategories.map((category) => (
              <li
                key={category.slug}
                className="proinfo-menu-list-item"
                onMouseEnter={() => handleMainCategoryActivate(category)}
              >
                <Link
                  href={category.link}
                  className={`proinfo-mega-item-btn ${activeMainCategory?.slug === category.slug ? "active" : ""}`}
                  onMouseEnter={() => handleMainCategoryActivate(category)}
                  onFocus={() => handleMainCategoryActivate(category)}
                  onClick={(event) => handleMainCategoryClick(event, category)}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="proinfo-catalog-column proinfo-subcategory-column">
          <p className="proinfo-catalog-column-title">Подкатегории</p>
          <ul className="proinfo-menu-list">
            {(activeMainCategory?.subcategories || []).map((subcategory) => (
              <li
                key={subcategory.slug}
                className="proinfo-menu-list-item"
                onMouseEnter={() => handleSubcategoryActivate(subcategory)}
              >
                <Link
                  href={subcategory.link}
                  className={`proinfo-mega-item-btn ${activeSubcategory?.slug === subcategory.slug ? "active" : ""}`}
                  onMouseEnter={() => handleSubcategoryActivate(subcategory)}
                  onFocus={() => handleSubcategoryActivate(subcategory)}
                  onClick={(event) => handleSubcategoryClick(event, subcategory)}
                >
                  {subcategory.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="proinfo-catalog-column proinfo-products-column">
          <p className="proinfo-catalog-column-title">Продукты</p>
          <ul className="proinfo-menu-list">
            {menuProductsLoading && (
              <li className="proinfo-empty-products" style={{color:"#aaa",fontSize:"13px"}}>Загрузка…</li>
            )}
            {!menuProductsLoading && menuProducts.length === 0 && (
              <li className="proinfo-empty-products" style={{color:"#aaa",fontSize:"13px"}}>Нет товаров в этой категории</li>
            )}
            {!menuProductsLoading && menuProducts.map((product) => (
              <li key={product.id || product.slug} className="proinfo-menu-list-item">
                <Link
                  href={`/${locale}/product-details/${product.slug}`}
                  className="proinfo-product-link proinfo-mega-item-btn"
                >
                  {product.title || product.slug}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    );
  };

  const renderSimpleSubmenu = (items, isSubmenu = false) => {
    const listClassName = isSubmenu ? "submenu" : "";

    return (
      <ul className={listClassName}>
        {items.map((menu, i) => (
          <li key={`${menu.title}-${i}`} className={menu.hasDropdown ? "has-dropdown" : ""}>
            <Link href={`${menu.link}`}>
              {menu.title}
            </Link>
            {menu.hasDropdown && menu.submenus?.length > 0 && renderSimpleSubmenu(menu.submenus, true)}
          </li>
        ))}
      </ul>
    );
  };

  const renderItems = (items, isSubmenu = false) => {
    const listClassName = isSubmenu ? "submenu" : "";

    return (
      <ul className={listClassName}>
        {items.map((menu, i) => (
          <li
            key={`${menu.title}-${i}`}
            className={`${menu.hasDropdown ? "has-dropdown" : ""} ${menu.megaMenu ? "has-mega-menu" : ""}`.trim()}
          >
            <Link href={`${menu.link}`}>
              {menu.title}
            </Link>
            {menu.megaMenu && menu.megaCatalog && renderMegaMenu(menu.megaCatalog)}
            {!menu.megaMenu && menu.hasDropdown && menu.submenus?.length > 0 && renderSimpleSubmenu(menu.submenus, true)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    renderItems(menu_data)
  );
};

export default Menus;