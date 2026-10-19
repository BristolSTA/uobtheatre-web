import { RuleTester } from 'eslint';
import parser from 'vue-eslint-parser';

import rule from './no-unmasked-sensitive-text.mjs';

const ruleTester = new RuleTester({
  languageOptions: {
    parser
  }
});

const validTemplate = (code) => ({ code, filename: 'test.vue' });

ruleTester.run('no-unmasked-sensitive-text', rule, {
  valid: [
    validTemplate(
      '<template><SensitiveText>{{ user.firstName }}</SensitiveText></template>'
    ),
    validTemplate(
      '<template><sensitive-text>{{ user.email }}</sensitive-text></template>'
    ),
    validTemplate(
      '<template><input v-model="email" type="email" /></template>'
    ),
    validTemplate('<template><p>{{ production.name }}</p></template>')
  ],
  invalid: [
    {
      code: '<template><p>{{ user.firstName }}</p></template>',
      filename: 'test.vue',
      errors: [{ messageId: 'unmasked' }]
    },
    {
      code: '<template><p>{{ booking.creator.email }}</p></template>',
      filename: 'test.vue',
      errors: [{ messageId: 'unmasked' }]
    },
    {
      code: '<template><p>{{ email }}</p></template>',
      filename: 'test.vue',
      errors: [{ messageId: 'unmasked' }]
    },
    {
      code: '<template><p>{{ user["lastName"] }}</p></template>',
      filename: 'test.vue',
      errors: [{ messageId: 'unmasked' }]
    }
  ]
});
