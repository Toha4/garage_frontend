import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "antd/dist/antd.min.css"
import "macro-css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import locale from "antd/lib/locale-provider/ru_RU";
import { ConfigProvider } from "antd";
import 'moment/locale/ru';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
