import { Provider } from "react-redux";
import LandingPage from "./components/landingPage";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );
}

export default App;
