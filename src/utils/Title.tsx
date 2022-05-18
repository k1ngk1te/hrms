import { useEffect } from "react";

const Title = ({ title }: { title: string }) => {

    useEffect(() => {
        if (title && document.title !== title)
            document.title = `${title} | AXHUB`
    }, [title])

    return <></>
}

export default Title