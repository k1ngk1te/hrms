import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom"
import { HOME_PAGE_URL, LOGIN_PAGE_URL } from "../../config/routes";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { login } from "../../store/features/auth-slice";
import { useLoginMutation } from "../../store/features/auth-api-slice";
import Login from "../../containers/account/Login";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const [signIn, { data, error, isLoading, isSuccess }] = useLoginMutation();
  const apiErrors: any = error && "data" in error && error.data

  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const handleChange = useCallback(
    ({ target: { name, value } }: ChangeEvent<HTMLInputElement>) => {
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      signIn(form);
    },
    [form, signIn]
  );

  useEffect(() => {
    if (data && isSuccess) dispatch(login(data));
  }, [data, dispatch, isSuccess]);

  return (
    <Login
      error={apiErrors}
      form={form}
      loading={isLoading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
};

export default SignIn;
