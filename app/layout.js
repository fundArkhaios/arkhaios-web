export const metadata = {
  title: 'Arkhaios',
  description: 'Arkhaios',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
