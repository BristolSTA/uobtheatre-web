export function oneLiner(text) {
  return text
    .replaceAll(/(<([^>]+)>)/gi, '')
    .replaceAll(/([!.?])([A-Z])/g, '$1 $2')
    .replaceAll(/(\.|([^.]))\r?\n/g, '$2. ')
}
