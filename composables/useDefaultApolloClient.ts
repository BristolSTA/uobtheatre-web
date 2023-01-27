export default function () {
  const { resolveClient } = useApolloClient();
  return resolveClient();
}
