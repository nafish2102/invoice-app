"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AppShell from "@/components/layout/AppShell";
import { getItem, updateItem } from "@/services/items";
import type { ItemListItem } from "@/types/item";
import ItemForm from "@/components/items/ItemForm";

export default function EditItemPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ItemListItem | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ itemName?: string; salesRate?: string }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadItem = async () => {
      const token = localStorage.getItem("token");
      const itemID = Number(params.id);

      if (!token || !Number.isInteger(itemID)) {
        setError("Unable to load item.");
        setLoading(false);
        return;
      }

      try {
        setItem(await getItem(itemID, token));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load item.");
      } finally {
        setLoading(false);
      }
    };

    void loadItem();
  }, [params.id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!item) return;

    const nextErrors = { ...(!item.itemName.trim() ? { itemName: "Item Name is required." } : {}), ...(item.salesRate === null || item.salesRate === undefined || Number.isNaN(item.salesRate) ? { salesRate: "Sales Rate is required." } : {}) };
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You are not authenticated.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await updateItem({
        itemID: item.itemID,
        updatedOn: item.updatedOn,
        itemName: item.itemName.trim(),
        description: item.description ?? "",
        salesRate: item.salesRate,
        discountPct: item.discountPct,
      }, token);
      setSuccess("Item updated successfully.");
      window.setTimeout(() => router.push("/items"), 800);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to update item.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Items">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/items")} sx={{ textTransform: "none", mb: 2 }}>
          Back to Items
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Edit Item</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Update an item for your invoices.</Typography>

        {loading ? (
          <Paper variant="outlined" sx={{ p: 5, borderRadius: 2, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Paper>
        ) : !item ? (
          <Alert severity="error">{error || "Item not found."}</Alert>
        ) : (
          <ItemForm itemName={item.itemName} description={item.description ?? ""} salesRate={item.salesRate} discountPct={item.discountPct} fieldErrors={fieldErrors} error={error} success={success} saving={saving} submitLabel="Save Changes" onItemNameChange={(value) => { setItem({ ...item, itemName: value }); setFieldErrors((current) => ({ ...current, itemName: "" })); }} onDescriptionChange={(value) => setItem({ ...item, description: value })} onSalesRateChange={(value) => { setItem({ ...item, salesRate: Number(value) }); setFieldErrors((current) => ({ ...current, salesRate: "" })); }} onDiscountChange={(value) => setItem({ ...item, discountPct: Number(value) })} onCancel={() => router.push("/items")} onSubmit={handleSubmit} />
        )}
      </Box>
    </AppShell>
  );
}
