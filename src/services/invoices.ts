import type {
  InvoiceDetail,
  InvoiceInput,
  InvoiceListItem,
  UpdateInvoiceInput,
} from "@/types/invoice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class InvoicesApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "InvoicesApiError";
  }
}

function getApiUrl(path: string) {
  if (!API_BASE_URL) {
    throw new InvoicesApiError("The API base URL is not configured.", 0);
  }

  return `${API_BASE_URL}${path}`;
}

async function getErrorMessage(response: Response, fallback: string) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = (await response.json()) as { title?: string; message?: string };
    return body.message || body.title || fallback;
  }

  return (await response.text()) || fallback;
}

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new InvoicesApiError(
      await getErrorMessage(response, "Unable to process the invoice request."),
      response.status,
    );
  }

  return (await response.json()) as T;
}

export function getInvoices(token: string) {
  return request<InvoiceListItem[]>("/Invoice/GetList", token);
}

export function getInvoice(invoiceID: number, token: string) {
  return request<InvoiceDetail>(`/Invoice/${invoiceID}`, token);
}

export function createInvoice(data: InvoiceInput, token: string) {
  return request<unknown>("/Invoice", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateInvoice(data: UpdateInvoiceInput, token: string) {
  return request<unknown>("/Invoice", token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteInvoice(invoiceID: number, token: string) {
  const response = await fetch(getApiUrl(`/Invoice/${invoiceID}`), {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new InvoicesApiError(
      await getErrorMessage(response, "Unable to delete invoice."),
      response.status,
    );
  }
}
