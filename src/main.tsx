import React from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import "./styles/scrollbar.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
)

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     {/*<App />*/}
//     <>Hello World</>
//   </React.StrictMode>
// )
