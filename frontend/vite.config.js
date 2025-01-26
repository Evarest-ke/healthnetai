import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@fullcalendar/core/index.js': '@fullcalendar/core',
      '@fullcalendar/core/internal.js': '@fullcalendar/core/internal',
      '@fullcalendar/core/preact.js': '@fullcalendar/core/preact',
    },
  },
  optimizeDeps: {
    include: [
      '@fullcalendar/core',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction',
      '@fullcalendar/react'
    ]
  }
}); 