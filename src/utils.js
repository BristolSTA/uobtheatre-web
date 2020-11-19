import { DateTime } from 'luxon';

let joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

let duration = (start, end) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);
  return end.diff(start);
};

export { joinWithAnd, duration };
