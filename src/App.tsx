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
import CreateProject from "./containers/project/CreateProject";
import SentInvitations from "./containers/invitations/SentInvitations";
import ReceivedInvitations from "./containers/invitations/ReceivedInvitations";

const App = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const isSideBarOpen = useSelector(
    (state: RootState) => state.auth.isSideBarOpen
  );

  const router = createBrowserRouter(
    createRoutesFromElements(
      token ? (
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={<div className="page-container">in progress</div>}
          />
          <Route path="/board/:id" element={<Board />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/edit-project/:id" element={<CreateProject />} />
          <Route path="/sent-invitations" element={<SentInvitations />} />
          <Route
            path="/received-invitations"
            element={<ReceivedInvitations />}
          />
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

  return (
    <div
      className={`${
        isSideBarOpen && token ? "max-w-[calc(100vw-250px)]" : "max-w-screen"
      } ml-auto`}
    >
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
