import { ReactNode } from "react"

const ClearFix = ({ children }: { children: ReactNode}) => (
	<div className="pt-[3rem] lg:pt-[4.8rem]">
		{children}
	</div>
)

export default ClearFix