import "./App.css";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./containers/login/Login";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Board from "./containers/board/Board";
import Layout from "./containers/layout";

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const router = createBrowserRouter(
    createRoutesFromElements(
      token ? (
        <Route path="/" element={<Layout />}>
          <Route index element={<Board />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Route>
      ) : (
        <Route path="/">
          <Route index element={<Navigate to={"/login"} />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to={"/login"} />} />
        </Route>
      )
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
