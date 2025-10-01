import { render } from "preact";
import { App } from "./App.jsx";
import "./styles/index.scss";
import { initializePWA } from "./features/shared/utils/serviceWorker.js";
import "./features/i18n/index.js";

render(<App />, document.getElementById("app"));

initializePWA()
  .then(() => {})
  .catch((_error) => {});
