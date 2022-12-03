import { Component } from "react";
import { createRoot } from "react-dom/client";

class Website extends Component {
    render() {
        return <div></div>;
    }
}

createRoot(document.getElementById("root")).render(<Website />);
