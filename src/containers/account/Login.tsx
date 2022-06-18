import { ChangeEvent, FormEvent, FC } from "react";
import { LOGO_IMAGE } from "../../config";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Button, Input } from "../../components/controls";

const Login: FC<LoginProps> = ({
  error,
  form,
  loading,
  onChange,
  onSubmit,
}) => (
  <div className="bg-primary-500 h-screen w-full">
    <div className="flex h-full items-center w-full" style={{ background: "url(/static/images/bg.png)" }}>
      <div className="bg-transparent flex h-full mt-3 w-full sm:items-center sm:mt-0">
        <div className="bg-gray-100 flex flex-col justify-center max-h-[600px] max-w-xs mx-auto pb-3 rounded-md shadow-lg w-full">
          <div className="flex justify-center mb-3 pt-4">
            <div className="h-[40px] w-[40px] md:h-[50px] md:w-[50px]">
              <img
                className="h-full w-full"
                src={LOGO_IMAGE}
                alt="kite"
              />
            </div>
          </div>
          <div className="px-10">
            <h3 className="capitalize font-bold mt-3 mb-6 text-left text-primary-500 text-xl tracking-wide md:text-2xl">
              sign in
            </h3>
            {error && !error.password && !error.email && (
              <p className="italice max-w-xs mx-auto my-3 text-center text-red-500 text-sm">
                Error: {String(error?.detail || error?.error || "A server error occurred!")}
              </p>
            )}
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <Input
                  disabled={loading}
                  error={error?.email}
                  Icon={FaEnvelope}
                  label="Email"
                  name="email"
                  onChange={onChange}
                  placeholder="E-mail"
                  required
                  type="email"
                  value={form?.email || ""}
                />
              </div>
              <div className="mb-6">
                <Input
                  disabled={loading}
                  error={error?.password}
                  Icon={FaLock}
                  label="password"
                  name="password"
                  onChange={onChange}
                  placeholder="*************"
                  required
                  type="password"
                  value={form?.password || ""}
                />
              </div>
              <div className="mb-3 w-full">
                <Button
                  disabled={loading}
                  loader
                  loading={loading}
                  title="sign in"
                  type="submit"
                />
              </div>
              <div className="flex justify-end mb-6">
                <a
                  className="align-baseline capitalize cursor-pointer font-bold inline-block text-secondary-500 text-xs hover:text-secondary-600 hover:underline"
                  href="#"
                >
                  forgot password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="bg-transparent flex hidden items-center w-full lg:block">
        <div className="bg-transparent max-w-2xl mx-auto px-10 py-6">
          <h1 className="font-extrabold my-6 text-5xl text-center text-white tracking-wide">
            Login to{" "}
            <span className="text-primary-100 uppercase">
              kite<span className="text-secondary-500">hrms</span>
            </span>
          </h1>
          <p className="leading-8 max-w-lg mx-auto my-6 text-base text-center text-gray-100 tracking-wide">
            A Centralised Management System that manages all employee
            information, leaves, overtime and more.
          </p>
        </div>
      </div>
    </div>
  </div>
);

type LoginProps = {
  error?: {
    detail?: string;
    error?: string;
    email?: string;
    password?: string;
  };
  form: {
    email: string;
    password: string;
  };
  loading: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export default Login;
