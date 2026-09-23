const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SignupData {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  companyName: string;
  address?: string;
  city?: string;
  zip?: string;
  industry?: string;
  currencySymbol: string;
  logo?: File | null;
}

export interface SignupResponse {
  companyID: number;
  userID: number;
  email: string;
  currencySymbol: string;
  token: string;
  redirect?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  userID: number;
  companyID: number;
  email: string;
  token: string;
  redirect?: string;
}

export class AuthApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly responseBody: unknown,
    message: string,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error("The API base URL is not configured.");
  }

  return API_BASE_URL;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function getResponseMessage(responseBody: unknown, fallback: string) {
  if (typeof responseBody !== "object" || responseBody === null) {
    return fallback;
  }

  const body = responseBody as { message?: unknown; error?: unknown };

  if (typeof body.message === "string") {
    return body.message;
  }

  if (typeof body.error === "string") {
    return body.error;
  }

  return fallback;
}

async function throwApiError(response: Response): Promise<never> {
  const responseBody = await parseResponseBody(response);
  const message = getResponseMessage(
    responseBody,
    `Invalid email or password.`,
  );

  throw new AuthApiError(response.status, responseBody, message);
}

export async function signupUser(data: SignupData): Promise<SignupResponse> {
  const formData = new FormData();

  formData.append("firstName", data.firstName);
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("companyName", data.companyName);
  formData.append("currencySymbol", data.currencySymbol);

  if (data.lastName) formData.append("lastName", data.lastName);
  if (data.address) formData.append("address", data.address);
  if (data.city) formData.append("city", data.city);
  if (data.zip) formData.append("zip", data.zip);
  if (data.industry) formData.append("industry", data.industry);
  if (data.logo) formData.append("logo", data.logo);

  const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await parseResponseBody(response)) as SignupResponse;
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return throwApiError(response);
  }

  return (await parseResponseBody(response)) as LoginResponse;
}
