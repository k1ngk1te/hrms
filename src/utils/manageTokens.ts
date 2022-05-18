import cookie from "react-cookies";
import { CSRF_HEADER_KEY, CSRF_TOKEN } from "../config"

export const getCsrfToken = (): { key: string; value: string; } | null => {
	const csrftoken = cookie.load(CSRF_TOKEN)
    if (csrftoken) return { key: CSRF_HEADER_KEY, value: csrftoken }
    return null;
}