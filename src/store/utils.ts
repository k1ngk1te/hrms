import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export function isFetchBaseQueryError(
	error: unknown
): error is FetchBaseQueryError {
	return typeof error === "object" && error !== null && "status" in error;
}

export function isErrorWithMessage(
	error: unknown
): error is { status: number; message: string } {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as any).message === "string"
	);
}

export function isErrorWithData(
	error: unknown
): error is { status: number; data: { detail: string; error: any } } {
	return (
		error !== null &&
		error !== undefined &&
		isFetchBaseQueryError(error) &&
		(error as any).data !== null &&
		(error as any).data !== undefined
	);
}

export function isFormError<T>(
	error: unknown
): error is { status: number; data: T } {
	return (
		error !== null &&
		error !== undefined &&
		isFetchBaseQueryError(error) &&
		(error as any).data !== null &&
		(error as any).data !== undefined
	);
}
