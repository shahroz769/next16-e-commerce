import Header from '@/components/shared/header';
import Footer from '@/components/footer';

export default function RootLayout({ children }) {
    return (
        <div className='flex flex-col h-screen'>
            <Header />
            <main className='flex-1 wrapper'>{children}</main>
            <Footer />
        </div>
    );
}
