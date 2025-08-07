import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";
export default function Nav() {
    return (
        <section id="section"
                 className="bg-gradient-to-b px-3 sm:px-10 min-h-screen overflow-visible from-[#F5F7FF] via-[#fffbee] to-[#E6EFFF] pt-6 h-full">
            <header
                className="flex items-center justify-between px-6 py-3 md:py-4 shadow-sm max-w-5xl rounded-full mx-auto w-full bg-white">
                <a href="/">
                    <img className="h-[70px] w-auto object-contain"
                         src="../public/logo_ideal.png"/>
                </a>
                <nav id="menu"
                     className="max-md:absolute max-md:top-0 max-md:left-0 max-md:overflow-hidden items-center justify-center max-md:h-full max-md:w-0 transition-[width] bg-white/50 backdrop-blur flex-col md:flex-row flex gap-8 text-gray-900 text-sm font-normal">
                    <a className="hover:text-indigo-600" href="/info">
                        Chi Siamo
                    </a>
                    <a className="hover:text-indigo-600" href="/portfolio">
                        Portfolio
                    </a>
                    <a className="hover:text-indigo-600" href="/servizi">
                        Servizi
                    </a>
                    <a className="hover:text-indigo-600" href="/contatti">
                        Contatti
                    </a>
                    <button id="closeMenu" className="md:hidden text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                             viewBox="0 0 24 24"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </nav>
                <div className="flex items-center space-x-4">

                    <a className="hidden md:flex bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition"
                       href="#">
                        PREVENTIVO
                    </a>
                    <button id="openMenu" className="md:hidden text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
                             viewBox="0 0 24 24"
                             stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    </button>
                </div>
            </header>

            <main>
                <Outlet />
            </main>
            <Footer />
        </section>
    )
}