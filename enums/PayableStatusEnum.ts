import BaseEnum from './BaseEnum';

export default class extends BaseEnum {
  override nameMap = {
    IN_PROGRESS: 'In Progress',
    CANCELLED: 'Cancelled',
    PAID: 'Paid'
  };
}
