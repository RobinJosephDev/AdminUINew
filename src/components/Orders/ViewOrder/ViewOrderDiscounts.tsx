import { FC } from 'react';
import { Charge } from '../../../styles/types/OrderTypes';

interface ViewOrderDiscountsProps {
  discount: Charge;
  index: number;
}

const ViewOrderDiscounts: FC<ViewOrderDiscountsProps> = ({ discount }) => {
  return (
    <div className="contact-form">
      <div className="form-group">
        <label>Type</label>
        <div>{discount.type || ''}</div>
      </div>
      <div className="form-group">
        <label>Charge</label>
        <div>{discount.charge || ''}</div>
      </div>
      <div className="form-group">
        <label>Percent/Flat Rate</label>
        <div>{discount.percent || ''}</div>
      </div>
    </div>
  );
};

export default ViewOrderDiscounts;
