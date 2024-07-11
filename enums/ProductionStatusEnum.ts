import BaseEnum from './BaseEnum';

export default class extends BaseEnum {
  override nameMap = {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    PUBLISHED: 'Published',
    CLOSED: 'Closed',
    COMPLETE: 'Complete'
  };
}
