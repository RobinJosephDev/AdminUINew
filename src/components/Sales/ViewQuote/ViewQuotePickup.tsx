import { FC } from 'react';
import { Location } from '../../../styles/types/QuoteTypes';

interface ViewQuotePickupProps {
  pickup: Location;
  index: number;
}

const ViewQuoteOrigin: FC<ViewQuotePickupProps> = ({ pickup }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <div>{pickup.address || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{pickup.city || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{pickup.state || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{pickup.postal || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{pickup.country || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Date</label>
          <div>{pickup.date || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Time</label>
          <div>{pickup.time || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{pickup.currency || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <div>{pickup.equipment || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Pickup PO</label>
          <div>{pickup.pickup_po || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{pickup.phone || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Packages</label>
          <div>{pickup.packages || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Weight</label>
          <div>{pickup.weight || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Dimensions</label>
          <div>{pickup.dimensions || ''}</div>
        </div>
      </div>
      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <div>{pickup.notes || ''}</div>
      </div>
    </fieldset>
  );
};

export default ViewQuoteOrigin;
