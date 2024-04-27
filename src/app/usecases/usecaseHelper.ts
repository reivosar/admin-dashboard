import { NotFoundError } from "@/utils/errors";
import { ApiResult } from "../apiResult";

export async function queryUseCaseOperation<T>(
  operation: Promise<T>,
  successMessage?: string
): Promise<ApiResult<T>> {
  try {
    const result = await operation;
    if (!result) {
      throw new NotFoundError("Not found");
    }
    return new ApiResult<T>(result, undefined, successMessage);
  } catch (error) {
    console.error(error);
    return new ApiResult<T>(undefined, error);
  }
}

export async function commandUseCaseOperation<T>(
  operation: () => Promise<T>,
  successMessage?: string
): Promise<ApiResult<T>> {
  try {
    const result = await operation();
    return new ApiResult<T>(result, undefined, successMessage);
  } catch (error) {
    console.error(error);
    return new ApiResult<T>(undefined, error);
  }
}
