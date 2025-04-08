import { useEffect, useState } from 'react';
import ViewQuoteGeneral from './ViewQuoteGeneral';
import ViewQuoteDelivery from './ViewQuoteDelivery';
import ViewQuotePickup from './ViewQuotePickup';
import { Quote } from '../../../styles/types/QuoteTypes';

interface ViewQuoteFormProps {
  quote: Quote | null;
  onClose: () => void;
}

const ViewQuoteForm: React.FC<ViewQuoteFormProps> = ({ quote, onClose }) => {
  const [formQuote, setFormQuote] = useState<Quote>({
    id: 0,
    quote_type: '',
    quote_customer: '',
    quote_cust_ref_no: '',
    quote_booked_by: '',
    quote_temperature: '',
    quote_hot: false,
    quote_team: false,
    quote_air_ride: false,
    quote_tarp: false,
    quote_hazmat: false,
    quote_pickup: [],
    quote_delivery: [],
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    console.log('quote:', quote);
    console.log('quote_pickup:', quote?.quote_pickup);

    if (quote) {
      let parsedPickup = [];
      let parsedDelivery = [];

      if (Array.isArray(quote.quote_pickup)) {
        parsedPickup = quote.quote_pickup;
      } else if (typeof quote.quote_pickup === 'string') {
        try {
          parsedPickup = JSON.parse(quote.quote_pickup);
          if (!Array.isArray(parsedPickup)) {
            parsedPickup = [];
          }
        } catch (error) {
          console.error('Failed to parse quote_pickup:', error);
          parsedPickup = [];
        }
      }

      if (Array.isArray(quote.quote_delivery)) {
        parsedDelivery = quote.quote_delivery;
      } else if (typeof quote.quote_delivery === 'string') {
        try {
          parsedDelivery = JSON.parse(quote.quote_delivery);
          if (!Array.isArray(parsedDelivery)) {
            parsedDelivery = [];
          }
        } catch (error) {
          console.error('Failed to parse quote_delivery:', error);
          parsedDelivery = [];
        }
      }

      setFormQuote({
        ...quote,
        quote_pickup: parsedPickup,
        quote_delivery: parsedDelivery,
      });
    }
  }, [quote]);

  return (
    <div className="form-container">
      <form className="form-main">
        <ViewQuoteGeneral formQuote={formQuote} />
        <fieldset className="form-section">
          <legend>Pickup</legend>
          <hr />
          <div className="form-row">
            {formQuote.quote_pickup.map((pickup, index) => (
              <ViewQuotePickup key={index} pickup={pickup} index={index} />
            ))}
          </div>
        </fieldset>
        <fieldset className="form-section">
          <legend>Delivery</legend>
          <hr />
          <div className="form-row">
            {formQuote.quote_delivery.map((delivery, index) => (
              <ViewQuoteDelivery key={index} delivery={delivery} index={index} />
            ))}
          </div>
        </fieldset>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose} style={{ padding: '9px 15px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ViewQuoteForm;
