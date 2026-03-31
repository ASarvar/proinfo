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
  const openMobileMenu = (menu) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <nav className="mean-nav">
      <ul>
        {menu_data.map((menu, i) => (
          <React.Fragment key={i}>
            {!menu.hasDropdown &&<li>
              <Link href={menu.link}>{menu.title}</Link>
            </li>}
            {menu.hasDropdown && (
              <li className="has-dropdown">
                <Link href={menu.link}>{menu.title}</Link>
                <ul
                  className="submenu"
                  style={{
                    display: navTitle === menu.title ? "block" : "none",
                  }}
                >
                  {menu.submenus.map((sub, i) => (
                    <li key={i}>
                      <Link href={sub.link}>{sub.title}</Link>
                    </li>
                  ))}
                </ul>
                <a
                  className={`mean-expand ${
                    navTitle === menu.title ? "mean-clicked" : ""
                  }`}
                  href="#"
                  onClick={() => openMobileMenu(menu.title)}
                  style={{ fontSize: "18px" }}
                >
                  <i className="fal fa-plus"></i>
                </a>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default MobileMenus;
