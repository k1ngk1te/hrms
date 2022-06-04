import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertProps } from "../../components/controls/Alert";

const initialState: AlertProps = {
  message: undefined,
  type: "info",
  visible: false,
};

interface AlertType extends AlertProps {
  scrollTop?: boolean;
}

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    open(state, { payload }: PayloadAction<AlertType>) {
      state.message = payload.message || "A server error occurred!";
      state.type = payload.type || "info";
      state.visible = true;
      if (payload.scrollTop !== false) window.scrollTo(0, 0);
    },
    close() {
      return initialState;
    },
  },
});

export const { close, open } = alertSlice.actions;
export default alertSlice.reducer;
