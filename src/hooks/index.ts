import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { default as useFadeIn } from "./useFadeIn";
export { default as useOutClick } from "./useOutClick";
export { default as usePagination } from "./usePagination";

export * from "./controls";
export * from "./employees";
export * from "./projects";
