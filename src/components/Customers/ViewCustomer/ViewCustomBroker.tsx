import React from 'react';
import { Customer } from '../../../styles/types/CustomerTypes';

interface ViewCustomBrokerProps {
  formCustomer: Customer;
}

const ViewCustomBroker: React.FC<ViewCustomBrokerProps> = ({ formCustomer }) => {
  return (
    <fieldset>
      <legend>Custom Broker</legend>
      <hr />

      <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Broker</label>
          <div>{formCustomer.cust_broker_name || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Payment Notes</label>
          <div>{formCustomer.cust_bkp_notes || 'N/A'}</div>
        </div>

        <div className="form-group" style={{ flex: 1 }}>
          <label>Special Notes for Confirmation Doc</label>
          <div>{formCustomer.cust_bkspl_notes || 'N/A'}</div>
        </div>
      </div>
    </fieldset>
  );
};

export default ViewCustomBroker;
