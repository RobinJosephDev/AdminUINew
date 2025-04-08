import { FC } from "react";
import { Lane } from "../../../styles/types/CarrierTypes";

interface ViewCarrierLaneProps {
  lane: Lane;
  index: number;
}

const ViewCarrierLane: FC<ViewCarrierLaneProps> = ({ lane }) => {
  return (
    <fieldset className="form-section">
      <div className="contact-form">
        <div className="form-row" style={{ display: "flex", gap: "1rem" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>From</label>
            <span>{lane.from || "N/A"}</span>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>To</label>
            <span>{lane.to || "N/A"}</span>
          </div>

        </div>
      </div>
    </fieldset>
  );
};

export default ViewCarrierLane;
