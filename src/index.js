import { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import { NotFound } from "./other";

import "./styles/common.scss";

class Website extends Component {

    render() {

        if (!localStorage.token)
            return <div className="content"><Login /></div>;

        return <BrowserRouter>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>;
    }
}

createRoot(document.getElementById("root")).render(<Website />);
