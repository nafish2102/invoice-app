export interface InvoiceLine {
  rowNo: number;
  itemID: number;
  description: string;
  quantity: number;
  rate: number;
  discountPct: number;
}

export interface InvoiceListItem {
  primaryKeyID: number;
  invoiceID: number;
  invoiceNo: string | number;
  invoiceDate: string;
  customerName: string;
  subTotal: number;
  taxPercentage: number;
  taxAmount: number;
  invoiceAmount: number;
  createdByUserName: string;
  createdOn: string;
  updatedByUserName: string | null;
  updatedOn: string | null;
}

export interface InvoiceInput {
  invoiceNo: number;
  invoiceDate: string;
  customerName: string;
  address: string | null;
  city: string | null;
  taxPercentage: number;
  notes: string | null;
  lines: InvoiceLine[];
}

export interface InvoiceDetail extends InvoiceInput {
  primaryKeyID: number;
  invoiceID: number;
  subTotal: number;
  taxAmount: number;
  invoiceAmount: number;
  createdByUserName: string;
  createdOn: string;
  updatedByUserName: string | null;
  updatedOn: string | null;
}

export interface UpdateInvoiceInput extends InvoiceInput {
  invoiceID: number;
  updatedOn: string | null;
}
