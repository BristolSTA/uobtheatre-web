export function edit(production) {
  return (
    production.permissions.includes('change_production') ||
    production.permissions.includes('edit_production')
  )
}
