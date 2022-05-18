// import { NOT_FOUND_TITLE } from "@/config";
// import { PageTitle } from "@/utils";

const PageNotFound = () => (
	<div className="flex justify-center h-screen items-center w-screen">
		{/* <PageTitle title={NOT_FOUND_TITLE} /> */}
		<p className="text-lg">404</p>
		<div className="h-[10px] w-[1.25px]" />
		<p className="text-base">Page Not Found</p>
	</div>
)

export default PageNotFound;