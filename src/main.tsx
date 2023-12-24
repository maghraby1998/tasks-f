import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { client } from "./graphql/client";
import { ApolloProvider } from "@apollo/client";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/service-worker.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </PersistGate>
  // </React.StrictMode>
);
