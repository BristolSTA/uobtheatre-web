import BaseEnum from './BaseEnum'

export default class extends BaseEnum {
  nameMap = {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    APPROVED: 'Approved',
    PUBLISHED: 'Published',
    CLOSED: 'Closed',
    COMPLETED: 'Complete',
  }
}
