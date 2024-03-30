type ApiResponse<T> = {
  data?: T;
  error?: {
    code: number;
    message: string;
  };
};

function buildUrl(endpoint: string, params?: Record<string, any>): string {
  const url = new URL(endpoint, window.location.origin);
  if (params) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }
  return url.toString();
}

async function fetchData<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  const url = buildUrl(endpoint, params);
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      return {
        error: {
          code: response.status,
          message: data.message || "An error occurred",
        },
      };
    }
    return { data };
  } catch (error) {
    return {
      error: {
        code: 500,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
    };
  }
}

export async function get<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return fetchData<T>(
    endpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    params
  );
}

export async function post<T>(
  endpoint: string,
  data: any,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return fetchData<T>(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    params
  );
}

export async function put<T>(
  endpoint: string,
  data: any,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return fetchData<T>(
    endpoint,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    params
  );
}

export async function del<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<ApiResponse<T>> {
  return fetchData<T>(
    endpoint,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
    params
  );
}
