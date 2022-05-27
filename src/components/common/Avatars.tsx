export type AvatarType = {
	alt?:string;
	src:string;
	className?: string;
	ringSize?: string;
	ringColor?: string;
	rounded?: string;
	size?: string;
}

export type AvatarsType = {
	spacing?: string;
	images: AvatarType[];
	ringSize?: string;
	ringColor?: string;
	rounded?: string;
	size?: string;
}

export const Avatar = ({ className, alt, ringColor, ringSize, rounded, size, src }: AvatarType) => {
	const classes = `inline-block ${size} ${rounded} ${ringSize} ${ringColor}`

	return (
		<img
			className={className || classes}
			src={src || ""}
			alt={alt || ""}
		/>
	)
}

Avatar.defaultProps = {
	ringColor: "ring-white",
	ringSize: "ring-2",
	rounded: "rounded-full",
	spacing: "-space-x-2",
	size: "h-8 w-8"
}

const Avatars = ({ images, spacing, ringColor, ringSize, rounded, size }: AvatarsType) => {

	const classes = `inline-block ${size} ${rounded} ${ringSize} ${ringColor}`

	return (
		<div
			className={`flex ${spacing || ""} overflow-hidden`}
		>
			{images.map((image, index) => (
				<Avatar
					key={index}
					className={classes}
					src={image.src || ""}
					alt={image.alt || ""}
				/>
			))}
		</div>
	)
}

Avatars.defaultProps = {
	ringColor: "ring-white",
	ringSize: "ring-2",
	rounded: "rounded-full",
	spacing: "-space-x-2",
	size: "h-8 w-8"
}

export default Avatars