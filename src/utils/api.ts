type ApiResponse<T> = {
  result: boolean;
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

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  const url = buildUrl(endpoint, params);
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };
  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
      return {
        result: false,
        error: {
          code: response.status,
          message: data.message || "An error occurred",
        },
      };
    }
    return { result: true, data };
  } catch (error) {
    return {
      result: false,
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
  params?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(
    endpoint,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
    params,
    customHeaders
  );
}

export async function post<T>(
  endpoint: string,
  data: any,
  params?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(
    endpoint,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    params,
    customHeaders
  );
}

export async function put<T>(
  endpoint: string,
  data: any,
  params?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(
    endpoint,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    params,
    customHeaders
  );
}

export async function del<T>(
  endpoint: string,
  data: any,
  params?: Record<string, any>,
  customHeaders?: Record<string, string>
): Promise<ApiResponse<T>> {
  return fetchWithAuth<T>(
    endpoint,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
    params,
    customHeaders
  );
}
