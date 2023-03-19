import { Component } from "react";
import { useParams } from "react-router-dom";
import { banDevice, getBannedDevice, getDhcpLease, getWifiClient, unbanDevice } from "./api";
import { Info, Loading } from "./other";
import { formatDuration } from "./utils";

import "./styles/device.scss";

class Device extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, wifiClient: null, dhcpLease: null, bannedDevice: null };
    }

    async componentDidMount() {

        this.setState({ requesting: true });

        let wifiClient;
        try {
            wifiClient = await getWifiClient(this.props.params.mac);
        } catch (error) {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
                return;
            } else if (error === "Invalid MAC address") {
                this.setState({ requesting: false, info: <Info type="error">Adresse MAC invalide</Info> });
                return;
            } else if (error !== "This client does not exist") {
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                return;
            }
        }

        let dhcpLease;
        try {
            dhcpLease = await getDhcpLease(this.props.params.mac);
        } catch (error) {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
                return;
            } else if (error === "Invalid MAC address") {
                this.setState({ requesting: false, info: <Info type="error">Adresse MAC invalide</Info> });
                return;
            } else if (error !== "This dhcp lease does not exist") {
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                return;
            }
        }

        let bannedDevice;
        try {
            bannedDevice = await getBannedDevice(this.props.params.mac);
        } catch (error) {
            if (error === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
                return;
            } else if (error === "Invalid MAC address") {
                this.setState({ requesting: false, info: <Info type="error">Adresse MAC invalide</Info> });
                return;
            } else if (error !== "Device not banned") {
                this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                return;
            }
        }

        if (!wifiClient && !dhcpLease && !bannedDevice) {
            this.setState({ requesting: false, info: <Info type="error">Appareil introuvable</Info> });
            return;
        }

        this.setState({ requesting: false, wifiClient, dhcpLease, bannedDevice });
    }

    render() {

        document.title = "Appareil | Raspberry Pi Hotspot";

        const formatBandwidthUsage = (client) => {
            const total = Math.round((client.txBytes + client.rxBytes) / 1000000000 * 100) / 100;
            const download = Math.round(client.rxBytes / 1000000000 * 100) / 100;
            const upload = Math.round(client.txBytes / 1000000000 * 100) / 100;
            return total + " Go (" + download + " Go / " + upload + " Go)";
        }

        const ban = async () => {

            const reason = window.prompt("Raison :");
            if (reason === null) return;

            this.setState({ requesting: true, info: null });
            banDevice(this.state.wifiClient.mac, reason).then(() => {
                getBannedDevice(this.props.params.mac).then((bannedDevice) => {
                    this.setState({ requesting: false, bannedDevice });
                }).catch((error) => {
                    if (error === "Invalid token") {
                        localStorage.removeItem("token");
                        window.location.reload();
                    } else
                        this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
                });
            }).catch((error) => {
                if (error === "Invalid token") {
                    localStorage.removeItem("token");
                    window.location.reload();
                } else
                    this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
            });
        }

        const unban = async () => {

            this.setState({ requesting: true, info: null });
            unbanDevice(this.state.bannedDevice.mac).then(() => {
                this.setState({ requesting: false, bannedDevice: null });
            }).catch((error) => {
                if (error === "Invalid token") {
                    localStorage.removeItem("token");
                    window.location.reload();
                } else
                    this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
            });
        }

        return <div className="device">

            <div className="title">Appareil</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="boxes">
                <div className="box">
                    <div className="box-title">Appareil connecté :</div>
                    {this.state.wifiClient ? <>
                        <div>
                            <div>Connecté :</div>
                            <div>Oui</div>
                        </div>
                        <div>
                            <div>Adresse MAC :</div>
                            <div>{this.state.wifiClient.mac}</div>
                        </div>
                        <div>
                            <div>Connecté pendant :</div>
                            <div>{formatDuration(this.state.wifiClient.connectedDuration)}</div>
                        </div>
                        <div>
                            <div>Utilisation du réseau :</div>
                            <div>{formatBandwidthUsage(this.state.wifiClient)}</div>
                        </div>
                        <div>
                            <div>Prénom :</div>
                            <div>{this.state.wifiClient.firstname || "Inconnu"}</div>
                        </div>
                    </> : <>
                        <div>
                            <div>Connecté :</div>
                            <div>Non</div>
                        </div>
                    </>}
                </div>
                <div className="box">
                    <div className="box-title">Bail DHCP :</div>
                    {this.state.dhcpLease ? <>
                        <div>
                            <div>Actif :</div>
                            <div>Oui</div>
                        </div>
                        <div>
                            <div>Adresse MAC :</div>
                            <div>{this.state.dhcpLease.mac}</div>
                        </div>
                        <div>
                            <div>Adresse IP :</div>
                            <div>{this.state.dhcpLease.ip}</div>
                        </div>
                        <div>
                            <div>Nom :</div>
                            <div>{this.state.dhcpLease.hostname || "Inconnu"}</div>
                        </div>
                        <div>
                            <div>Expiration dans :</div>
                            <div>{formatDuration(this.state.dhcpLease.expirationDate - Date.now())}</div>
                        </div>
                        <div>
                            <div>Prénom :</div>
                            <div>{this.state.dhcpLease.firstname || "Inconnu"}</div>
                        </div>
                    </> : <>
                        <div>
                            <div>Actif :</div>
                            <div>Non</div>
                        </div>
                    </>}
                </div>
                <div className="box">
                    <div className="box-title">Bannissement :</div>
                    {this.state.bannedDevice ? <>
                        <div>
                            <div>Banni :</div>
                            <div>Oui</div>
                        </div>
                        <div>
                            <div>Raison :</div>
                            <div>{this.state.bannedDevice.reason}</div>
                        </div>
                        <div>
                            <div>Prénom :</div>
                            <div>{this.state.bannedDevice.firstname || "Inconnu"}</div>
                        </div>
                    </> : <>
                        <div>
                            <div>Banni :</div>
                            <div>Non</div>
                        </div>
                    </>}
                    <div className="buttons">{this.state.bannedDevice
                        ? <button className="button" disabled={this.state.requesting} onClick={() => unban()}>Débannir</button>
                        : <button className="button" disabled={this.state.requesting} onClick={() => ban()}>Bannir</button>}</div>
                </div>
            </div>

        </div>;
    }
}

// eslint-disable-next-line
export default (props) => <Device {...props} params={useParams()} />;
