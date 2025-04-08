import { FC } from 'react';
import { Quote } from '../../../styles/types/QuoteTypes';

interface ViewQuoteGeneralProps {
  formQuote: Quote;
}

const ViewQuoteGeneral: FC<ViewQuoteGeneralProps> = ({ formQuote }) => {
  return (
    <fieldset className="form-section">
      <legend>General</legend>
      <hr />
      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quoteType">Quote Type</label>
          <div>{formQuote.quote_type || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="quote_customer">Customer</label>
          <div>{formQuote.quote_customer || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="customerRefNo">Customer Ref. No</label>
          <div>{formQuote.quote_cust_ref_no || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="accNo">Booked By</label>
          <div>{formQuote.quote_booked_by || 'N/A'}</div>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="branch">Temperature</label>
          <div>{formQuote.quote_temperature || 'N/A'}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="Hot" style={{ display: 'block' }}>
            Hot
          </label>
          <span>{formQuote.quote_hot ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="Team" style={{ display: 'block' }}>
            Team
          </label>
          <span>{formQuote.quote_team ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="Air Ride" style={{ display: 'block' }}>
            Air Ride
          </label>
          <span>{formQuote.quote_air_ride ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="TARP" style={{ display: 'block' }}>
            TARP
          </label>
          <span>{formQuote.quote_tarp ? 'Yes' : 'No'}</span>
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="Hazmat" style={{ display: 'block' }}>
            Hazmat
          </label>
          <span>{formQuote.quote_hazmat ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewQuoteGeneral;
