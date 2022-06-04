import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { login, logout } from "../../store/features/auth-slice"
import { useUserDataQuery } from "../../store/features/auth-api-slice";
import { useAppDispatch } from "../../hooks";
import { SplashScreen } from "../../components/common";

const CheckAuth = () => {
	const dispatch = useAppDispatch();
	const { data, isLoading, isError, isSuccess } = useUserDataQuery()

	useEffect(() => {
		if (isSuccess && data) dispatch(login(data))
		else if (isError) dispatch(logout())
	}, [dispatch, data, isSuccess, isError])

	return isLoading ? <SplashScreen /> : <Outlet />
}

export default CheckAuth;