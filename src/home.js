import { Component } from "react";
import { Link } from "react-router-dom";
import { Info, Loading } from "./other";
import { formatDuration } from "./utils";
import { getWifiStatus, startWifi, stopWifi, getSystemStats, systemReboot, systemPoweroff, getSystemBandwidthUsage, getRegisteredDevices, getWifiClients, getDhcpLeases, getBannedDevices } from "./api";

import "./styles/home.scss";

export default class Home extends Component {
    render() {

        document.title = "Accueil | Raspberry Pi Hotspot";

        return <div className="home">

            <div className="title">Accueil</div>

            <div className="boxes">
                <AccessPoint />
                <SystemStats />
                <BandwidthUsage />
                <RegisteredDevices />
                <WifiClients />
                <DhcpLeases />
                <BannedDevices />
                <DnsQueries />
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
                startWifi().then(() => {
                    this.setState({ requesting: false, status: true });
                }).catch((error) => {
                    if (error === "Invalid token") {
                        localStorage.removeItem("token");
                        window.location.reload();
                    } else
                        this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                });
            } else {
                stopWifi().then(() => {
                    this.setState({ requesting: false, status: false });
                }).catch((error) => {
                    if (error === "Invalid token") {
                        localStorage.removeItem("token");
                        window.location.reload();
                    } else
                        this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                });
            }
        }

        return <div className="box">

            <div className="box-title">Point d'accès :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            {this.state.status !== null ? <div>
                <i className="fa-solid fa-circle led" style={{ color: this.state.status ? "green" : "red" }} />
                <span>{this.state.status ? "Actif" : "Inactif"}</span>
            </div> : null}

            {this.state.status !== null ? <div className="buttons">
                <button className="button" disabled={this.state.requesting} onClick={() => toggleWifi()}>{this.state.status ? "Désactiver" : "Activer"}</button>
            </div> : null}
        </div >;
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

        const processPoweroff = () => {

            if (!window.confirm("Voulez vous vraiment arrêter le système ?")) return;

            this.setState({ requesting: true, info: null });
            systemPoweroff().then(() => {
                this.setState({ requesting: false, info: <Info color="green">Arrêt du système en cours...</Info> });
            }).catch((error) => {
                if (error === "Invalid token") {
                    localStorage.removeItem("token");
                    window.location.reload();
                } else
                    this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
            });
        }

        const processReboot = () => {

            if (!window.confirm("Voulez vous vraiment redémarrer le système ?")) return;

            this.setState({ requesting: true, info: null });
            systemReboot().then(() => {
                this.setState({ requesting: false, info: <Info color="green">Redémarrage du système en cours...</Info> });
            }).catch((error) => {
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

            {this.state.systemStats ? <div>
                <div>Utilisation du processeur : {this.state.systemStats.cpuUsage}%</div>
                <div>Température du processeur : {this.state.systemStats.cpuTemp}°C</div>
                <div>Utilisation de la mémoire : {this.state.systemStats.usedMem}G/{this.state.systemStats.totalMem}G ({Math.round(this.state.systemStats.usedMem / this.state.systemStats.totalMem * 100 * 100) / 100}%)</div>
                <div>Actif depuis : {formatDuration(this.state.systemStats.uptime)}</div>
            </div> : null}

            <div className="buttons">
                <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
                <button className="button" disabled={this.state.requesting} onClick={() => processReboot()}>Redémarrer</button>
                <button className="button" disabled={this.state.requesting} onClick={() => processPoweroff()}>Arrêter</button>
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

            {this.state.bandwidthUsage ? <div>
                <div>Total : {formatBandwidthUsage(this.state.bandwidthUsage.total)} Go</div>
                <div>Mois : {formatBandwidthUsage(this.state.bandwidthUsage.month)} Go</div>
                <div>Journée : {formatBandwidthUsage(this.state.bandwidthUsage.day)} Go</div>
            </div> : null}

            <div className="buttons">
                <button className="button" disabled={this.state.requesting} onClick={() => this.refresh()}>Rafraichir</button>
            </div>
        </div>;
    }
}

class WifiClients extends Component {

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
        return <div className="box">

            <div className="box-title">Appareils connectés :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            {this.state.wifiClients ? <div>
                <div>Nombre d'appareils connectés : {this.state.wifiClients.length}</div>
            </div> : null}

            <div className="buttons">
                <Link className="button" to="/wificlients">Voir les appareils connectés</Link>
            </div>
        </div >;
    }
}

class RegisteredDevices extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, registeredDevices: null };
    }

    componentDidMount() {

        this.setState({ requesting: true, info: null });
        getRegisteredDevices().then((registeredDevices) => {
            this.setState({ requesting: false, registeredDevices });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {
        return <div className="box">

            <div className="box-title">Appareils enregistrés :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            {this.state.registeredDevices ? <div>
                <div>Nombre d'appareils enregistrés : {this.state.registeredDevices.length}</div>
            </div> : null}

            <div className="buttons">
                <Link className="button" to="/registereddevices">Voir les appareils enregistrés</Link>
            </div>
        </div >;
    }
}

class DhcpLeases extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, dhcpLeases: null };
    }

    componentDidMount() {

        this.setState({ requesting: true, info: null });
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
        return <div className="box">

            <div className="box-title">Baux DHCP :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            {this.state.dhcpLeases ? <div>
                <div>Nombre de baux DHCP : {this.state.dhcpLeases.length}</div>
            </div> : null}

            <div className="buttons">
                <Link className="button" to="/dhcpleases">Voir les baux</Link>
            </div>
        </div>;
    }
}

class BannedDevices extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, bannedDevices: null };
    }

    componentDidMount() {

        this.setState({ requesting: true, info: null });
        getBannedDevices().then((bannedDevices) => {
            this.setState({ requesting: false, bannedDevices });
        }).catch((error) => {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
            } else
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
        });
    }

    render() {
        return <div className="box">

            <div className="box-title">Bannissements :</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            {this.state.bannedDevices ? <div>
                <div>Nombre de bannissements : {this.state.bannedDevices.length}</div>
            </div> : null}

            <div className="buttons">
                <Link className="button" to="/banneddevices">Voir les bannissements</Link>
            </div>
        </div>;
    }
}

class DnsQueries extends Component {
    render() {
        return <div className="box">

            <div className="box-title">Requêtes DNS :</div>

            <div className="buttons">
                <Link className="button" to="/dnsqueries">Voir les requêtes DNS</Link>
            </div>
        </div>;
    }
}
