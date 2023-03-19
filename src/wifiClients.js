import { Component } from "react";
import { Link } from "react-router-dom";
import { Info, Loading } from "./other";
import { getWifiClients } from "./api";
import { formatDuration } from "./utils";

import "./styles/wifiClients.scss";

export default class WifiClients extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, wifiClients: null };
    }

    componentDidMount() {

        this.setState({ requesting: true, info: null });
        getWifiClients().then((wifiClients) => {
            this.setState({ requesting: false, wifiClients });
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

            <div className="boxes">{this.state.wifiClients ? <>

                <div className="box">
                    <div>Nombre d'appareils connectés : {this.state.wifiClients.length}</div>
                </div>

                <div className="clients">
                    {this.state.wifiClients.map((wifiClient, index) => <div className="box" key={index}>
                        <div>Adresse MAC :</div>
                        <div className="value">{wifiClient.mac}</div>
                        <div>Connecté pendant :</div>
                        <div className="value">{formatDuration(wifiClient.connectedDuration)}</div>
                        <div>Utilisation du réseau :</div>
                        <div className="value">{formatBandwidthUsage(wifiClient)}</div>
                        <div className="buttons">
                            <Link to={"/devices/" + wifiClient.mac} className="button">Voir l'appareil</Link>
                        </div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
