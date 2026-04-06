"use client";

import Link from "next/link";
import React from "react";
import { useI18n } from "@i18n/i18n-context";

const CopyrightText = () => {
  const { t } = useI18n();

  return (
      <>
        Copyright © {new Date().getFullYear()} by <Link href="https://www.proinfo.uz">ProInfo</Link> {' '}
        {t("common.allRightsReserved")}
      </>
  );
};

export default CopyrightText;
