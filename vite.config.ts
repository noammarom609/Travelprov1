import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: [
      'react',
      'react-dom',
      'react-router',
      '@supabase/supabase-js',
      'motion',
      'sonner',
      'react-hook-form',
      'recharts',
      'react-dnd',
      'react-dnd-html5-backend',
      'lucide-react',
    ],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router',
      '@supabase/supabase-js',
      'motion',
      'motion/react',
      'sonner',
      'react-hook-form',
      'recharts',
      'react-dnd',
      'react-dnd-html5-backend',
      'lucide-react',
    ],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})