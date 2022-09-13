import BaseEnum from './BaseEnum'

export default class extends BaseEnum {
  nameMap = {
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    FAILED: 'Failed',
  }
}
