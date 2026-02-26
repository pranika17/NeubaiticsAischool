// import React from "react";
// import Header from "./Header";
// import Footer from "./Footer";

// const NoSidebarLayout = ({ children }) => {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
//       {/* Header */}
      
//       {/* Main Content */}
//       <div style={{ flex: 1, padding: "20px", paddingTop: "70px" }}>
//         {children}
//       </div>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default NoSidebarLayout;
import React from "react";
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
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          padding: 0,        // 🔥 REMOVE GAP
          paddingTop: "70px" // ✅ only header space
        }}
      >
        {children}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default NoSidebarLayout;
