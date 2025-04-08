import { FC } from 'react';
import { Location } from '../../../styles/types/OrderTypes';

interface ViewOrderDestinationProps {
  destination: Location;
  index: number;
}

const ViewOrderDestination: FC<ViewOrderDestinationProps> = ({ destination }) => {
  return (
    <fieldset className="form-section">
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Address</label>
          <div>{destination.address || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>City</label>
          <div>{destination.city || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>State</label>
          <div>{destination.state || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Postal Code</label>
          <div>{destination.postal || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Country</label>
          <div>{destination.country || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Date</label>
          <div>{destination.date || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Time</label>
          <div>{destination.time || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{destination.currency || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Equipment</label>
          <div>{destination.equipment || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Pickup PO</label>
          <div>{destination.pickup_po || ''}</div>
        </div>
      </div>
      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Phone</label>
          <div>{destination.phone || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Packages</label>
          <div>{destination.packages || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Weight</label>
          <div>{destination.weight || ''}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Dimensions</label>
          <div>{destination.dimensions || ''}</div>
        </div>
      </div>
      <div className="form-group" style={{ flex: 1 }}>
        <label>Notes</label>
        <div>{destination.notes || ''}</div>
      </div>
    </fieldset>
  );
};

export default ViewOrderDestination;
