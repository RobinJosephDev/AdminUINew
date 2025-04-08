import { FC } from "react";
import { Broker } from "../../../styles/types/BrokerTypes";

interface ViewBrokerDetailsProps {
  formBroker: Broker;
}

const ViewBrokerDetails: FC<ViewBrokerDetailsProps> = ({ formBroker }) => {
  return (
    <fieldset>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Name</label>
          <span>{formBroker?.broker_name || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Street</label>
          <span>{formBroker?.broker_address || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <span>{formBroker?.broker_city || "N/A"}</span>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <span>{formBroker?.broker_state || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <span>{formBroker?.broker_country || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <span>{formBroker?.broker_postal || "N/A"}</span>
        </div>
      </div>
      <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Email</label>
          <span>{formBroker?.broker_email || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <span>{formBroker?.broker_phone || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone Extension</label>
          <span>{formBroker?.broker_ext || "N/A"}</span>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Fax</label>
          <span>{formBroker?.broker_fax || "N/A"}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewBrokerDetails;
