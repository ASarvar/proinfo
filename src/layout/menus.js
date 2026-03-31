"use client";

import Link from 'next/link';
import React from 'react';
import getMenuData from './menu-data';
import { useI18n } from '@i18n/i18n-context';

const Menus = () => {
  const { t, locale } = useI18n();
  const menu_data = getMenuData(t, locale);

  return (
    <ul>
      {menu_data.map((menu, i) => (
        <li key={i} className={`${menu.hasDropdown ? 'has-dropdown' : ''}`}>
          <Link href={`${menu.link}`}>
            {menu.title}
          </Link>
          {menu.hasDropdown && <ul className="submenu">
            {menu.submenus.map((sub, i) => (
              <li key={i}>
                <Link href={`${sub.link}`}>
                  {sub.title}
                </Link>
              </li>
            ))}
          </ul>}
        </li>
      ))}

    </ul>
  );
};

export default Menus;