"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Alert, Box, CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { getInvoices } from "@/services/invoices";
import { getItems } from "@/services/items";
import type { InvoiceListItem } from "@/types/invoice";

export default function DashboardContent() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const [invoiceData, itemData] = await Promise.all([getInvoices(token), getItems(token)]);
        setInvoices(invoiceData);
        setItemCount(itemData.length);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    void loadInvoices();
  }, []);

  const recentInvoices = [...invoices]
    .sort((first, second) => new Date(second.invoiceDate).getTime() - new Date(first.invoiceDate).getTime())
    .slice(0, 3);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Overview</Typography>
        <Typography color="text.secondary">Overview of your invoice activity.</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2, mb: 3 }}>
        {[{ label: "Total Invoices", value: String(invoices.length) }, { label: "Total Items", value: String(itemCount) }].map((card) => (
          <Paper key={card.label} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography color="text.secondary">{card.label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>{card.value}</Typography>
          </Paper>
        ))}
      </Box>

      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Invoices</Typography>
          <Link href="/invoices" style={{ textDecoration: "none" }}>
            <Typography color="primary" sx={{ fontSize: 14 }}>View all</Typography>
          </Link>
        </Stack>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress size={28} /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : recentInvoices.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <Typography color="text.secondary">No invoices found.</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table aria-label="Recent invoices">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
              </TableRow>
            </TableHead>
              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.invoiceID} hover>
                    <TableCell>{invoice.invoiceNo}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right">{invoice.invoiceAmount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
