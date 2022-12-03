import { Component, createRef } from "react";
import { Loading, Info } from "./other";
import { login } from "./api";

import "./styles/login.scss";

export default class Login extends Component {

    constructor(props) {

        super(props);

        this.passwordRef = createRef();

        this.state = { requesting: false, info: null };
    }

    componentDidMount() {
        if (localStorage.token)
            window.location.reload();
    }

    render() {

        document.title = "Connexion | Raspberry Pi Hotspot";

        const processLogin = () => {

            this.setState({ requesting: true, info: null });
            login(this.passwordRef.current.value).then((token) => {
                localStorage.token = token;
                window.location.reload();
            }).catch((error) => {
                if (error === "Invalid password")
                    this.setState({ requesting: false, info: <Info>Mot de passe incorrect !</Info> });
                else
                    this.setState({ requesting: false, info: <Info>Un problème est survenu !</Info> });
            });
        }

        return <div className="login">

            <div className="title">Connexion</div>

            <div className="form">

                {this.state.requesting ? <Loading /> : null}
                {this.state.info}

                <div>
                    <span className="label">Mot de passe :</span>
                    <input type="password" disabled={this.state.requesting} ref={this.passwordRef} onKeyDown={(event) => { if (event.key === "Enter") processLogin(); }} />
                </div>

                <button className="button" disabled={this.state.requesting} onClick={() => processLogin()}>Se connecter</button>

            </div>

        </div>;
    }
}
