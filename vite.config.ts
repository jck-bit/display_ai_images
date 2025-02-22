import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  //ignore vite build error
  server: {
    //build command will not fail if there are errors
    //in the code
    //if set to true, the build will fail if there are errors
    //in the code
    hmr: {
      overlay: false
    }
}

})
