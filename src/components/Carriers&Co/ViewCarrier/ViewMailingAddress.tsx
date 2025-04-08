import { FC } from "react";
import { Carrier } from "../../../styles/types/CarrierTypes";

interface ViewMailingAddressProps {
  formCarrier: Carrier;
}

const ViewMailingAddress: FC<ViewMailingAddressProps> = ({ formCarrier }) => {
  return (
    <fieldset>
      <legend>Mailing Address</legend>
      <hr />
      <div className="form-group">
        <label
          style={{ display: "inline-flex", alignItems: "center", width: "100%" }}
          htmlFor="mailingAddressSame"
        >
          Same as Primary Address
        </label>
        <span>{formCarrier.sameAsPrimary ? "Yes" : "No"}</span>
      </div>

      {/* Only show the mailing address form if sameAsPrimary is false */}
      {!formCarrier.sameAsPrimary && (
        <>
          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressStreet">Street</label>
              <span>{formCarrier.mailing_address || "N/A"}</span>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressCity">City</label>
              <span>{formCarrier.mailing_city || "N/A"}</span>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressState">State</label>
              <span>{formCarrier.mailing_state || "N/A"}</span>
            </div>
          </div>

          <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressCountry">Country</label>
              <span>{formCarrier.mailing_country || "N/A"}</span>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressPostalCode">Postal Code</label>
              <span>{formCarrier.mailing_postal || "N/A"}</span>
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="mailingAddressUnitNo">Phone</label>
              <span>{formCarrier.mailing_phone || "N/A"}</span>
            </div>
          </div>
        </>
      )}
    </fieldset>
  );
};

export default ViewMailingAddress;
