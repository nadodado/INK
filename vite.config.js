import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        gallery: 'gallery.html',
        artists: 'artists.html',
        blog: 'blog.html',
        'blog-post': 'blog-post.html',
        booking: 'booking.html',
        admin: 'admin.html'
      }
    }
  },
  publicDir: 'content'
});