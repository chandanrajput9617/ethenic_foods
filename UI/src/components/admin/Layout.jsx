import { useAdminState } from "@contexts/AdminContext";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ Page }) => {
    const { activeMenu } = useAdminState();

    return (
        <div className="flex relative">
            {activeMenu ? (
                <div className="w-72 fixed sidebar bg-white shadow-lg border-r-2 border-gray-100 z-10">
                    <Sidebar />
                </div>
            ) : (
                <div className="w-0">
                    <Sidebar />
                </div>
            )}
            <div
                className={`bg-gray-100 w-full min-h-screen ${activeMenu ? "md:ml-72" : "flex-1"
                    }`}
            >
                <div className="fixed md:static bg-white navbar w-full shadow-sm">
                    <Navbar />
                </div>

                <div className="h-[calc(100%-90px)] p-8 mt-16 md:m-0">{Page}</div>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;
