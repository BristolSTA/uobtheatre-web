export function oneLiner(text) {
  return text.replaceAll(/[.| |A-z]\r?\n/g, '. ')
}
