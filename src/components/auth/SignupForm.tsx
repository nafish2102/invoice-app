"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { AuthApiError, signupUser } from "@/services/auth";

const inputStyles = { "& .MuiOutlinedInput-root": { height: "30px", fontSize: "10px", borderRadius: "4px" }, "& .MuiOutlinedInput-input": { padding: "6px 9px" }, "& .MuiOutlinedInput-input::placeholder": { color: "#a7a8b8", opacity: 1 }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d8d8d8" }, "& .MuiFormHelperText-root": { marginLeft: 0 } };
const labelStyles = { display: "block", fontSize: "10px", color: "#444444", marginBottom: "6px" };

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ firstName: "", lastName: "", email: "", password: "", companyName: "", address: "", city: "", zipCode: "", industry: "", currencySymbol: "" });
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const setValue = (field: keyof typeof values, value: string) => setValues((current) => ({ ...current, [field]: value }));
  const passwordStrength = values.password.length >= 8 && /[A-Z]/.test(values.password) && /[a-z]/.test(values.password) && /\d/.test(values.password) && /[^A-Za-z0-9]/.test(values.password) ? "Strong" : values.password.length >= 6 && /[A-Za-z]/.test(values.password) && /\d/.test(values.password) ? "Medium" : "Weak";

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) { setCompanyLogo(null); setLogoName(""); return; }
    if (!["image/jpeg", "image/png"].includes(file.type)) { setErrors((current) => ({ ...current, logo: "Logo must be PNG or JPG." })); return; }
    if (file.size > 5 * 1024 * 1024) { setErrors((current) => ({ ...current, logo: "Logo size exceeds the 5 MB limit." })); return; }
    setCompanyLogo(file); setLogoName(file.name); setErrors((current) => ({ ...current, logo: "" }));
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!values.firstName.trim()) nextErrors.firstName = "First Name is required.";
    if (!values.email.trim()) nextErrors.email = "Email is required."; else if (!/\S+@\S+\.\S+/.test(values.email)) nextErrors.email = "Please enter a valid email.";
    if (!values.password) nextErrors.password = "Password is required."; else if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) nextErrors.password = "Password must be at least 8 characters and contain letters and digits.";
    if (!values.companyName.trim()) nextErrors.companyName = "Company Name is required.";
    if (!values.address.trim()) nextErrors.address = "Address is required.";
    if (!values.city.trim()) nextErrors.city = "City is required.";
    if (values.zipCode && !/^\d{5}$/.test(values.zipCode)) nextErrors.zipCode = "Zip Code must be exactly 5 digits.";
    if (!values.currencySymbol.trim()) nextErrors.currencySymbol = "Currency Symbol is required.";
    setErrors(nextErrors); setApiError(""); if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      await signupUser({ firstName: values.firstName, lastName: values.lastName, email: values.email, password: values.password, companyName: values.companyName, address: values.address, city: values.city, zip: values.zipCode, industry: values.industry, currencySymbol: values.currencySymbol, logo: companyLogo });
      localStorage.removeItem("token"); localStorage.removeItem("userID"); localStorage.removeItem("companyID"); document.cookie = "invoice_token=; path=/; max-age=0; SameSite=Lax"; router.push("/login");
    } catch (error) {
      if (error instanceof AuthApiError) { if (error.status === 409) setErrors((current) => ({ ...current, email: "Email already exists." })); else if (error.status === 415) setErrors((current) => ({ ...current, logo: "Logo must be PNG or JPG." })); else if (error.status === 413) setErrors((current) => ({ ...current, logo: "Logo size exceeds the 5 MB limit." })); else if (error.status === 400) setApiError(error.message || "Invalid signup information."); else setApiError("Could not sign up. Please try again."); } else setApiError("Could not sign up. Please try again.");
    } finally { setLoading(false); }
  };

  const field = (name: keyof typeof values, placeholder: string, type = "text") => <TextField fullWidth size="small" type={type} placeholder={placeholder} value={values[name]} onChange={(event) => setValue(name, event.target.value)} error={Boolean(errors[name])} helperText={errors[name] || ""} sx={inputStyles} />;
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f7f7f7", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px 16px" }}>
      <Box sx={{ width: "100%", maxWidth: "1016px", minHeight: "550px", backgroundColor: "#ffffff", border: "1px solid #cfd4da", borderRadius: "5px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Box sx={{ height: "54px", borderBottom: "1px solid #e5e5e5", display: "flex", alignItems: "center", justifyContent: "center" }}><Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}><ReceiptLongIcon sx={{ fontSize: 19, color: "#333333" }} /><Typography sx={{ fontSize: "14px", color: "#333333" }}>InvoiceApp</Typography></Box></Box>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: { xs: "25px 16px 30px", sm: "32px 16px 35px" } }}><Typography sx={{ fontSize: "22px", color: "#1f1f1f", marginBottom: "4px", textAlign: "center" }}>Create Your Account</Typography><Typography sx={{ fontSize: "13px", color: "#666666", marginBottom: "23px", textAlign: "center" }}>Set up your company and start invoicing in minutes.</Typography>
          <Box component="form" onSubmit={handleSignup} sx={{ width: "100%", maxWidth: "650px", border: "1px solid #e2e2e2", borderRadius: "6px", padding: { xs: "18px", sm: "20px" }, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: { xs: "28px", sm: "22px" } }}>
            <Box><Typography sx={{ fontSize: "13px", color: "#222222", paddingBottom: "11px", borderBottom: "1px solid #e5e5e5", marginBottom: "16px" }}>User Information</Typography><Typography component="label" sx={labelStyles}>First Name*</Typography>{field("firstName", "Enter first name")}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Last Name*</Typography>{field("lastName", "Enter last name")}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Email*</Typography>{field("email", "Enter your email", "email")}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Password*</Typography><TextField fullWidth size="small" type={showPassword ? "text" : "password"} placeholder="Enter password" value={values.password} onChange={(event) => setValue("password", event.target.value)} error={Boolean(errors.password)} helperText={errors.password} sx={inputStyles} slotProps={{ input: { endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword((current) => !current)}>{showPassword ? <VisibilityOffOutlinedIcon sx={{ fontSize: 16 }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />}</IconButton></InputAdornment> } }} /><Typography sx={{ marginTop: "5px", fontSize: "9px", color: "#777777" }}>Password strength: {passwordStrength}</Typography></Box>
            <Box><Typography sx={{ fontSize: "13px", color: "#222222", paddingBottom: "11px", borderBottom: "1px solid #e5e5e5", marginBottom: "16px" }}>Company Information</Typography><Typography component="label" sx={labelStyles}>Company Name*</Typography>{field("companyName", "Enter company name")}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Company Logo</Typography><Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}><Button component="label" variant="outlined" sx={{ minWidth: "45px", width: "45px", height: "46px", padding: 0, backgroundColor: "#eeeeee", borderColor: "#d6d6d6", borderStyle: "dashed", color: "#888888", borderRadius: "4px" }}><ImageOutlinedIcon sx={{ fontSize: 16 }} /><input hidden type="file" accept=".jpg,.jpeg,.png" onChange={handleLogoChange} /></Button><Typography sx={{ fontSize: "10px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{logoName || "No file chosen"}</Typography></Box>{errors.logo && <Typography sx={{ fontSize: "9px", color: "#d32f2f" }}>{errors.logo}</Typography>}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Address*</Typography><TextField fullWidth multiline rows={2} placeholder="Enter company address" value={values.address} onChange={(event) => setValue("address", event.target.value)} error={Boolean(errors.address)} helperText={errors.address} sx={{ ...inputStyles, "& .MuiOutlinedInput-root": { minHeight: "64px", alignItems: "flex-start", padding: "8px 9px" } }} /><Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "17px" }}><Box><Typography component="label" sx={labelStyles}>City*</Typography>{field("city", "Enter city")}</Box><Box><Typography component="label" sx={labelStyles}>Zip Code*</Typography>{field("zipCode", "6 digit zip code")}</Box></Box><Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Industry</Typography>{field("industry", "Industry type")}<Typography component="label" sx={{ ...labelStyles, marginTop: "17px" }}>Currency Symbol*</Typography>{field("currencySymbol", "$, ₹, €, AED")}</Box>
          </Box><Box sx={{ borderTop: "1px solid #e5e5e5", marginTop: "20px", paddingTop: "17px", display: "flex", justifyContent: "flex-end" }}>{apiError && <Typography sx={{ alignSelf: "center", marginRight: "12px", fontSize: "10px", color: "#d32f2f" }}>{apiError}</Typography>}<Button type="submit" variant="contained" disabled={loading} sx={{ minWidth: "87px", height: "34px", backgroundColor: "#5a5a5a", borderRadius: "5px", fontSize: "11px", fontWeight: 400, textTransform: "none", boxShadow: "none" }}>{loading ? "Signing Up..." : "Sign Up"}</Button></Box><Box sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}><Typography sx={{ fontSize: "10px", color: "#555555" }}>Already have an account? <Link href="/login" underline="hover">Login</Link></Typography></Box></Box>
        </Box><Box sx={{ minHeight: "67px", borderTop: "1px solid #e5e5e5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}><Typography sx={{ fontSize: "10px", color: "#777777" }}>© 2025 InvoiceApp. All rights reserved.</Typography><Box sx={{ display: "flex", gap: "18px" }}><Typography sx={{ fontSize: "10px", color: "#777777" }}>Privacy Policy</Typography><Typography sx={{ fontSize: "10px", color: "#777777" }}>Terms of Service</Typography><Typography sx={{ fontSize: "10px", color: "#777777" }}>Support</Typography></Box></Box>
      </Box>
    </Box>
  );
}
