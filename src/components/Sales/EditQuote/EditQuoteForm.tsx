import EditQuoteGeneral from './EditQuoteGeneral';
import QuotePickup from '../QuotePickup';
import QuoteDelivery from '../QuoteDelivery';
import { PlusOutlined } from '@ant-design/icons';
import { Quote, Location } from '../../../styles/types/QuoteTypes';
import useEditQuote from '../../../hooks/edit/useEditQuote';

interface EditQuoteFormProps {
  quote: Quote | null;
  onClose: () => void;
  onUpdate: (order: Quote) => void;
}

const EditQuoteForm: React.FC<EditQuoteFormProps> = ({ quote, onClose, onUpdate }) => {
  const {
    formQuote,
    setFormQuote,
    updateQuote,
    handleAddPickup,
    handleRemovePickup,
    handlePickupChange,
    handleAddDelivery,
    handleRemoveDelivery,
    handleDeliveryChange,
  } = useEditQuote(quote, onClose, onUpdate);

  return (
    <div className="form-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateQuote();
        }}
        className="form-main"
      >
        {formQuote && (
          <>
            <EditQuoteGeneral formQuote={formQuote} setFormQuote={setFormQuote} />

            <fieldset className="form-section">
              <legend>Origin</legend>
              <hr />
              <div className="form-row">
                {formQuote.quote_pickup?.map((pickup, index) => (
                  <QuotePickup
                    quote={formQuote}
                    setQuote={setFormQuote}
                    key={index}
                    quote_pickup={formQuote.quote_pickup}
                    index={index}
                    onAddPickup={handleAddPickup}
                    handlePickupChange={handlePickupChange}
                    handleRemovePickup={handleRemovePickup}
                  />
                ))}
                {formQuote.quote_pickup.length === 0 && (
                  <button type="button" onClick={handleAddPickup} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>

            <fieldset className="form-section">
              <legend>Destination</legend>
              <hr />
              <div className="form-row">
                {formQuote.quote_delivery.map((delivery, index) => (
                  <QuoteDelivery
                    quote={formQuote}
                    setQuote={setFormQuote}
                    key={index}
                    quote_delivery={formQuote.quote_delivery}
                    index={index}
                    onAddDelivery={handleAddDelivery}
                    handleDeliveryChange={handleDeliveryChange}
                    handleRemoveDelivery={handleRemoveDelivery}
                  />
                ))}
                {formQuote.quote_delivery.length === 0 && (
                  <button type="button" onClick={handleAddDelivery} className="add-button">
                    <PlusOutlined />
                  </button>
                )}
              </div>
            </fieldset>
          </>
        )}
        <div className="form-actions">
          <button type="submit" className="btn-submit">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuoteForm;
