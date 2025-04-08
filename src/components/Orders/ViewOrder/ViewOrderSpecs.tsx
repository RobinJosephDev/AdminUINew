import React from 'react';
import { Order } from '../../../styles/types/OrderTypes';

interface ViewOrderSpecsProps {
  formOrder: Order;
}

const ViewOrderSpecs: React.FC<ViewOrderSpecsProps> = ({ formOrder }) => {
  return (
    <fieldset className="form-section">
      <legend>Load Specifications</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="hot" style={{ display: 'block' }}>
            Hot
          </label>
          <span>{formOrder.hot ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="team" style={{ display: 'block' }}>
            Team
          </label>
          <span>{formOrder.team ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="air_ride" style={{ display: 'block' }}>
            Air ride
          </label>
          <span>{formOrder.air_ride ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="tarp" style={{ display: 'block' }}>
            TARP
          </label>
          <span>{formOrder.tarp ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="hazmat" style={{ display: 'block' }}>
            Hazmat
          </label>
          <span>{formOrder.hazmat ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewOrderSpecs;
