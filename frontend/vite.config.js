import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     '/api': {
  //       // target: 'http://localhost:8000',
  //       target: 'https://panchayat-8mwo.onrender.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\//, '')
  //     }
  //   }
  // }
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()]
// });
