import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from '@/components/auth-provider';
import { auth, getCurrentUser } from '@/lib/auth';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: {
        template: `%s | Saman360`,
        default: APP_NAME,
    },
    description: APP_DESCRIPTION,
    metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({ children }) {
    const authInstance = auth();
    const currentUserDetailsPromise = getCurrentUser();

    return (
        <html lang='en' suppressHydrationWarning>
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider
                    attribute='class'
                    defaultTheme='light'
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider
                        currentUser={currentUserDetailsPromise}
                        auth={authInstance}
                    >
                        {children}
                        <Toaster richColors />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
