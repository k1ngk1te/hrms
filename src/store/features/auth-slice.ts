import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfoType } from "../../types/user";

type AuthState = {
	data: UserInfoType | null;
	isAuthenticated: boolean;
	isLoading: boolean;
};

const initialState: AuthState = {
	data: null,
	isAuthenticated: false,
	isLoading: true,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, { payload }: PayloadAction<any>) {
			const newData = state.data
				? { ...state.data, ...payload.data }
				: payload.data;
			state.data = newData;
			state.isAuthenticated = true;
			state.isLoading = false;
		},
		logout(state) {
			state.data = null; 
			state.isAuthenticated = false;
			state.isLoading = false;
		},
		setData(state, { payload }: PayloadAction<any>) {
			const newData = state.data
				? { ...state.data, ...payload.data }
				: payload.data;
			state.data = newData;
			state.isLoading = false;
		},
	},
});

export const { login, logout, setData } = authSlice.actions;
export default authSlice.reducer;
