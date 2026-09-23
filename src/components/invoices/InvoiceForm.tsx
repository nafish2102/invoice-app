"use client";

import { Alert, Button, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import type { ItemListItem } from "@/types/item";

export type InvoiceFormField = "invoiceNo" | "invoiceDate" | "customerName" | "address" | "city" | "taxPercentage" | "notes" | "itemID" | "description" | "quantity" | "rate" | "discountPct";

type InvoiceFormProps = {
  invoiceNo: string | number;
  invoiceDate: string;
  customerName: string;
  address: string;
  city: string;
  taxPercentage: string | number;
  notes: string;
  itemID: string | number;
  description: string;
  quantity: string | number;
  rate: string | number;
  discountPct: string | number;
  items: ItemListItem[];
  itemsLoading: boolean;
  itemsError?: string;
  fieldErrors?: Partial<Record<InvoiceFormField, string>>;
  error?: string;
  success?: string;
  saving: boolean;
  submitLabel: string;
  onChange: (field: InvoiceFormField, value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function InvoiceForm({ invoiceNo, invoiceDate, customerName, address, city, taxPercentage, notes, itemID, description, quantity, rate, discountPct, items, itemsLoading, itemsError, fieldErrors, error, success, saving, submitLabel, onChange, onCancel, onSubmit }: InvoiceFormProps) {
  return (
    <Paper component="form" onSubmit={onSubmit} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, "& .MuiFormHelperText-root": { marginLeft: 0 } }}>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Invoice No. *" type="number" value={invoiceNo} onChange={(event) => onChange("invoiceNo", event.target.value)} error={Boolean(fieldErrors?.invoiceNo)} helperText={fieldErrors?.invoiceNo} fullWidth />
          <TextField label="Invoice Date *" type="date" value={invoiceDate} onChange={(event) => onChange("invoiceDate", event.target.value)} error={Boolean(fieldErrors?.invoiceDate)} helperText={fieldErrors?.invoiceDate} slotProps={{ inputLabel: { shrink: true } }} fullWidth />
        </Stack>
        <TextField label="Customer Name *" value={customerName} onChange={(event) => onChange("customerName", event.target.value)} error={Boolean(fieldErrors?.customerName)} helperText={fieldErrors?.customerName} fullWidth />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Address" value={address} onChange={(event) => onChange("address", event.target.value)} fullWidth />
          <TextField label="City" value={city} onChange={(event) => onChange("city", event.target.value)} fullWidth />
        </Stack>
        <TextField label="Tax Percentage" type="number" value={taxPercentage} onChange={(event) => onChange("taxPercentage", event.target.value)} fullWidth />
        <TextField label="Notes" value={notes} onChange={(event) => onChange("notes", event.target.value)} multiline rows={2} fullWidth />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, pt: 1 }}>Line Item</Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth error={Boolean(fieldErrors?.itemID)}>
            <InputLabel id="invoice-item-label">Item *</InputLabel>
            <Select labelId="invoice-item-label" label="Item *" value={itemID} onChange={(event) => onChange("itemID", String(event.target.value))} disabled={itemsLoading}>
              {items.map((item) => <MenuItem key={item.primaryKeyID} value={item.primaryKeyID}>{item.itemName}</MenuItem>)}
            </Select>
            <FormHelperText sx={{ marginLeft: 0 }}>{fieldErrors?.itemID || itemsError || (itemsLoading ? "Loading items..." : "")}</FormHelperText>
          </FormControl>
          <TextField label="Description" value={description} onChange={(event) => onChange("description", event.target.value)} fullWidth />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Quantity *" type="number" value={quantity} onChange={(event) => onChange("quantity", event.target.value)} error={Boolean(fieldErrors?.quantity)} helperText={fieldErrors?.quantity} fullWidth />
          <TextField label="Rate *" type="number" value={rate} onChange={(event) => onChange("rate", event.target.value)} error={Boolean(fieldErrors?.rate)} helperText={fieldErrors?.rate} fullWidth />
          <TextField label="Discount %" type="number" value={discountPct} onChange={(event) => onChange("discountPct", event.target.value)} fullWidth />
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end", pt: 1 }}>
          <Button disabled={saving} onClick={onCancel} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: "none" }}>{saving ? "Saving..." : submitLabel}</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
