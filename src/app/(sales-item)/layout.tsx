import Header from "../components/Header"
import Footer from "../components/Footer"
import SalesSidebar from "../components/Sales-Sidebar"

export default function SalesDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SalesSidebar />
            </div>
            <div className="flex-grow p-0 md:overflow-y-auto md:p-0">
                <Header />
                {children}
                <Footer />
            </div>
        </div>

    </section>

}