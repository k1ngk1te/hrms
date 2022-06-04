import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalProps } from "../../components/common/AlertModal";

type ModalPropsType = Omit<ModalProps, "close"|"visible">

const initialState: {
	visible: boolean;
	options: ModalPropsType;
} = {
	visible: false,
	options: {
		message: "",
	}
}

const alertModalSlice = createSlice({
	name: "alertModal",
	initialState,
	reducers: {
		open(state, { payload }: PayloadAction<ModalPropsType>) {
			state.options = payload;
			state.visible = true;
		},
		close() {
			return initialState
		}
	}
})

export const { close, open } = alertModalSlice.actions
export default alertModalSlice.reducer