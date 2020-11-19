let joinWithAnd = (array) => {
  return array.join(', ').replace(/, ([^,]*)$/, ' and $1');
};

export { joinWithAnd };
