import { APIServiceResult } from "./service-result";
import { NotFoundError } from "@/errors";

export async function queryServiceOperation<T>(
  operation: Promise<T>,
  successMessage?: string
): Promise<APIServiceResult<T>> {
  try {
    const result = await operation;
    if (!result) {
      throw new NotFoundError("Not found");
    }
    return new APIServiceResult<T>(result, undefined, successMessage);
  } catch (error) {
    console.error(error);
    return new APIServiceResult<T>(undefined, error);
  }
}

export async function commandServiceOperation<T>(
  operation: () => Promise<T>,
  successMessage?: string
): Promise<APIServiceResult<T>> {
  try {
    const result = await operation();
    return new APIServiceResult<T>(result, undefined, successMessage);
  } catch (error) {
    console.error(error);
    return new APIServiceResult<T>(undefined, error);
  }
}
