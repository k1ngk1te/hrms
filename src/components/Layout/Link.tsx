import { FC, useEffect, useState } from "react";
import { Link, useMatch, useLocation } from "react-router-dom";
import { IconType } from "react-icons";
import { FaArrowRight, FaChevronDown, FaChevronRight } from "react-icons/fa";

const similarStyle =
	"capitalize cursor-pointer text-gray-100 text-sm hover:bg-primary-300";
const containerStyle = `flex justify-between items-center px-5 py-3 tracking-wide lg:px-3 xl:pl-4 ${similarStyle}`;
const linkStyle = `flex items-center px-9 py-2 lg:px-6 ${similarStyle}`;

type SimpleProps = {
	onClick?: () => void;
	href: string;
	Icon?: IconType;
	title: string;
	classes?: string;
};

export const SimpleLink: FC<SimpleProps> = ({
	Icon,
	onClick,
	href,
	title,
	classes,
	...props
}) => {
	const { pathname } = useLocation();
	const _pathname =
		pathname !== "/" && pathname.slice(-1) !== "/" ? pathname + "/" : pathname;

	const active1 = useMatch(href) !== null;
	const active2 =
		href !== "/" && _pathname !== "/" && _pathname.startsWith(href);
	const active = active1 || active2;

	return (
		<Link key={title} to={href || "#"}>
			<span
				onClick={onClick ? onClick : () => {}}
				className="block my-1 lg:my-0"
				{...props}
			>
				<div className={classes || containerStyle}>
					<div
						className={`${
							active ? "text-secondary-500" : "text-gray-100"
						} flex items-center`}
					>
						{Icon && (
							<span>
								<Icon
									className={`${
										active ? "text-secondary-500" : "text-gray-100"
									} text-tiny sm:text-sm`}
								/>
							</span>
						)}
						<span className="mx-2">{title}</span>
					</div>
					<div />
				</div>
			</span>
		</Link>
	);
};

export type ListLinkItemType = {
	href?: string;
	Icon?: IconType;
	links?: ListLinkItemType[];
	onClick?: () => void;
	title: string;
	classes?: string;
};

export type ListLinkType = {
	Icon?: IconType;
	onClick?: () => void;
	links: ListLinkItemType[];
	title: string;
};

export const ListLinkItem = ({
	href,
	Icon,
	links,
	onClick,
	title,
	classes,
}: ListLinkItemType) => {
	return links !== undefined ? (
		<div className="px-2">
			<ListLink
				Icon={Icon || FaArrowRight}
				links={links}
				onClick={onClick && onClick}
				title={title}
			/>
		</div>
	) : (
		<SimpleLink
			classes={classes}
			Icon={Icon}
			onClick={onClick}
			href={href || "#"}
			title={title}
		/>
	);
};

export const ListLink: FC<ListLinkType> = ({ Icon, onClick, links, title }) => {
	const [visible, setVisible] = useState(false);
	const { pathname } = useLocation();

	const _pathname =
		pathname !== "/" && pathname.slice(-1) !== "/" ? pathname + "/" : pathname;

	const active1 = links.filter(({ href }) => href === _pathname)[0];
	const active2 = links.filter(
		({ href }) =>
			href && href !== "/" && _pathname !== "/" && _pathname.startsWith(href)
	)[0];

	const activeLink = active1 || active2;

	useEffect(() => {
		if (activeLink) setVisible(true);
		return () => setVisible(false);
	}, [activeLink]);

	return (
		<div className="my-1 lg:my-0">
			<div
				onClick={() => setVisible(!visible)}
				className={`${containerStyle} ${
					activeLink ? "text-secondary-500" : ""
				}`}
			>
				<div className="flex items-center">
					{Icon && (
						<span>
							<Icon className="text-tiny sm:text-sm" />
						</span>
					)}
					<span className="mx-2">{title}</span>
				</div>
				<div>
					{visible ? (
						<FaChevronDown className="text-tiny" />
					) : (
						<FaChevronRight className="text-tiny" />
					)}
				</div>
			</div>
			<div
				className={`${
					visible ? "block opacity-100 visible" : "hidden invisible opacity-0"
				} duration-500 transform transition-all`}
			>
				{links.map(({ Icon, href, links, title }, index) => (
					<ListLinkItem
						classes={linkStyle}
						onClick={onClick && onClick}
						key={index}
						href={href}
						links={links}
						Icon={Icon}
						title={title}
					/>
				))}
			</div>
		</div>
	);
};
