import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorDetailsProps {
  formVendor: Vendor;
}

const ViewVendorDetails: FC<ViewVendorDetailsProps> = ({ formVendor }) => {
  return (
    <fieldset className="form-section">
      <legend>Vendor Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Legal Name</label>
          <p>{formVendor.legal_name || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Remit Name</label>
          <p>{formVendor.remit_name || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Vendor Type</label>
          <p>{formVendor.vendor_type || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Service</label>
          <p>{formVendor.service || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>SCAC</label>
          <p>{formVendor.scac || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Docket#</label>
          <p>{formVendor.docket_number || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Vendor Code</label>
          <p>{formVendor.vendor_code || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>GST/HST#</label>
          <p>{formVendor.gst_hst_number || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>QST#</label>
          <p>{formVendor.qst_number || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>CA bond#</label>
          <p>{formVendor.ca_bond_number || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Website</label>
          <p>{formVendor.website || "N/A"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewVendorDetails;
