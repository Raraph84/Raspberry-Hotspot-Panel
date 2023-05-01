import { Component } from "react";
import { Link } from "react-router-dom";
import { Info, Loading } from "./other";
import { getRegisteredDevices } from "./api";
import moment from "moment";

import "./styles/registeredDevices.scss";

export default class RegisteredDevices extends Component {

    constructor(props) {

        super(props);

        this.state = { requesting: false, info: null, registeredDevices: null };
    }

    componentDidMount() {

        this.setState({ requesting: true });
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

        document.title = "Appareils enregistrés | Raspberry Pi Hotspot";

        return <div className="registered-devices">

            <div className="title">Appareils enregistrés</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="boxes">{this.state.registeredDevices ? <>

                <div className="box">
                    <div>Nombre d'appareils enregistrés : {this.state.registeredDevices.length}</div>
                </div>

                <div className="devices">
                    {this.state.registeredDevices.map((registeredDevice, index) => <div className="box" key={index}>
                        <div>
                            <div>Prénom :</div>
                            <div>{registeredDevice.firstName}</div>
                        </div>
                        <div>
                            <div>Adresse MAC :</div>
                            <div>{registeredDevice.mac}</div>
                        </div>
                        <div>
                            <div>Date d'enregistrements :</div>
                            <div>{moment(registeredDevice.registeredDate).format("DD/MM/YYYY à HH:mm")}</div>
                        </div>
                        <div className="buttons">
                            <Link to={"/devices/" + registeredDevice.mac} className="button">Voir l'appareil</Link>
                        </div>
                    </div>)}
                </div>

            </> : null}</div>
        </div>;
    }
}
