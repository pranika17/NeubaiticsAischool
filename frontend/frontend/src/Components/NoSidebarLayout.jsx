import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const NoSidebarLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Header />
      <div
        style={{
          flex: 1,
          padding: 0,
          paddingTop: "70px",
        }}
      >
        {children}
      </div>

      <Footer />
    </div>
  );
};

export default NoSidebarLayout;
