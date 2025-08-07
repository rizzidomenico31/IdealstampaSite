import Nav from "./components/Nav.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import {Routes , Route} from "react-router-dom";
import Info from "./components/Info.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
export default function App() {
    return (
        <>

            <Routes>
                <Route path="/" element={<Nav />} >
                    <Route index element={<Hero />} />
                    <Route path="/info" element={<Info />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/contatti" element={<Contact />} />
                    <Route path="/servizi" element={<Info />} />

                </Route>

            </Routes>
        </>
    )
}