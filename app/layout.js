import '../styles/base.css';
import '../styles/layout.css';
import '../styles/components.css';
import '../styles/responsive.css';
import '../styles/homepage.css';
import '../styles/work.css';
import '../styles/journal-public.css';
import '../admin/admin.css';

export const metadata = {
  title: 'Shah Mahmud — Visual Artist & Art Director',
  description: 'Multidisciplinary Visual Artist, Art Director & Creative Strategist Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700;800&family=Noto+Serif+Bengali:wght@500;600;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="site-wrapper">
          {children}
        </div>
      </body>
    </html>
  );
}
