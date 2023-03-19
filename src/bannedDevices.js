import { Component } from "react";
import { Link } from "react-router-dom";
import { Info, Loading } from "./other";
import { getBannedDevices } from "./api";

import "./styles/bannedDevices.scss";

export default class BannedDevices extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, bannedDevices: null };
    }

    componentDidMount() {

        this.setState({ requesting: true });
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

        document.title = "Bannissements | Raspberry Pi Hotspot";

        return <div className="banned-devices">

            <div className="title">Bannissements</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="boxes">{this.state.bannedDevices ? <>

                <div className="box">
                    <div>Nombre de bannissements : {this.state.bannedDevices.length}</div>
                </div>

                <div className="bans">
                    {this.state.bannedDevices.map((bannedDevice, index) => <div className="box" key={index}>
                        <div>
                            <div>Adresse MAC :</div>
                            <div>{bannedDevice.mac}</div>
                        </div>
                        <div>
                            <div>Raison :</div>
                            <div>{bannedDevice.reason}</div>
                        </div>
                        <div>
                            <div>Prénom :</div>
                            <div>{bannedDevice.firstName ? bannedDevice.firstName : "Inconnu"}</div>
                        </div>
                        <div className="buttons">
                            <Link to={"/devices/" + bannedDevice.mac} className="button">Voir l'appareil</Link>
                        </div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
