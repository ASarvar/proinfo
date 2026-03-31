import React, { useState } from "react";
import Link from "next/link";
// internal
import getMenuData from "@layout/menu-data";
import { useI18n } from "@i18n/i18n-context";

const MobileMenus = () => {
  const { t, locale } = useI18n();
  const menu_data = getMenuData(t, locale);
  const [navTitle, setNavTitle] = useState("");
  //openMobileMenu
  const openMobileMenu = (menuKey) => {
    if (navTitle === menuKey) {
      setNavTitle("");
    } else {
      setNavTitle(menuKey);
    }
  };

  const renderMenuItems = (items, parentKey = "") => {
    return items.map((menu, i) => {
      const menuKey = `${parentKey}${menu.title}-${i}`;

      if (!menu.hasDropdown) {
        return (
          <li key={menuKey}>
            <Link href={menu.link}>{menu.title}</Link>
          </li>
        );
      }

      return (
        <li key={menuKey} className="has-dropdown">
          <Link href={menu.link}>{menu.title}</Link>
          <ul
            className="submenu"
            style={{
              display: navTitle === menuKey ? "block" : "none",
            }}
          >
            {renderMenuItems(menu.submenus || [], `${menuKey}-`)}
          </ul>
          <a
            className={`mean-expand ${navTitle === menuKey ? "mean-clicked" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openMobileMenu(menuKey);
            }}
            style={{ fontSize: "18px" }}
          >
            <i className="fal fa-plus"></i>
          </a>
        </li>
      );
    });
  };

  return (
    <nav className="mean-nav">
      <ul>
        {renderMenuItems(menu_data)}
      </ul>
    </nav>
  );
};

export default MobileMenus;
