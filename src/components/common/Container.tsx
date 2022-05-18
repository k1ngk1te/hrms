import { FC, ReactNode, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiRefresh } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { close } from "@/store/features/alert-modal-slice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { AlertModal } from "@/components/common";

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
};

const Container: FC<ContainerProps> = ({
	children,
	heading,
	icon,
	refresh,
	title,
}) => {
	const dispatch = useAppDispatch();
	const { options, visible } = useAppSelector((state) => state.alertModal);

	const closeModal = useCallback(() => {
		dispatch(close());
	}, [dispatch]);

	return (
		<>
			<div className="relative w-full">
				{heading && (
					<div className="bg-gray-400 flex items-center justify-between w-full">
						<div className={`${icon ? "flex items-center" : ""} w-full`}>
							{icon && (
								<IconContainer
									{...icon}
									className="block cursor-pointer duration-500 flex items-center justify-center ml-4 rounded-full text-primary-500 transform transition-colors hover:bg-gray-200"
								>
									<span className="block p-1">
										<FaArrowLeft className="block p-1 text-xs md:text-sm" />
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
				<div className="p-2 md:p-4">{children}</div>
			</div>
			<AlertModal
				{...options}
				close={closeModal}
				message={options.message}
				visible={visible}
			/>
		</>
	);
};

export default Container;
