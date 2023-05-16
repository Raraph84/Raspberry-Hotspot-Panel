const API_HOST = process.env.NODE_ENV === "production" ? "http://" + document.location.hostname + ":8080" : "http://127.0.0.1:8080";
export const GATEWAY_HOST = process.env.NODE_ENV === "production" ? "ws://" + document.location.hostname + ":8081" : "ws://127.0.0.1:8081";

export const login = async (password) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/login", {
        method: "POST",
        body: JSON.stringify({ password })
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.token)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getSystemStats = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/system/stats", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getSystemBandwidthUsage = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/system/bandwidth", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getWifiStatus = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/status", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.status)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const systemPoweroff = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/system/poweroff", {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const systemReboot = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/system/reboot", {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const startWifi = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/start", {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const stopWifi = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/stop", {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getWifiClients = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/clients", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.wifiClients)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getWifiClient = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/clients/" + mac, {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const disconnectWifiClient = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/wifi/clients/" + mac, {
        method: "DELETE",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getRegisteredDevices = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/registereddevices", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.registeredDevices)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getRegisteredDevice = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/registereddevices/" + mac, {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const unregisterDevice = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/registereddevices/" + mac, {
        method: "DELETE",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getDhcpLeases = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/dhcp/leases", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.dhcpLeases)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getDhcpLease = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/dhcp/leases/" + mac, {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getBannedDevices = async () => new Promise((resolve, reject) => {

    fetch(API_HOST + "/banneddevices", {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => resolve(res.bannedDevices)).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const getBannedDevice = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/banneddevices/" + mac, {
        method: "GET",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) res.json().then((res) => {
            delete res.code;
            resolve(res);
        }).catch((error) => reject(error));
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const banDevice = async (mac, reason) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/banneddevices", {
        method: "POST",
        headers: { authorization: localStorage.getItem("token") },
        body: JSON.stringify({ mac, reason })
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});

export const unbanDevice = async (mac) => new Promise((resolve, reject) => {

    fetch(API_HOST + "/banneddevices/" + mac, {
        method: "DELETE",
        headers: { authorization: localStorage.getItem("token") }
    }).then((res) => {
        if (res.ok) resolve();
        else res.json().then((res) => reject(res.message)).catch((error) => reject(error));
    }).catch((error) => reject(error));
});
