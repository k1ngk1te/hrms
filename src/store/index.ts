import { configureStore } from "@reduxjs/toolkit";
import { NODE_ENV } from "@/config";
import { baseApi } from "@/store/features/base";
import alertModalReducer from "@/store/features/alert-modal-slice";
import alertReducer from "@/store/features/alert-slice";
import authReducer from "@/store/features/auth-slice";
import modalReducer from "@/store/features/modal-slice";

const store = configureStore({
  devTools: NODE_ENV === "development",
  reducer: {
  	alert: alertReducer,
    alertModal: alertModalReducer,
    auth: authReducer,
    modal: modalReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ["alertModal/open", "alertModal/close"],
      // },
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export * from "./utils";

export default store;
