import BaseEnum from './BaseEnum';

export default class extends BaseEnum {
  override nameMap = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed'
  };
}
