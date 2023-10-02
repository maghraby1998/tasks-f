import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import {
  logout,
  toggleSideBar,
  toggleTasksView,
} from "../../redux/slices/authSlice";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import Sidebar from "./Sidebar";
import { ButtonGroup, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BorderAllRounded, List } from "@mui/icons-material";
import TasksView from "../../enums/TasksView";
import { client } from "../../graphql/client";

const theme = createTheme({
  components: {
    // Name of the component
    MuiMenu: {
      styleOverrides: {
        list: () => ({
          width: 200,
        }),
      },
    },
  },
});

// const pages = [{ name: "board", to: "/" }];
const pages = [{}];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Layout = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasksView = useSelector((state: RootState) => state.auth.tasksView);

  const isSideBarOpen = useSelector(
    (state: RootState) => state.auth.isSideBarOpen
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    dispatch(toggleSideBar(!isSideBarOpen));
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    client.resetStore();
    dispatch(logout());
  };

  const handleChangeTasksView = (value: TasksView) => {
    dispatch(toggleTasksView(value));
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#61677A",
          marginLeft: isSideBarOpen ? "250px" : 0,
          top: 0,
          left: 0,
          width: isSideBarOpen ? "calc(100vw - 250px)" : "100%",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {!isSideBarOpen ? (
              <IconButton
                onClick={handleOpenNavMenu}
                sx={{
                  marginRight: 1,
                  transform: "rotate(180deg)",
                }}
              >
                <KeyboardDoubleArrowLeftIcon sx={{ color: "#fff" }} />
              </IconButton>
            ) : null}
            <Typography
              variant="h6"
              noWrap
              // component="a"
              // href="/"
              sx={{
                mr: 2,
                display: "fl  ex",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
                textTransform: "capitalize",
              }}
            >
              space
            </Typography>

            {/* start of big screen */}

            <ButtonGroup sx={{ alignItems: "center", flexGrow: 1, ml: 3 }}>
              <IconButton
                sx={{
                  color: "white",
                  borderRadius: 1,
                  width: 80,
                  height: 30,
                  ...(tasksView === TasksView.board
                    ? {
                        backgroundColor: "#fff",
                        color: "#61677A",
                        ":hover": { backgroundColor: "#fff" },
                      }
                    : {}),
                }}
                onClick={() => handleChangeTasksView(TasksView.board)}
              >
                <BorderAllRounded sx={{ marginRight: "2px" }} />
                <p className="capitalize text-sm">board</p>
              </IconButton>

              <IconButton
                sx={{
                  color: "white",
                  borderRadius: 1,
                  width: 80,
                  height: 30,
                  ...(tasksView === TasksView.list
                    ? {
                        backgroundColor: "#fff",
                        color: "#61677A",
                        ":hover": { backgroundColor: "#fff" },
                      }
                    : {}),
                }}
                onClick={() => handleChangeTasksView(TasksView.list)}
              >
                <List sx={{ marginRight: "2px" }} />
                <p className="capitalize text-sm">list</p>
              </IconButton>
            </ButtonGroup>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name ?? "user name"}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <ThemeProvider theme={theme}>
                <Menu
                  sx={{
                    mt: "45px",
                    width: 200,
                    minWidth: 200,
                    maxWidth: "unset",
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <p className="px-[15px] border-b pb-2">{user && user.name}</p>
                  {/* {settings.map((setting) => ( */}
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">logout</Typography>
                  </MenuItem>
                  {/* ))} */}
                </Menu>
              </ThemeProvider>
            </Box>
            {/* end of big screen */}
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
      {isSideBarOpen ? <Sidebar /> : null}
    </>
  );
};
export default Layout;
