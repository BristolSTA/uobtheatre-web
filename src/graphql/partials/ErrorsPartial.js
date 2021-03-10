export default `
success
errors {
... on NonFieldError {
    message
}
... on FieldError {
    message
    field
}
}
`;
