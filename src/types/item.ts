export interface ItemListItem {
  primaryKeyID: number;
  itemID: number;
  itemName: string;
  description: string | null;
  salesRate: number;
  discountPct: number;
  createdByUserName: string;
  createdOn: string;
  updatedByUserName: string | null;
  updatedOn: string | null;
}

export interface CreateItemData {
  itemName: string;
  description: string;
  salesRate: number;
  discountPct: number;
}

export interface UpdateItemData extends CreateItemData {
  itemID: number;
  updatedOn: string | null;
}
