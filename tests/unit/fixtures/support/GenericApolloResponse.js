export default (queryRootName, data) => {
  const returnObj = {
    data: {}
  }
  returnObj.data[queryRootName] = data
  return returnObj
}
