import { Component } from "react";
import { Info, Loading } from "./other";
import { getDhcpLeases } from "./api";
import { formatDuration } from "./utils";

import "./styles/dhcpLeases.scss";

export default class DhcpLeases extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, leases: null };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {

        this.setState({ requesting: true, info: null });
        getDhcpLeases().then((leases) => {
            this.setState({ requesting: false, leases });
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

            <div className="boxes">{this.state.leases ? <>

                <div className="box">
                    <div>Nombre de baux DHCP : {this.state.leases.length}</div>
                    <div className="buttons">
                        <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                    </div>
                </div>

                <div className="leases">
                    {this.state.leases.map((lease, index) => <div className="box" key={index}>
                        <div>Nom :</div>
                        <div className="value">{lease.hostname ? lease.hostname : "Inconnu"}</div>
                        <div>Adresse IP :</div>
                        <div className="value">{lease.ip}</div>
                        <div>Adresse MAC :</div>
                        <div className="value">{lease.mac}</div>
                        <div>Expiration du bail DHCP dans :</div>
                        <div className="value">{formatDuration(lease.expirationDate - Date.now())}</div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
