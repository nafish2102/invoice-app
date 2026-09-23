"use client";

import Link from "next/link";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import type { InvoiceListItem } from "@/types/invoice";

type InvoiceTableProps = {
  invoices: InvoiceListItem[];
  deletingID: number | null;
  onPrint: (invoiceID: number) => void;
  onDelete: (invoiceID: number) => void;
};

export default function InvoiceTable({ invoices, deletingID, onPrint, onDelete }: InvoiceTableProps) {
  return (
    <TableContainer>
      <Table aria-label="Invoices">
        <TableHead>
          <TableRow sx={{ bgcolor: "grey.50" }}>
            <TableCell sx={{ fontWeight: 700 }}>Invoice #</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoiceID} hover>
              <TableCell>{invoice.invoiceNo}</TableCell>
              <TableCell>{invoice.customerName}</TableCell>
              <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
              <TableCell align="right">{invoice.invoiceAmount}</TableCell>
              <TableCell align="right">
                <Button component={Link} href={`/invoices/${invoice.invoiceID}`} size="small" startIcon={<EditOutlinedIcon />} sx={{ textTransform: "none" }}>Edit</Button>
                <Button size="small" onClick={() => onPrint(invoice.invoiceID)} startIcon={<PrintOutlinedIcon />} sx={{ textTransform: "none" }}>Print</Button>
                <Button size="small" color="error" disabled={deletingID === invoice.invoiceID} onClick={() => onDelete(invoice.invoiceID)} startIcon={<DeleteOutlinedIcon />} sx={{ textTransform: "none" }}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
