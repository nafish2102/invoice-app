"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { createInvoice } from "@/services/invoices";
import { getItems } from "@/services/items";
import type { ItemListItem } from "@/types/item";
import AppShell from "@/components/layout/AppShell";
import InvoiceForm, { type InvoiceFormField } from "@/components/invoices/InvoiceForm";

export default function CreateInvoicePage() {
  const router = useRouter();
  const [invoiceNo, setInvoiceNo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [taxPercentage, setTaxPercentage] = useState("0");
  const [notes, setNotes] = useState("");
  const [itemID, setItemID] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [rate, setRate] = useState("");
  const [discountPct, setDiscountPct] = useState("0");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ItemListItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<InvoiceFormField, string>>>({});

  useEffect(() => {
    const loadItems = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setItemsError("You are not authenticated."); setItemsLoading(false); return; }
      try { setItems(await getItems(token)); }
      catch (loadError) { setItemsError(loadError instanceof Error ? loadError.message : "Unable to load items."); }
      finally { setItemsLoading(false); }
    };
    void loadItems();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const nextErrors: Partial<Record<InvoiceFormField, string>> = {};
    if (!invoiceNo) nextErrors.invoiceNo = "Invoice No. is required.";
    if (!invoiceDate) nextErrors.invoiceDate = "Invoice Date is required.";
    if (!customerName.trim()) nextErrors.customerName = "Customer Name is required.";
    if (!itemID) nextErrors.itemID = "Item is required.";
    if (quantity === "") nextErrors.quantity = "Quantity is required.";
    if (rate === "") nextErrors.rate = "Rate is required.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    const values = [invoiceNo, itemID, quantity, rate, taxPercentage, discountPct].map(Number);
    if (values.some((value) => !Number.isFinite(value))) {
      setError("Enter valid invoice and line details.");
      return;
    }

    setSaving(true);
    try {
      await createInvoice({ invoiceNo: values[0], invoiceDate, customerName: customerName.trim(), address: address || null, city: city || null, taxPercentage: values[4], notes: notes || null, lines: [{ rowNo: 1, itemID: values[1], description, quantity: values[2], rate: values[3], discountPct: values[5] }] }, token);
      setSuccess("Invoice created successfully.");
      window.setTimeout(() => router.push("/invoices"), 800);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Unable to create invoice.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Invoices">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Create Invoice</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Enter invoice and line details.</Typography>
        <InvoiceForm invoiceNo={invoiceNo} invoiceDate={invoiceDate} customerName={customerName} address={address} city={city} taxPercentage={taxPercentage} notes={notes} itemID={itemID} description={description} quantity={quantity} rate={rate} discountPct={discountPct} items={items} itemsLoading={itemsLoading} itemsError={itemsError} fieldErrors={fieldErrors} error={error} success={success} saving={saving} submitLabel="Create Invoice" onChange={(field, value) => { const setters: Record<InvoiceFormField, (next: string) => void> = { invoiceNo: setInvoiceNo, invoiceDate: setInvoiceDate, customerName: setCustomerName, address: setAddress, city: setCity, taxPercentage: setTaxPercentage, notes: setNotes, itemID: setItemID, description: setDescription, quantity: setQuantity, rate: setRate, discountPct: setDiscountPct }; setters[field](value); setFieldErrors((current) => ({ ...current, [field]: "" })); }} onCancel={() => router.push("/invoices")} onSubmit={handleSubmit} />
      </Box>
    </AppShell>
  );
}
