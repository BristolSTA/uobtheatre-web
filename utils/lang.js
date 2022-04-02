export function oneLiner(text) {
  return text
    .replace(/(<([^>]+)>)/gi, '')
    .replace(/([!.?])([A-Z])/g, '$1 $2')
    .replace(/(\.|([^.]))\r?\n/g, '$2. ')
}
