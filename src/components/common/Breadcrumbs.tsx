import { Fragment } from "react"
import { Link, useMatch } from "react-router-dom"

const BreadcrumbLink = ({ href, title }: { href: string; title: string }) => {
	const active = useMatch(href) !== null

	return (
		<Link 
			to={href || "#"}
			className={`${active ? "text-indigo-600" : "text-gray-400 hover:text-indigo-600"} cursor-pointer capitalize font-semibold my-1 text-base md:text-lg`}
		>
			{title}
		</Link>
	)
}

const Breadcrumbs = ({ links }: { links: { title: string; href: string }[] }) => (
	<div className="flex flex-wrap items-center">
		{links.map((link, index) => {
			return (
				<Fragment key={index}>
					<BreadcrumbLink {...link} />
					{links.length - 1 !== index && (
						<span className="mx-2 text-gray-400 font-semibold text-base">/</span>
					)}
				</Fragment>
			)
		})}
	</div>
)

export default Breadcrumbs