export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        secondary: '#7C3AED',
        accent: '#06B6D4',
        surface: '#ffffff',
        page: '#F3F6FB'
      },
      boxShadow: {
        soft: '0 20px 45px rgba(15, 23, 42, 0.08)',
        glow: '0 24px 80px rgba(79, 70, 229, 0.22)'
      }
    }
  },
  plugins: []
};
