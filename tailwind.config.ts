import type { Config } from 'tailwindcss';
import tailwindForms from '@tailwindcss/forms';

export default <Partial<Config>>{
  future: {
    removeDeprecatedGapUtilities: true
  },
  variants: {
    extend: {
      backgroundColor: ['checked', 'odd', 'even'],
      flexDirection: ['odd'],
      dropShadow: ['hover']
    }
  },
  plugins: [tailwindForms()]
};
