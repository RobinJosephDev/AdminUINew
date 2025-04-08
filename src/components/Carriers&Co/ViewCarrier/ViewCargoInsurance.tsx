import { FC } from "react";
import { Carrier } from "../../../styles/types/CarrierTypes";

interface ViewCargoInsuranceProps {
  formCarrier: Carrier;
}

const ViewCargoInsurance: FC<ViewCargoInsuranceProps> = ({ formCarrier }) => {
  // Render download link if file URL exists
  const renderDownloadLink = (fileUrl: string | null | undefined, fileLabel: string) => {
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
      <legend>Cargo Insurance Details</legend>
      <hr />
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Cargo Insurance Provider</label>
          <p>{formCarrier.ci_provider || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Policy Number</label>
          <p>{formCarrier.ci_policy_no || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Coverage Amount</label>
          <p>{formCarrier.ci_coverage || "N/A"}</p>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Start Date</label>
          <p>{formCarrier.ci_start_date || "N/A"}</p>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>End Date</label>
          <p>{formCarrier.ci_end_date || "N/A"}</p>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Certificate of Insurance</label>
          {renderDownloadLink(formCarrier.coi_cert, "Certificate of Insurance")}
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCargoInsurance;
