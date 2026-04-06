import { ToastContainer } from "react-toastify"
import Footer from "../components/Footer"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

export default function ManagementLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <Sidebar />
            </div>
            <div className="flex-grow p-0 md:overflow-y-auto md:p-0">
                <Navbar />
                {children}
                <Footer />
            </div>
        </div>
        <ToastContainer autoClose={1000} theme='dark' />
    </section>

}