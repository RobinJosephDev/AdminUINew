import { Customer, FileData } from '../../../styles/types/CustomerTypes';

interface ViewCustomerCreditProps {
  formCustomer: Customer;
}

const ViewCustomerCredit: React.FC<ViewCustomerCreditProps> = ({ formCustomer }) => {
  // Render download link if file URL exists
  const renderDownloadLink = (fileData?: FileData | string, fileLabel?: string) => {
    if (fileData) {
      let fileObject: FileData;

      if (typeof fileData === 'string') {
        try {
          // Check if it's a valid JSON before parsing
          fileObject = JSON.parse(fileData);
        } catch (error) {
          // If parsing fails, assume it's a direct URL
          return (
            <div>
              <a href={fileData} target="_blank" rel="noopener noreferrer">
                Download {fileLabel}
              </a>
            </div>
          );
        }
      } else {
        fileObject = fileData;
      }

      if (fileObject?.url) {
        return (
          <div>
            <a href={fileObject.url} target="_blank" rel="noopener noreferrer">
              Download {fileLabel}: {fileObject.name}
            </a>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <fieldset>
      <legend>Customer Credit</legend>
      <hr />

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Credit Status</label>
          <div>{formCustomer.cust_credit_status || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Mode of Payment</label>
          <div>{formCustomer.cust_credit_mop || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Currency</label>
          <div>{formCustomer.cust_credit_currency || 'N/A'}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Approval Date</label>
          <div>{formCustomer.cust_credit_appd || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Expiry Date</label>
          <div>{formCustomer.cust_credit_expd || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Terms (Days)</label>
          <div>{formCustomer.cust_credit_terms || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Limit</label>
          <div>{formCustomer.cust_credit_limit || 'N/A'}</div>
        </div>
      </div>

      <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Credit Application</label>
          <div>{formCustomer.cust_credit_application ? 'Yes' : 'No'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Credit Agreement</label>

          {renderDownloadLink(formCustomer.cust_credit_agreement, 'Credit Agreement')}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Shipper Broker Agreement</label>

          {renderDownloadLink(formCustomer.cust_sbk_agreement, 'Shipper Broker Agreement')}
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Notes</label>
          <div>{formCustomer.cust_credit_notes || 'N/A'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCustomerCredit;
