import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback: string) {
	if (isAxiosError<{ error?: string }>(error)) {
		return error.response?.data?.error ?? error.message ?? fallback;
	}
	if (error instanceof Error) return error.message;
	return fallback;
}
