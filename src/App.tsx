import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { IconContext } from "react-icons";

import AppRoutes from "./Routes";
import store from "./store";
import { GoToTop } from "./utils";

const App = () => (
  <Provider store={store}>
    <Router>
      <GoToTop />
      <IconContext.Provider value={{ className: 'text-xs' }}>
        <AppRoutes />
      </IconContext.Provider>
    </Router>
  </Provider>
)

export default App
