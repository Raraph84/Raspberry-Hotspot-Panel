import { Component } from "react";
import { Info, Loading } from "./other";
import { getWifiClients } from "./api";
import { formatDuration } from "./utils";

import "./styles/wifiClients.scss";

export default class WifiClients extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, clients: null };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {

        this.setState({ requesting: true, info: null });
        getWifiClients().then((clients) => {
            this.setState({ requesting: false, clients });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {

        document.title = "Appareils connectés | Raspberry Pi Hotspot";

        const formatBandwidthUsage = (client) => {
            const total = Math.round((client.txBytes + client.rxBytes) / 1000000000 * 100) / 100;
            const download = Math.round(client.rxBytes / 1000000000 * 100) / 100;
            const upload = Math.round(client.txBytes / 1000000000 * 100) / 100;
            return total + " Go (" + download + " Go / " + upload + " Go)";
        }

        return <div className="wifi-clients">

            <div className="title">Appareils connectés</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="boxes">{this.state.clients ? <>

                <div className="box">
                    <div>Nombre d'appareils connectés : {this.state.clients.length}</div>
                    <div className="buttons">
                        <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                    </div>
                </div>

                <div className="clients">
                    {this.state.clients.map((client, index) => <div className="box" key={index}>
                        <div>Nom :</div>
                        <div className="value">{client.hostname ? client.hostname : "Inconnu"}</div>
                        <div>Adresse IP :</div>
                        <div className="value">{client.ip}</div>
                        <div>Adresse MAC :</div>
                        <div className="value">{client.mac}</div>
                        <div>Connecté pendant :</div>
                        <div className="value">{formatDuration(client.connectedDuration)}</div>
                        <div>Utilisation du réseau :</div>
                        <div className="value">{formatBandwidthUsage(client)}</div>
                        <div>Expiration du bail DHCP dans :</div>
                        <div className="value">{formatDuration(client.expirationDate - Date.now())}</div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
