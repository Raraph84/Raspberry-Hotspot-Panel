import { Component } from "react";
import { Loading } from "./other";
import { formatDuration } from "./utils";
import { getSystemBandwidthUsage, getSystemStats, getWifiStatus, startWifi, stopWifi } from "./api";

import "./styles/home.scss";

export default class Home extends Component {

    constructor(props) {

        super(props);

        this.state = { systemStats: null, status: null, bandwidthUsage: null };
    }

    componentDidMount() {

        getSystemStats().then((systemStats) => {
            this.setState({ systemStats });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            }
        });

        getWifiStatus().then((status) => {
            this.setState({ status });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            }
        });

        getSystemBandwidthUsage().then((bandwidthUsage) => {
            this.setState({ bandwidthUsage });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            }
        });
    }

    render() {

        document.title = "Accueil | Raspberry Pi Hotspot";

        const toggleWifi = () => {
            this.setState({ status: null });
            if (!this.state.status)
                startWifi().then(() => this.setState({ status: true })).catch(() => this.setState({ status: false }));
            else
                stopWifi().then(() => this.setState({ status: false })).catch(() => this.setState({ status: true }));
        }

        const formatBandwidthUsage = (bandwidthUsage) => {
            const total = Math.round((bandwidthUsage.tx + bandwidthUsage.rx) / 1000000000 * 100) / 100;
            const download = Math.round(bandwidthUsage.rx / 1000000000 * 100) / 100;
            const upload = Math.round(bandwidthUsage.tx / 1000000000 * 100) / 100;
            return total + " Go (" + download + " Go / " + upload + " Go)";
        }

        return <div className="home">

            <div className="title">Accueil</div>

            <div className="lines">
                <div className="line">
                    <div className="box systemstats">
                        <div className="box-title">Informations système :</div>
                        <div>{!this.state.systemStats ? <Loading /> : <>
                            <div>Utilisation du processeur : {this.state.systemStats.cpuUsage}%</div>
                            <div>Température du processeur : {this.state.systemStats.cpuTemp}°C</div>
                            <div>Utilisation de la mémoire : {this.state.systemStats.usedMem}G/{this.state.systemStats.totalMem}G ({Math.round(this.state.systemStats.usedMem / this.state.systemStats.totalMem * 100 * 100) / 100}%)</div>
                            <div>Actif depuis : {formatDuration(this.state.systemStats.uptime)}</div>
                        </>}</div>
                    </div>

                    <div className="box">
                        <div className="box-title">Utilisation du réseau :</div>
                        <div>{!this.state.bandwidthUsage ? <Loading /> : <>
                            <div>Total : {formatBandwidthUsage(this.state.bandwidthUsage.total)} Go</div>
                            <div>Mois : {formatBandwidthUsage(this.state.bandwidthUsage.month)} Go</div>
                            <div>Journée : {formatBandwidthUsage(this.state.bandwidthUsage.day)} Go</div>
                        </>}</div>
                    </div>

                    <div className="box status">
                        <div className="box-title">Point d'accès :</div>
                        <div>{this.state.status === null ? <Loading /> : <>
                            <i className="fa-solid fa-circle led" style={{ color: this.state.status ? "green" : "red" }} />
                            <span>{this.state.status ? "Actif" : "Inactif"}</span>
                            <button className="button" onClick={toggleWifi}>{this.state.status ? "Désactiver" : "Activer"}</button>
                        </>}</div>
                    </div>
                </div>

                <div className="line">

                    <div className="box">
                        <div className="box-title">Appareils connectés :</div>
                        <div>En développement...</div>
                    </div>

                    <div className="box">
                        <div className="box-title">Bannissements :</div>
                        <div>En développement...</div>
                    </div>

                    <div className="box">
                        <div className="box-title">Baux DHCP :</div>
                        <div>En développement...</div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
