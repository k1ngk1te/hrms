// import { NOT_FOUND_TITLE } from "@/config";
// import { PageTitle } from "@/utils";

const PageError = ({
	statusCode,
	title,
}: {
	statusCode?: number;
	title?: string;
}) => (
	<div className="flex justify-center h-screen items-center w-screen">
		{/* <PageTitle title={NOT_FOUND_TITLE} /> */}
		<p className="text-lg">{statusCode || 500}</p>
		<div className="h-[10px] w-[1.25px]" />
		<p className="text-base">
			{title && typeof title === "string"
				? title
				: "A server error occurred! Please try again later."}
		</p>
	</div>
);

export default PageError;
