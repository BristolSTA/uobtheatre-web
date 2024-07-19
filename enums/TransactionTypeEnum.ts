import BaseEnum from './BaseEnum';

export default class extends BaseEnum {
  override nameMap = {
    PAYMENT: 'Payment',
    REFUND: 'Refund'
  };
}
