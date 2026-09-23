"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { deleteInvoice, getInvoice, getInvoices } from "@/services/invoices";
import type { InvoiceDetail, InvoiceListItem } from "@/types/invoice";
import AppShell from "@/components/layout/AppShell";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoicePrintDialog from "@/components/invoices/InvoicePrintDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingID, setDeletingID] = useState<number | null>(null);
  const [confirmDeleteID, setConfirmDeleteID] = useState<number | null>(null);
  const [printInvoice, setPrintInvoice] = useState<InvoiceDetail | null>(null);
  const [printLoading, setPrintLoading] = useState(false);
  const [printError, setPrintError] = useState("");
  const [success, setSuccess] = useState("");

  const loadInvoices = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      return;
    }

    try {
      setError("");
      setInvoices(await getInvoices(token));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load invoices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadInvoices);
  }, []);

  const handleDelete = async () => {
    if (confirmDeleteID === null) return;
    const invoiceID = confirmDeleteID;
    setConfirmDeleteID(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setDeletingID(invoiceID);
    try {
      await deleteInvoice(invoiceID, token);
      await loadInvoices();
      setSuccess("Invoice deleted successfully.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete invoice.");
    } finally {
      setDeletingID(null);
    }
  };

  const handlePrint = async (invoiceID: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setPrintLoading(true);
    setPrintError("");
    try {
      setPrintInvoice(await getInvoice(invoiceID, token));
    } catch (loadError) {
      setPrintError(loadError instanceof Error ? loadError.message : "Unable to load invoice.");
    } finally {
      setPrintLoading(false);
    }
  };

  return (
    <AppShell title="Invoices">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>Invoices</Typography>
            <Typography color="text.secondary">Manage your invoices.</Typography>
          </Box>
          <Button component={Link} href="/invoices/create" variant="contained" startIcon={<AddIcon />} sx={{ textTransform: "none" }}>Create Invoice</Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress size={28} /></Box>
          ) : invoices.length === 0 ? (
            <Box sx={{ p: 5, textAlign: "center" }}><Typography color="text.secondary">No invoices found.</Typography></Box>
          ) : (
            <InvoiceTable invoices={invoices} deletingID={deletingID} onPrint={(invoiceID) => void handlePrint(invoiceID)} onDelete={setConfirmDeleteID} />
          )}
        </Paper>
      </Box>

      <InvoicePrintDialog invoice={printInvoice} loading={printLoading} error={printError} onClose={() => { setPrintInvoice(null); setPrintError(""); }} />
      <ConfirmDialog open={confirmDeleteID !== null} title="Are you sure you want to delete this invoice?" onCancel={() => setConfirmDeleteID(null)} onConfirm={() => void handleDelete()} />
      <Snackbar open={Boolean(success)} autoHideDuration={3000} onClose={() => setSuccess("")}>
        <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
      </Snackbar>
    </AppShell>
  );
}
