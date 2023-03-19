import { Component } from "react";
import { Link } from "react-router-dom";
import { Info, Loading } from "./other";
import { getDhcpLeases } from "./api";
import { formatDuration } from "./utils";

import "./styles/dhcpLeases.scss";

export default class DhcpLeases extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, dhcpLeases: null };
    }

    componentDidMount() {

        this.setState({ requesting: true });
        getDhcpLeases().then((dhcpLeases) => {
            this.setState({ requesting: false, dhcpLeases });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {

        document.title = "Baux DHCP | Raspberry Pi Hotspot";

        return <div className="dhcp-leases">

            <div className="title">Baux DHCP</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="boxes">{this.state.dhcpLeases ? <>

                <div className="box">
                    <div>Nombre de baux DHCP : {this.state.dhcpLeases.length}</div>
                </div>

                <div className="leases">
                    {this.state.dhcpLeases.map((dhcpLease, index) => <div className="box" key={index}>
                        <div>Nom :</div>
                        <div className="value">{dhcpLease.hostname ? dhcpLease.hostname : "Inconnu"}</div>
                        <div>Adresse IP :</div>
                        <div className="value">{dhcpLease.ip}</div>
                        <div>Adresse MAC :</div>
                        <div className="value">{dhcpLease.mac}</div>
                        <div>Expiration du bail DHCP dans :</div>
                        <div className="value">{formatDuration(dhcpLease.expirationDate - Date.now())}</div>
                        <div className="buttons">
                            <Link to={"/devices/" + dhcpLease.mac} className="button">Voir l'appareil</Link>
                        </div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
