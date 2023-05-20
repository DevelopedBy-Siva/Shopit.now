import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SnackbarProvider as Toast } from "notistack";
import store from "./State Management/store";
import AppContainer from "./App Containers/AppContainer";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toast maxSnack={1} />
        <AppContainer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
