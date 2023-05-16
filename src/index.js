import { Component } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./login";
import Home from "./home";
import RegisteredDevices from "./registeredDevices";
import WifiClients from "./wifiClients";
import DhcpLeases from "./dhcpLeases";
import BannedDevices from "./bannedDevices";
import DnsQueries from "./dnsQueries";
import Device from "./device";
import { NotFound } from "./other";

import "./styles/common.scss";

class Panel extends Component {
    render() {

        if (!localStorage.token)
            return <div className="content"><Login /></div>;

        return <BrowserRouter>
            <div className="content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/registereddevices" element={<RegisteredDevices />} />
                    <Route path="/wificlients" element={<WifiClients />} />
                    <Route path="/dhcpleases" element={<DhcpLeases />} />
                    <Route path="/banneddevices" element={<BannedDevices />} />
                    <Route path="/devices/:mac" element={<Device />} />
                    <Route path="/dnsqueries" element={<DnsQueries />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </BrowserRouter>;
    }
}

createRoot(document.getElementById("root")).render(<Panel />);
