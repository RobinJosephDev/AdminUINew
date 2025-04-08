import { useState } from "react";
import { Carrier } from "../../../styles/types/CarrierTypes";
import { z } from "zod";
import DOMPurify from "dompurify";

interface EditCarrierDetailsProps {
  formCarrier: Carrier;
  setFormCarrier: React.Dispatch<React.SetStateAction<Carrier>>;
}

const carrierSchema = z.object({
  carr_type: z
    .string()
    .max(100, "Carrier Type must be at most 100 characters long")
    .regex(
      /^[a-zA-Z0-9\s.,'-]*$/,
      "Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed"
    )
    .optional(),
  rating: z
    .string()
    .max(100, "Rating must be at most 100 characters long")
    .regex(
      /^[a-zA-Z0-9\s.,'-]*$/,
      "Only letters, numbers,spaces, apostrophes, periods, commas, and hyphens allowed"
    )
    .optional(),
  docket_no: z
    .string()
    .max(50, "Docket# must be at most 50 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  dot_number: z
    .string()
    .max(10, "Dot number must be at most 10 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  wcb_no: z
    .string()
    .max(50, "WCB# must be at most 50 characters")
    .regex(/^\d*$/, "WCB# must be numeric")
    .optional(),
  ca_bond_no: z
    .string()
    .max(50, "CA Bond# must be at most 50 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  us_bond_no: z
    .string()
    .max(20, "US Bond# must be at most 20 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  scac: z
    .string()
    .max(10, "SCAC must be at most 10 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  smsc_code: z
    .string()
    .max(10, "SMSC code must be at most 10 characters long")
    .regex(/^[a-zA-Z0-9-]*$/, "Only letters, numbers, and dashes allowed")
    .optional(),
  csa_approved: z.boolean().optional(),
  hazmat: z.boolean().optional(),
  approved: z.boolean().optional(),
});

function EditCarrierDetails({
  formCarrier,
  setFormCarrier,
}: EditCarrierDetailsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<boolean>(false);
  const API_URL = process.env.API_BASE_URL;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const validateAndSetCarrier = (
    field: keyof Carrier,
    value: string | boolean
  ) => {
    let sanitizedValue: string | boolean =
      typeof value === "boolean" ? value : DOMPurify.sanitize(value);

    let error = "";
    const tempCarrier = { ...formCarrier, [field]: sanitizedValue };
    const result = carrierSchema.safeParse(tempCarrier);

    if (!result.success) {
      const fieldError = result.error.errors.find(
        (err) => err.path[0] === field
      );
      error = fieldError ? fieldError.message : "";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
    setFormCarrier(tempCarrier);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("brok_carr_aggmt", file);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data); // Debugging log

      // ✅ Fix the response handling
      if (data.files?.brok_carr_aggmt?.fileUrl) {
        // Ensure fileUrl is absolute
        const baseURL = API_URL.replace("/api", ""); // Get base URL from API
        const fullFileUrl = data.files.brok_carr_aggmt.fileUrl.startsWith(
          "http"
        )
          ? data.files.brok_carr_aggmt.fileUrl
          : `${baseURL}${data.files.brok_carr_aggmt.fileUrl}`;

        setFormCarrier((prevCarrier) => ({
          ...prevCarrier,
          brok_carr_aggmt: fullFileUrl, // Store full file URL
          brok_carr_aggmt_name: data.files.brok_carr_aggmt.fileName, // Store original filename
        }));
      } else {
        console.error("File URL not returned in response", data);
        alert("File upload failed: No file URL returned.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Network error during file upload.");
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    {
      key: "carr_type",
      label: "Carrier Type",
      placeholder: "Enter carrier type",
    },
    { key: "rating", label: "Rating", placeholder: "Enter Rating" },
    {
      key: "docket_no",
      label: "Docket Number",
      placeholder: "Enter docket number",
    },
    { key: "dot_number", label: "DOT Number", placeholder: "Enter DOT number" },
    { key: "wcb_no", label: "WCB Number", placeholder: "Enter WCB number" },
    {
      key: "ca_bond_no",
      label: "CA Bond Number",
      placeholder: "Enter CA bond number",
    },
    {
      key: "us_bond_no",
      label: "US Bond Number",
      placeholder: "Enter US bond number",
    },
    { key: "scac", label: "SCAC", placeholder: "Enter SCAC" },
    { key: "smsc_code", label: "SMSC Code", placeholder: "Enter SMSC code" },
    { key: "csa_approved", label: "CSA Approved", type: "boolean" },
    { key: "hazmat", label: "Hazmat", type: "boolean" },
    { key: "approved", label: "Approved", type: "boolean" },
  ];

  return (
    <fieldset className="form-section">
      <legend>Carrier Details</legend>
      <hr />
      <div
        className="form-grid"
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        }}
      >
        {fields.map(({ label, key, placeholder, type }) => (
          <div key={key}>
            {type === "boolean" ? (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  id={key}
                  checked={!!formCarrier[key as keyof Carrier]}
                  onChange={(e) => {
                    const value = e.target.checked;
                    setFormCarrier((prevCarrier) => ({
                      ...prevCarrier,
                      [key]: value,
                    }));
                  }}
                  style={{
                    transform: "scale(1.1)",
                    cursor: "pointer",
                    margin: 0,
                  }}
                />
                <label
                  htmlFor={key}
                  style={{ margin: 0, whiteSpace: "nowrap" }}
                >
                  {label}
                </label>
              </div>
            ) : (
              <div className="form-group" style={{ flex: "1 1 45%" }}>
                <label htmlFor={key}>{label}</label>
                <input
                  type="text"
                  id={key}
                  value={String(formCarrier[key as keyof Carrier] || "")}
                  onChange={(e) =>
                    validateAndSetCarrier(key as keyof Carrier, e.target.value)
                  }
                  placeholder={placeholder}
                />
              </div>
            )}
            {errors[key] && (
              <span className="error" style={{ color: "red" }}>
                {errors[key]}
              </span>
            )}
          </div>
        ))}
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="brokCarrAggmt">Broker Carrier Agreement</label>
          <input type="file" onChange={handleFileChange} />
          {typeof formCarrier.brok_carr_aggmt === "string" &&
            formCarrier.brok_carr_aggmt && (
              <div>
                <a
                  href={formCarrier.brok_carr_aggmt}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Broker Carrier Agreement
                </a>
              </div>
            )}

          {uploading && <p>Uploading...</p>}
        </div>
      </div>
    </fieldset>
  );
}

export default EditCarrierDetails;
