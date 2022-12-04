import { Component } from "react";
import { Info, Loading } from "./other";
import { formatDuration } from "./utils";
import { getSystemBandwidthUsage, getSystemStats, getWifiStatus, startWifi, stopSystem, stopWifi } from "./api";

import "./styles/home.scss";

export default class Home extends Component {
    render() {

        document.title = "Accueil | Raspberry Pi Hotspot";

        return <div className="home">

            <div className="title">Accueil</div>

            <div className="boxes">
                <SystemStats />
                <BandwidthUsage />
                <AccessPoint />

                <div className="box">
                    <div className="box-title">Appareils connectés :</div>
                    <div className="box-content">En développement...</div>
                </div>

                <div className="box">
                    <div className="box-title">Bannissements :</div>
                    <div className="box-content">En développement...</div>
                </div>

                <div className="box">
                    <div className="box-title">Baux DHCP :</div>
                    <div className="box-content">En développement...</div>
                </div>
            </div>
        </div>;
    }
}

class SystemStats extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, systemStats: null };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {

        this.setState({ requesting: true, info: null });
        getSystemStats().then((systemStats) => {
            this.setState({ requesting: false, systemStats });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {

        const processStopSystem = () => {

            if (!window.confirm("Voulez vous vraiment arrêter le système ?")) return;

            this.setState({ requesting: true, info: null });
            stopSystem()
                .then(() => this.setState({ requesting: false, info: <Info color="green">Arrêt du système en cours...</Info> }))
                .catch((error) => {
                    if (error === "Invalid token") {
                        localStorage.removeItem("token");
                        window.location.reload();
                    } else
                        this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                });
        }

        return <div className="box">

            <div className="box-title">Informations système :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="box-content">
                {this.state.systemStats ? <>
                    <div>Utilisation du processeur : {this.state.systemStats.cpuUsage}%</div>
                    <div>Température du processeur : {this.state.systemStats.cpuTemp}°C</div>
                    <div>Utilisation de la mémoire : {this.state.systemStats.usedMem}G/{this.state.systemStats.totalMem}G ({Math.round(this.state.systemStats.usedMem / this.state.systemStats.totalMem * 100 * 100) / 100}%)</div>
                    <div>Actif depuis : {formatDuration(this.state.systemStats.uptime)}</div>
                </> : null}
                <div className="buttons">
                    <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                    {this.state.status !== null ? <button className="button" disabled={this.state.requesting} onClick={() => processStopSystem()}>Arrêter le système</button> : null}
                </div>
            </div>
        </div>;
    }
}

class BandwidthUsage extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, bandwidthUsage: null };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {

        this.setState({ requesting: true, info: null });
        getSystemBandwidthUsage().then((bandwidthUsage) => {
            this.setState({ requesting: false, bandwidthUsage });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {

        const formatBandwidthUsage = (bandwidthUsage) => {
            const total = Math.round((bandwidthUsage.tx + bandwidthUsage.rx) / 1000000000 * 100) / 100;
            const download = Math.round(bandwidthUsage.rx / 1000000000 * 100) / 100;
            const upload = Math.round(bandwidthUsage.tx / 1000000000 * 100) / 100;
            return total + " Go (" + download + " Go / " + upload + " Go)";
        }

        return <div className="box">

            <div className="box-title">Utilisation du réseau :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="box-content">
                {this.state.bandwidthUsage ? <>
                    <div>Total : {formatBandwidthUsage(this.state.bandwidthUsage.total)} Go</div>
                    <div>Mois : {formatBandwidthUsage(this.state.bandwidthUsage.month)} Go</div>
                    <div>Journée : {formatBandwidthUsage(this.state.bandwidthUsage.day)} Go</div>
                </> : null}
                <div className="buttons">
                    <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                </div>
            </div>
        </div>;
    }
}

class AccessPoint extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, status: null };
    }

    componentDidMount() {
        this.refresh();
    }

    refresh() {

        this.setState({ requesting: true, info: null });
        getWifiStatus().then((status) => {
            this.setState({ requesting: false, status });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {

        const toggleWifi = () => {
            this.setState({ requesting: true, info: null });
            if (!this.state.status) {
                startWifi()
                    .then(() => this.setState({ requesting: false, status: true }))
                    .catch((error) => {
                        if (error === "Invalid token") {
                            localStorage.removeItem("token");
                            window.location.reload();
                        } else
                            this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                    });
            } else {
                stopWifi()
                    .then(() => this.setState({ requesting: false, status: false }))
                    .catch((error) => {
                        if (error === "Invalid token") {
                            localStorage.removeItem("token");
                            window.location.reload();
                        } else
                            this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                    });
            }
        }

        return <div className="box status">

            <div className="box-title">Point d'accès :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="box-content">
                {this.state.status !== null ? <>
                    <i className="fa-solid fa-circle led" style={{ color: this.state.status ? "green" : "red" }} />
                    <span>{this.state.status ? "Actif" : "Inactif"}</span>
                </> : null}
                <div className="buttons">
                    <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                    {this.state.status !== null ? <button className="button" disabled={this.state.requesting} onClick={() => toggleWifi()}>{this.state.status ? "Désactiver" : "Activer"}</button> : null}
                </div>
            </div>
        </div >;
    }
}
