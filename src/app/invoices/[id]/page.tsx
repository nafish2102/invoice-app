"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getInvoice, updateInvoice } from "@/services/invoices";
import { getItems } from "@/services/items";
import type { ItemListItem } from "@/types/item";
import type { InvoiceDetail } from "@/types/invoice";
import AppShell from "@/components/layout/AppShell";
import InvoiceForm, { type InvoiceFormField } from "@/components/invoices/InvoiceForm";

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<ItemListItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<InvoiceFormField, string>>>({});

  useEffect(() => {
    const loadInvoice = async () => {
      const token = localStorage.getItem("token");
      const invoiceID = Number(params.id);

      if (!token || !Number.isInteger(invoiceID)) {
        setError("Unable to load invoice.");
        setLoading(false);
        return;
      }

      try {
        setInvoice(await getInvoice(invoiceID, token));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load invoice.");
      } finally {
        setLoading(false);
      }
    };

    void loadInvoice();
  }, [params.id]);

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
    if (!invoice) return;
    const nextErrors: Partial<Record<InvoiceFormField, string>> = {};
    if (!invoice.invoiceNo) nextErrors.invoiceNo = "Invoice No. is required.";
    if (!invoice.invoiceDate) nextErrors.invoiceDate = "Invoice Date is required.";
    if (!invoice.customerName.trim()) nextErrors.customerName = "Customer Name is required.";
    if (!invoice.lines[0]?.itemID) nextErrors.itemID = "Item is required.";
    if (invoice.lines[0]?.quantity === undefined || invoice.lines[0]?.quantity === null) nextErrors.quantity = "Quantity is required.";
    if (invoice.lines[0]?.rate === undefined || invoice.lines[0]?.rate === null) nextErrors.rate = "Rate is required.";
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateInvoice({ invoiceID: invoice.invoiceID, updatedOn: invoice.updatedOn, invoiceNo: invoice.invoiceNo, invoiceDate: invoice.invoiceDate, customerName: invoice.customerName, address: invoice.address, city: invoice.city, taxPercentage: invoice.taxPercentage, notes: invoice.notes, lines: invoice.lines }, token);
      setSuccess("Invoice updated successfully.");
      window.setTimeout(() => router.push("/invoices"), 800);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update invoice.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell title="Invoices">
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
          <Paper variant="outlined" sx={{ p: 5, borderRadius: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Paper>
        </Box>
      </AppShell>
    );
  }

  if (!invoice) {
    return (
      <AppShell title="Invoices">
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
          <Alert severity="error">{error || "Invoice not found."}</Alert>
        </Box>
      </AppShell>
    );
  }

  return (
    <AppShell title="Invoices">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/invoices")} sx={{ textTransform: "none", mb: 2 }}>
          Back to Invoices
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Edit Invoice</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Update invoice details.</Typography>
        <InvoiceForm invoiceNo={invoice.invoiceNo} invoiceDate={invoice.invoiceDate.slice(0, 10)} customerName={invoice.customerName} address={invoice.address ?? ""} city={invoice.city ?? ""} taxPercentage={invoice.taxPercentage} notes={invoice.notes ?? ""} itemID={invoice.lines[0]?.itemID ?? ""} description={invoice.lines[0]?.description ?? ""} quantity={invoice.lines[0]?.quantity ?? ""} rate={invoice.lines[0]?.rate ?? ""} discountPct={invoice.lines[0]?.discountPct ?? ""} items={items} itemsLoading={itemsLoading} itemsError={itemsError} fieldErrors={fieldErrors} error={error} success={success} saving={saving} submitLabel="Save Changes" onChange={(field: InvoiceFormField, value) => { const currentLine = invoice.lines[0] ?? { rowNo: 1, itemID: 0, description: "", quantity: 0, rate: 0, discountPct: 0 }; const nextLine = field === "itemID" ? { ...currentLine, itemID: Number(value) } : field === "description" ? { ...currentLine, description: value } : field === "quantity" ? { ...currentLine, quantity: Number(value) } : field === "rate" ? { ...currentLine, rate: Number(value) } : field === "discountPct" ? { ...currentLine, discountPct: Number(value) } : currentLine; const invoiceFields = ["invoiceNo", "invoiceDate", "customerName", "address", "city", "taxPercentage", "notes"].includes(field); setInvoice(invoiceFields ? { ...invoice, ...(field === "invoiceNo" ? { invoiceNo: Number(value) } : field === "invoiceDate" ? { invoiceDate: value } : field === "customerName" ? { customerName: value } : field === "address" ? { address: value || null } : field === "city" ? { city: value || null } : field === "taxPercentage" ? { taxPercentage: Number(value) } : { notes: value || null }) } : { ...invoice, lines: [nextLine, ...invoice.lines.slice(1)] }); setFieldErrors((current) => ({ ...current, [field]: "" })); }} onCancel={() => router.push("/invoices")} onSubmit={handleSubmit} />
      </Box>
    </AppShell>
  );
}
