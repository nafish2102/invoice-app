"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { createItem } from "@/services/items";
import AppShell from "@/components/layout/AppShell";
import ItemForm from "@/components/items/ItemForm";

export default function CreateItemPage() {
  const router = useRouter();
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [salesRate, setSalesRate] = useState("");
  const [discountPct, setDiscountPct] = useState("0");
  const [itemNameError, setItemNameError] = useState("");
  const [salesRateError, setSalesRateError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setItemNameError("");
    setSalesRateError("");
    setDiscountError("");
    setApiError("");

    const rate = Number(salesRate);
    const discount = Number(discountPct || "0");
    let isValid = true;

    if (!itemName.trim()) {
      setItemNameError("Item Name is required.");
      isValid = false;
    }

    if (salesRate === "" || !Number.isFinite(rate) || rate < 0) {
      setSalesRateError("Sales Rate is required.");
      isValid = false;
    }

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setDiscountError("Discount must be between 0 and 100.");
      isValid = false;
    }

    if (!isValid) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setApiError("You are not authenticated.");
      return;
    }

    setSaving(true);

    try {
      await createItem(
        {
          itemName: itemName.trim(),
          description,
          salesRate: rate,
          discountPct: discount,
        },
        token,
      );
      setSuccess("Item created successfully.");
      window.setTimeout(() => router.push("/items"), 800);
    } catch (createError) {
      setApiError(
        createError instanceof Error ? createError.message : "Unable to create item.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Items">
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Add Item</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>Create a new item for your invoices.</Typography>

        <ItemForm itemName={itemName} description={description} salesRate={salesRate} discountPct={discountPct} itemNameError={itemNameError} salesRateError={salesRateError} discountError={discountError} error={apiError} success={success} saving={saving} submitLabel="Create Item" onItemNameChange={(value) => { setItemName(value); setItemNameError(""); }} onDescriptionChange={setDescription} onSalesRateChange={(value) => { setSalesRate(value); setSalesRateError(""); }} onDiscountChange={(value) => { setDiscountPct(value); setDiscountError(""); }} onCancel={() => router.push("/items")} onSubmit={handleSubmit} />
      </Box>
    </AppShell>
  );
}
