import { FC } from "react";
import { Vendor } from "../../../styles/types/VendorTypes";

interface ViewVendorMailingAddressProps {
  formVendor: Vendor;
}

const ViewVendorMailingAddress: FC<ViewVendorMailingAddressProps> = ({ formVendor }) => {
  return (
    <fieldset>
      <legend>Mailing Address</legend>
      <hr />
      {!formVendor.sameAsPrimary && (
        <>
          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Street</label>
              <p>{formVendor.mailing_address || "N/A"}</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>City</label>
              <p>{formVendor.mailing_city || "N/A"}</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>State</label>
              <p>{formVendor.mailing_state || "N/A"}</p>
            </div>
          </div>

          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Country</label>
              <p>{formVendor.mailing_country || "N/A"}</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Postal Code</label>
              <p>{formVendor.mailing_postal || "N/A"}</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Phone</label>
              <p>{formVendor.mailing_phone || "N/A"}</p>
            </div>
          </div>

          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Fax</label>
              <p>{formVendor.mailing_fax || "N/A"}</p>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label>Email</label>
              <p>{formVendor.mailing_email || "N/A"}</p>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default ViewVendorMailingAddress;
