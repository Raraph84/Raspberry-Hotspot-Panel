const HOST = process.env.NODE_ENV === "production" ? document.location.origin + ":8080" : "http://192.168.5.10:8080";

export const login = async (password) => new Promise((resolve, reject) => {

    fetch(HOST + "/login", {
        method: "POST",
        body: JSON.stringify({ password })
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.token)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getWifiClients = async () => new Promise((resolve, reject) => {

    fetch(HOST + "/wifi/clients", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.clients)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getWifiClient = async (mac) => new Promise((resolve, reject) => {

    fetch(HOST + "/wifi/clients/" + mac, {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            const client = { ...res };
            delete client.code;
            resolve(client);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});
