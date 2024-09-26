import BaseEnum from './BaseEnum';

export default class extends BaseEnum {
  override nameMap = {
    CASH: 'Cash',
    CARD: 'Card',
    SQUARE_POS: 'Square Point of Sale',
    SQUARE_ONLINE: 'Square Online',
    MANUAL_CARD_REFUND: 'Manual Card Refund',
    SQUARE_REFUND: 'Square Refund'
  };
}
