import { Dispatch, FC, ReactNode, SetStateAction, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { DEFAULT_PAGINATION_SIZE } from "../../config";
import { close as alertClose } from "../../store/features/alert-slice";
import { logout } from "../../store/features/auth-slice";
import { close } from "../../store/features/alert-modal-slice";
import Error from "../../pages/error";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { AlertModal, Pagination } from "./index";
import { Alert, Loader } from "../controls"
import { LoadingPage } from "../../utils";

type IconProps = {
	children: ReactNode;
	className: string;
	link?: string;
	onClick?: () => void;
};

const IconContainer: FC<IconProps> = ({
	className,
	children,
	link,
	onClick,
}) => {
	const navigate = useNavigate();

	return link ? (
		<Link to={link}>
			<span className={className}>{children}</span>
		</Link>
	) : onClick ? (
		<span className={className} onClick={onClick}>
			{children}
		</span>
	) : (
		<span className={className} onClick={() => navigate(-1)}>
			{children}
		</span>
	);
};

type ContainerProps = {
	background?: string;
	children: ReactNode;
	heading: string;
	title?: number | string;
	icon?:
		| {
				link?: string;
				onClick?: () => void;
		  }
		| true;
	refresh?: {
		onClick: () => void;
		loading?: boolean;
	};
	disabledLoading?: boolean;
	error?: {
		statusCode?: number;
		title?: string;
	};
	loading: boolean;
	paginate?: {
		loading: boolean;
		totalItems: number;
		offset: number;
		setOffset: Dispatch<SetStateAction<number>>;
	};
};

const Container: FC<ContainerProps> = ({
	background = "bg-gray-50",
	children,
	error,
	heading,
	icon,
	disabledLoading,
	loading,
	paginate,
	refresh,
	title,
}) => {
	const dispatch = useAppDispatch();
	const { options, visible } = useAppSelector((state) => state.alertModal);

	const message = useAppSelector(state => state.alert.message)
	const alertType = useAppSelector(state => state.alert.type)
	const alertVisible = useAppSelector(state => state.alert.visible)

	const closeModal = useCallback(() => {
		dispatch(close());
	}, [dispatch]);

	useEffect(() => {
		if (error && error.statusCode === 401) dispatch(logout())
	}, [dispatch, error])

	return (
		<>
			<div className="relative w-full">
				{heading && (
					<div className="bg-gray-400 flex items-center justify-between w-full">
						<div className={`${icon ? "flex items-center" : ""} w-full`}>
							{icon && (
								<IconContainer
									link={typeof icon === "object" ? icon?.link : undefined}
									onClick={typeof icon === "object" ? icon?.onClick : undefined}
									className="block cursor-pointer duration-500 flex items-center justify-center ml-4 rounded-full text-primary-500 transform transition-colors hover:bg-gray-200"
								>
									<span className="block p-1">
										<FaArrowLeft className="text-xs md:text-sm" />
									</span>
								</IconContainer>
							)}
							<h5 className="capitalize font-bold mx-4 py-1 text-sm text-primary-500 tracking-wide md:text-base">
								{heading} {title && ` - ${title}`}
							</h5>
						</div>
						<div>
							{refresh && (
								<span
									onClick={refresh.onClick}
									className={`${
										refresh.loading
											? "animate-spin"
											: "animate-none duration-500 transform transition-colors"
									} block cursor-pointer flex items-center justify-center mr-4 rounded-full text-primary-500 hover:bg-gray-200`}
								>
									<span className="block p-1">
										<BiRefresh className="text-sm md:text-base" />
									</span>
								</span>
							)}
						</div>
					</div>
				)}
				<div className={`p-2 md:p-4 ${background}`}>
					{loading ? (
						<LoadingPage />
					) : error ? (
						<Error
							statusCode={error.statusCode || 500}
							title={
								error.title ||
								"A server error occurred! Please try again later."
							}
						/>
					) : (
						<>
							<div className={alertVisible ? "block container mx-auto py-2 relative w-full z-[55]" : "hidden"}>
								<Alert 
									message={message}
									onClick={() => dispatch(alertClose())}
									type={alertType}
									visible={alertVisible}
								/>
							</div>
							{children}
						</>
					)}
					{paginate && paginate.totalItems > 0 && (
						<div className="pt-2 pb-5">
							<Pagination
								disabled={paginate.loading || false}
								onChange={(pageNo: number) => {
									const value = pageNo - 1 <= 0 ? 0 : pageNo - 1;
									paginate.offset !== value && paginate.setOffset(value * DEFAULT_PAGINATION_SIZE);
								}}
								pageSize={DEFAULT_PAGINATION_SIZE}
								totalItems={paginate.totalItems || 0}
							/>
						</div>
					)}
				</div>
			</div>
			<AlertModal
				{...options}
				close={closeModal}
				message={options.message}
				visible={visible}
			/>
			{disabledLoading === true && (
				<div 
					className="fixed flex items-center justify-center h-full main-container-width top-0 z-[50]"
					style={{ background: "rgba(0, 0, 0, 0.6)" }}
				>
					<Loader size={6} type="dotted" width="sm" />
				</div>
			)}
		</>
	);
};

export default Container;
