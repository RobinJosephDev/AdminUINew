import React from 'react';

interface Shipment {
  ship_load_date: string;
  ship_pickup_location: string;
  ship_delivery_location: string;
  ship_driver: string;
  ship_weight: string;
  ship_ftl_ltl: string;
  ship_tarp: boolean;
  ship_equipment: string;
  ship_price: string;
  ship_notes: string;
}

interface ShipmentDetailsProps {
  shipment: Shipment;
  setShipment: (shipment: Shipment) => void;
}

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment, setShipment }) => {
  return (
    <fieldset className="form-section">
      <legend>Shipment Details</legend>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="shipLoadDate">Load Date*</label>
          <input
            type="date"
            value={shipment.ship_load_date}
            onChange={(e) => setShipment({ ...shipment, ship_load_date: e.target.value })}
            id="shipLoadDate"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipPickupLocation">Pickup Location</label>
          <input
            type="text"
            value={shipment.ship_pickup_location}
            onChange={(e) => setShipment({ ...shipment, ship_pickup_location: e.target.value })}
            id="shipPickupLocation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipDeliveryLocation">Delivery Location</label>
          <input
            type="text"
            value={shipment.ship_delivery_location}
            onChange={(e) => setShipment({ ...shipment, ship_delivery_location: e.target.value })}
            id="shipDeliveryLocation"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipDriver">Driver</label>
          <input
            type="text"
            value={shipment.ship_driver}
            onChange={(e) => setShipment({ ...shipment, ship_driver: e.target.value })}
            id="shipDriver"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipWeight">Weight</label>
          <input
            type="number"
            value={shipment.ship_weight}
            onChange={(e) => setShipment({ ...shipment, ship_weight: e.target.value })}
            id="shipWeight"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipFtlLtl">FTL/LTL</label>
          <select
            value={shipment.ship_ftl_ltl}
            onChange={(e) => setShipment({ ...shipment, ship_ftl_ltl: e.target.value })}
            id="shipFtlLtl"
          >
            <option value="">Select</option>
            <option value="FTL">Full Truckload (FTL)</option>
            <option value="LTL">Less Than Truckload (LTL)</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="shipTarp">Tarp</label>
          <input
            type="checkbox"
            checked={shipment.ship_tarp}
            onChange={(e) => setShipment({ ...shipment, ship_tarp: e.target.checked })}
            id="shipTarp"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipEquipment">Equipment</label>
          <input
            type="text"
            value={shipment.ship_equipment}
            onChange={(e) => setShipment({ ...shipment, ship_equipment: e.target.value })}
            id="shipEquipment"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipPrice">Price</label>
          <input
            type="number"
            value={shipment.ship_price}
            onChange={(e) => setShipment({ ...shipment, ship_price: e.target.value })}
            id="shipPrice"
          />
        </div>
        <div className="form-group">
          <label htmlFor="shipNotes">Notes</label>
          <textarea
            value={shipment.ship_notes}
            onChange={(e) => setShipment({ ...shipment, ship_notes: e.target.value })}
            id="shipNotes"
          ></textarea>
        </div>
      </div>
    </fieldset>
  );
};

export default ShipmentDetails;