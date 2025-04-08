import { FC } from "react";
import { Carrier } from "../../../styles/types/CarrierTypes";

interface ViewCarrierDetailsProps {
  formCarrier: Carrier;
}

const ViewCarrierDetails: FC<ViewCarrierDetailsProps> = ({ formCarrier }) => {
  const carrierTypeOptions: string[] = [
    "US Authorization",
    "Air Freight",
    "Canadian",
    "Common",
    "Intermodal",
    "Local Cartage",
    "Mexican",
    "Ocean Freight",
    "Other",
  ];

  const ratingOptions: string[] = [
    "Unrated",
    "Preferred",
    "Excellent",
    "Good",
    "Poor",
    "Not Recommended",
    "Do not use",
    "Blank",
    "Probationary",
  ];

  // Render download link if file URL exists
  const renderDownloadLink = (fileUrl?: string, fileLabel?: string) => {
    if (fileUrl) {
      return (
        <div>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Download {fileLabel}
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <fieldset className="form-section">
      <legend>Carrier Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Carrier Type</label>
          <p>{formCarrier.carr_type || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Rating</label>
          <p>{formCarrier.rating || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Broker Carrier Agreement</label>
          {renderDownloadLink(formCarrier.brok_carr_aggmt, "Broker Carrier Agreement")}
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Docket Number</label>
          <p>{formCarrier.docket_no || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>DOT Number</label>
          <p>{formCarrier.dot_number || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>WCB Number</label>
          <p>{formCarrier.wcb_no || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>California Bond Number</label>
          <p>{formCarrier.ca_bond_no || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>US Bond Number</label>
          <p>{formCarrier.us_bond_no || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>SCAC</label>
          <p>{formCarrier.scac || "N/A"}</p>
        </div>
      </div>

      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>CSA Approved</label>
          <p>{formCarrier.csa_approved ? "Yes" : "No"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Hazmat</label>
          <p>{formCarrier.hazmat ? "Yes" : "No"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>SMS Code</label>
          <p>{formCarrier.smsc_code || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Approved</label>
          <p>{formCarrier.approved ? "Yes" : "No"}</p>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCarrierDetails;
