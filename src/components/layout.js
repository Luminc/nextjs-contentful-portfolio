import * as React from "react";
import Seo from "../components/seo";

import "./app.css";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Seo />
      <Header />
      <div className="flex-wrapper">
        <main>
          <h1>{pageTitle}</h1>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
