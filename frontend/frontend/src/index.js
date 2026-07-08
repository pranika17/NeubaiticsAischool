import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// eslint-disable-next-line
import './Components/bootstrap.min.css';  // Suppress ESLint warning for this line
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import Swal from "sweetalert2";

const originalSwalFire = Swal.fire.bind(Swal);

Swal.fire = (optionsOrTitle, maybeHtml, maybeIcon) => {
  const isObjectCall =
    typeof optionsOrTitle === "object" && optionsOrTitle !== null && !Array.isArray(optionsOrTitle);

  const baseOptions = isObjectCall
    ? optionsOrTitle
    : {
        title: optionsOrTitle,
        html: maybeHtml,
        icon: maybeIcon,
      };

  const mergedOptions = {
  confirmButtonColor: "#00c8c8",
  cancelButtonColor: "#ff6b6b",
  background: "#082634",
  color: "#eaffff",
  buttonsStyling: false,

  ...(baseOptions.toast
    ? {}
    : {
        backdrop: "rgba(1, 10, 20, 0.72)",
        allowOutsideClick: true,
      }),

  customClass: {
    popup: `app-swal-popup ${baseOptions.toast ? "app-swal-toast" : "app-swal-modal"}`.trim(),
    title: "app-swal-title",
    htmlContainer: "app-swal-html",
    confirmButton: "app-swal-confirm",
    cancelButton: "app-swal-cancel",
    denyButton: "app-swal-deny",
    actions: "app-swal-actions",
    icon: "app-swal-icon",
    closeButton: "app-swal-close",
    timerProgressBar: "app-swal-timer",
    ...(baseOptions.customClass || {}),
  },

  ...(baseOptions.toast
    ? {
        position: baseOptions.position || "top-end",
        timerProgressBar: baseOptions.timerProgressBar ?? true,
        showConfirmButton: baseOptions.showConfirmButton ?? false,
      }
    : {}),

  ...baseOptions,
};

  return originalSwalFire(mergedOptions);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
