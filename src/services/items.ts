import type { CreateItemData, ItemListItem, UpdateItemData } from "@/types/item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ItemsApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ItemsApiError";
  }
}

async function getErrorMessage(response: Response, fallback: string) {
  const message = await response.text();
  return message || fallback;
}

export async function getItems(token: string): Promise<ItemListItem[]> {
  if (!API_BASE_URL) {
    throw new ItemsApiError("The API base URL is not configured.", 0);
  }

  const response = await fetch(`${API_BASE_URL}/Item/GetList`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ItemsApiError(
      await getErrorMessage(response, "Unable to load items."),
      response.status,
    );
  }

  return (await response.json()) as ItemListItem[];
}

export async function getItem(itemID: number, token: string): Promise<ItemListItem> {
  if (!API_BASE_URL) {
    throw new ItemsApiError("The API base URL is not configured.", 0);
  }

  const response = await fetch(`${API_BASE_URL}/Item/${itemID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ItemsApiError(
      await getErrorMessage(response, "Unable to load item."),
      response.status,
    );
  }

  return (await response.json()) as ItemListItem;
}

export async function createItem(
  data: CreateItemData,
  token: string,
): Promise<void> {
  if (!API_BASE_URL) {
    throw new ItemsApiError("The API base URL is not configured.", 0);
  }

  const response = await fetch(`${API_BASE_URL}/Item`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ItemsApiError(
      await getErrorMessage(response, "Unable to create item."),
      response.status,
    );
  }
}

export async function updateItem(
  data: UpdateItemData,
  token: string,
): Promise<void> {
  if (!API_BASE_URL) {
    throw new ItemsApiError("The API base URL is not configured.", 0);
  }

  const response = await fetch(`${API_BASE_URL}/Item`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new ItemsApiError(
      await getErrorMessage(response, "Unable to update item."),
      response.status,
    );
  }
}

export async function deleteItem(itemID: number, token: string): Promise<void> {
  if (!API_BASE_URL) {
    throw new ItemsApiError("The API base URL is not configured.", 0);
  }

  const response = await fetch(`${API_BASE_URL}/Item/${itemID}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new ItemsApiError(
      await getErrorMessage(response, "Unable to delete item."),
      response.status,
    );
  }
}
