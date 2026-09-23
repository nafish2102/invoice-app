"use client";

import { Alert, Button, Paper, Stack, TextField } from "@mui/material";

type ItemFormProps = {
  itemName: string;
  description: string;
  salesRate: string | number;
  discountPct: string | number;
  itemNameError?: string;
  salesRateError?: string;
  discountError?: string;
  fieldErrors?: { itemName?: string; salesRate?: string; discountPct?: string };
  error?: string;
  success?: string;
  saving: boolean;
  submitLabel: string;
  onItemNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSalesRateChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  onCancel: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function ItemForm({ itemName, description, salesRate, discountPct, itemNameError, salesRateError, discountError, fieldErrors, error, success, saving, submitLabel, onItemNameChange, onDescriptionChange, onSalesRateChange, onDiscountChange, onCancel, onSubmit }: ItemFormProps) {
  return (
    <Paper component="form" onSubmit={onSubmit} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, "& .MuiFormHelperText-root": { marginLeft: 0 } }}>
      <Stack spacing={2.5}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <TextField label="Item Name *" value={itemName} onChange={(event) => onItemNameChange(event.target.value)} error={Boolean(itemNameError || fieldErrors?.itemName)} helperText={itemNameError || fieldErrors?.itemName} fullWidth />
        <TextField label="Description" value={description} onChange={(event) => onDescriptionChange(event.target.value)} multiline rows={3} fullWidth />
        <TextField label="Sales Rate *" type="number" value={salesRate} onChange={(event) => onSalesRateChange(event.target.value)} error={Boolean(salesRateError || fieldErrors?.salesRate)} helperText={salesRateError || fieldErrors?.salesRate} fullWidth />
        <TextField label="Discount %" type="number" value={discountPct} onChange={(event) => onDiscountChange(event.target.value)} error={Boolean(discountError)} helperText={discountError} fullWidth />
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "flex-end" }}>
          <Button onClick={onCancel} disabled={saving} sx={{ textTransform: "none" }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: "none" }}>{saving ? "Saving..." : submitLabel}</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
