export default `
success
errors {
... on NonFieldError {
    message
    code
}
... on FieldError {
    message
    field
    code
}
}
`;
