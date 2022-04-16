import logo from './logo.svg';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home/index"
import Account from "./pages/Account/index"
import Donation from "./pages/Donation/index"
import Confirm from "./pages/Confirm/index"
import Dashboard from "./pages/Dashboard/index"

function App() {
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease', // default easing for AOS animations
        once: false
    });
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/account" element={<Account />} />
                    <Route exact path="/confirm" element={<Confirm />} />
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/onboarding" element={<Donation />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;