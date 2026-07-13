import React from "react";
import Head from "next/head";

import { AdminApp } from "../src/features/admin/AdminApp";
import { APPLICATION_THEME_COLOR } from "../src/design-system/metadata";

export default function AdminPage() {
  return <><Head><title>Administración de productos | Mandoquita</title><meta name="robots" content="noindex,nofollow,noarchive" /><meta name="theme-color" content={APPLICATION_THEME_COLOR} /></Head><AdminApp /></>;
}
