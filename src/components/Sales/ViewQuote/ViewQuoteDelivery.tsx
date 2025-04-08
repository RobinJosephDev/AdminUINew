import { FC } from 'react';
import { Location } from '../../../styles/types/QuoteTypes';

interface ViewQuoteDeliveryProps {
  delivery: Location;
  index: number;
}

const ViewQuoteDelivery: FC<ViewQuoteDeliveryProps> = ({ delivery }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <div>{delivery.address || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{delivery.city || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{delivery.state || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{delivery.postal || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{delivery.country || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Date</label>
          <div>{delivery.date || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Time</label>
          <div>{delivery.time || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{delivery.currency || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <div>{delivery.equipment || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Pickup PO</label>
          <div>{delivery.pickup_po || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{delivery.phone || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Packages</label>
          <div>{delivery.packages || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Weight</label>
          <div>{delivery.weight || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Dimensions</label>
          <div>{delivery.dimensions || ''}</div>
        </div>
      </div>
      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <div>{delivery.notes || ''}</div>
      </div>
    </fieldset>
  );
};

export default ViewQuoteDelivery;
