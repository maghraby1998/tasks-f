import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Outlet, useNavigate } from "react-router-dom";
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
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import Notifications from "./Notifications";

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
// const pages = [{}];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Layout = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const tasksView = useSelector((state: RootState) => state.auth.tasksView);

  const isSideBarOpen = useSelector(
    (state: RootState) => state.auth.isSideBarOpen,
  );

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = () => {
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

  const handleProfileSettings = () => {
    navigate("/profile-settings");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          marginLeft: isSideBarOpen ? "250px" : 0,
          top: 0,
          left: 0,
          width: isSideBarOpen ? "calc(100vw - 250px)" : "100%",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {!isSideBarOpen ? (
                <IconButton
                  onClick={handleOpenNavMenu}
                  sx={{
                    marginRight: 1,
                    transform: "rotate(180deg)",
                  }}
                >
                  <KeyboardDoubleArrowLeftIcon />
                </IconButton>
              ) : null}
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: "flex",
                  fontWeight: 700,
                  letterSpacing: ".1rem",
                  color: "black",
                  textDecoration: "none",
                  textTransform: "capitalize",
                }}
              >
                space
              </Typography>
            </Box>

            {/* start of big screen */}

            <ButtonGroup sx={{ alignItems: "center", flexGrow: 1, ml: 3 }}>
              <IconButton
                sx={{
                  borderRadius: 1,
                  width: 80,
                  height: 30,
                  ...(tasksView === TasksView.board
                    ? {
                        color: "#1F2937",
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
                  borderRadius: 1,
                  width: 80,
                  height: 30,
                  ...(tasksView === TasksView.list
                    ? {
                        color: "#1F2937",
                      }
                    : {}),
                }}
                onClick={() => handleChangeTasksView(TasksView.list)}
              >
                <List sx={{ marginRight: "2px" }} />
                <p className="capitalize text-sm">list</p>
              </IconButton>
            </ButtonGroup>

            <Box sx={{ flexGrow: 0, display: "flex", gap: 2 }}>
              <Notifications />

              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user?.name?.toUpperCase() ?? ""}
                    src="/static/images/avatar/2.jpg"
                    sx={{
                      backgroundColor: "#1F2937",
                      color: "white",
                      height: 30,
                      width: 30,
                      fontSize: 16,
                    }}
                  />
                </IconButton>
              </Tooltip>

              <ThemeProvider theme={theme}>
                <Menu
                  sx={{
                    mt: "45px",
                    width: 300,
                    minWidth: 300,
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
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 2,
                      py: 1,
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    <Avatar
                      alt={user?.name?.toUpperCase() ?? ""}
                      src="/static/images/avatar/2.jpg"
                      sx={{
                        backgroundColor: "#1F2937",
                        height: 40,
                        width: 40,
                      }}
                    />
                    <p className="font-semibold">{user && user?.name}</p>
                  </MenuItem>

                  <MenuItem
                    onClick={handleProfileSettings}
                    sx={{
                      ":hover": {
                        backgroundColor: "#E5E7EB",
                      },
                    }}
                  >
                    <p>
                      <SettingsIcon fontSize="small" /> Settings
                    </p>
                  </MenuItem>

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      display: "flex",
                      gap: 1,
                      ":hover": {
                        backgroundColor: "#E5E7EB",
                      },
                    }}
                  >
                    <LogoutIcon fontSize="small" />
                    <Typography
                      textAlign="center"
                      className="capitalize"
                      sx={{ fontSize: 14 }}
                    >
                      log out
                    </Typography>
                  </MenuItem>
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
