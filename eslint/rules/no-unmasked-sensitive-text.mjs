const sensitiveProperties = new Set([
  'firstName',
  'lastName',
  'fullName',
  'displayName',
  'email',
  'contactEmail'
]);

function isSensitiveMemberExpression(node) {
  if (node.type !== 'MemberExpression') return false;

  if (!node.computed && node.property.type === 'Identifier') {
    return sensitiveProperties.has(node.property.name);
  }

  return (
    node.computed &&
    node.property.type === 'Literal' &&
    typeof node.property.value === 'string' &&
    sensitiveProperties.has(node.property.value)
  );
}

function containsSensitiveValue(node) {
  if (!node || typeof node !== 'object') return false;
  if (isSensitiveMemberExpression(node)) return true;
  if (node.type === 'Identifier' && sensitiveProperties.has(node.name)) {
    return true;
  }

  return Object.entries(node).some(([key, value]) => {
    if (key === 'parent' || key === 'loc' || key === 'range') return false;

    if (Array.isArray(value)) {
      return value.some((child) => containsSensitiveValue(child));
    }

    return containsSensitiveValue(value);
  });
}

function hasSensitiveTextAncestor(node) {
  let ancestor = node.parent;

  while (ancestor) {
    if (
      ancestor.type === 'VElement' &&
      ['sensitivetext', 'sensitive-text'].includes(
        (ancestor.rawName || ancestor.name).toLowerCase()
      )
    ) {
      return true;
    }
    ancestor = ancestor.parent;
  }

  return false;
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require sensitive names and email addresses to be rendered inside SensitiveText'
    },
    schema: [],
    messages: {
      unmasked:
        'Sensitive names and email addresses must be rendered inside <SensitiveText>.'
    }
  },

  create(context) {
    function visitTemplate(node) {
      if (!node || typeof node !== 'object') return;

      if (
        node.type === 'VExpressionContainer' &&
        node.parent?.type === 'VElement' &&
        node.expression &&
        containsSensitiveValue(node.expression) &&
        !hasSensitiveTextAncestor(node)
      ) {
        context.report({
          node,
          messageId: 'unmasked'
        });
        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (['parent', 'loc', 'range', 'tokens', 'comments'].includes(key)) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach(visitTemplate);
        } else {
          visitTemplate(value);
        }
      });
    }

    return {
      'Program:exit'() {
        visitTemplate(context.sourceCode.ast.templateBody);
      }
    };
  }
};
