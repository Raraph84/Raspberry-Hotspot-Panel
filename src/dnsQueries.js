import { Component, createRef } from "react";
import { Loading } from "./other";
import { GATEWAY_HOST } from "./api";

import "./styles/dnsQueries.scss";

export default class DnsQueries extends Component {

    constructor(props) {

        super(props);

        this.boxRef = createRef();

        this.state = { requesting: false, info: null, dnsQueries: [] };
    }

    componentDidMount() {
        this.connect();
    }

    connect() {

        this.setState({ requesting: true });
        this.gateway = new WebSocket(GATEWAY_HOST);

        this.gateway.addEventListener("open", () => {

            this.gateway.send(JSON.stringify({ command: "LOGIN", token: localStorage.getItem("token") }));
        });

        this.gateway.addEventListener("message", (event) => {

            const message = JSON.parse(event.data);

            if (message.event === "LOGGED") {

                this.setState({ requesting: false, dnsQueries: [] });

            } else if (message.event === "HEARTBEAT") {

                this.gateway.send(JSON.stringify({ command: "HEARTBEAT" }));

            } else if (message.event === "DNS_QUERY") {

                const scroll = this.boxRef.current ? this.boxRef.current.scrollHeight - this.boxRef.current.scrollTop - this.boxRef.current.clientHeight : 10;

                this.state.dnsQueries.push({ date: message.date, mac: message.mac, name: message.name, domain: message.domain });
                if (this.state.dnsQueries.length > 1000) this.state.dnsQueries.shift();

                this.setState({ dnsQueries: this.state.dnsQueries }, () => {
                    if (scroll < 10 && this.boxRef.current) this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight - this.boxRef.current.clientHeight;
                });
            }
        });

        this.gateway.addEventListener("close", (event) => {
            if (event.reason === "Invalid token") {
                localStorage.removeItem("token");
                window.location.reload();
                return;
            }
            if (this.gateway.dontReconnect) return;
            this.setState({ requesting: true });
            setTimeout(() => this.connect(), 1000);
        });
    }

    componentWillUnmount() {

        if (this.gateway) {
            this.gateway.close();
            this.gateway.dontReconnect = true;
        }
    }

    render() {

        document.title = "Requêtes DNS | Raspberry Pi Hotspot";

        return <div className="dns-queries">

            <div className="title">Requêtes DNS</div>

            {this.state.requesting ? <Loading /> : null}
            {this.state.info}

            <div className="box" ref={this.boxRef}>
                <div className="queries">
                    {this.state.dnsQueries.length > 0
                        ? this.state.dnsQueries.sort((a, b) => a.date - b.date).map((query, i) => <div key={i}>{query.domain} from {query.name}</div>)
                        : <div>Aucune requête</div>}
                </div>
            </div>

        </div>;
    }
}
