import GenericNodeEdge from "./GenericNodeEdge";

export default (edges = [], pageInfoOverrides = {}) => {
  return {
    pageInfo: Object.assign(
      {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "4xnj10uTyFFz",
        endCursor: "8bqjJfmyCXR8",
      },
      pageInfoOverrides
    ),
    edges: edges.map((edge) => GenericNodeEdge(edge)),
  };
};
