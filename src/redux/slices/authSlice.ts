import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../__generated__/graphql";
import TasksView from "../../enums/TasksView";

export interface AuthState {
  token: string | null;
  user: Partial<User> | null;
  isSideBarOpen: boolean;
  tasksView: TasksView;
}

const initialState: AuthState = {
  token: null,
  user: {},
  isSideBarOpen: false,
  tasksView: TasksView.board,
};

type Login = { user: Partial<User>; access_token: string };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Login>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.token = action.payload.access_token;
      state.user = action.payload.user;
    },
    toggleSideBar: (state, action: PayloadAction<boolean>) => {
      state.isSideBarOpen = action.payload;
    },
    toggleTasksView: (state, action: PayloadAction<TasksView>) => {
      state.tasksView = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, toggleSideBar, toggleTasksView, logout } =
  authSlice.actions;

export default authSlice.reducer;
