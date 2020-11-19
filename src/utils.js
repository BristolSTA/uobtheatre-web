import { DateTime } from 'luxon';

let joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

let duration = (start, end) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);
  return end.diff(start);
};

let displayStartEnd = (start, end, format) => {
  start = DateTime.fromISO(start);
  end = DateTime.fromISO(end);

  let result = '';
  if (start.month != end.month || start.day != end.day) {
    result =
      start.toFormat(start.year == end.year ? format : format + ' y') + ' - ';
  }

  result += `${end.toFormat(format + ' y')}`;
  return result;
};

export { joinWithAnd, duration, displayStartEnd };
