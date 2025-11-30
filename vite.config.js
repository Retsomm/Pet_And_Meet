import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Enable React Compiler via the babel option of @vitejs/plugin-react
// This integrates the compiler as a Babel plugin and allows incremental adoption.
export default defineConfig({
  plugins: [
    react({
      babel: {
        // Run the React Compiler as the first Babel plugin. Using the
        // tuple form makes it easy to pass options later if needed.
        plugins: [
          [
            'babel-plugin-react-compiler',
            {
              // React Compiler options can be added here if you want to
              // customize behavior (left empty for default behavior).
            },
          ],
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
    minify: 'esbuild'
  }
})