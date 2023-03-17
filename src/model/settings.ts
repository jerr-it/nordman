
export class Settings {
    threatprotectionlite: boolean = false;
    firewall: boolean = true;
    killswitch: boolean = false;
    ipv6: boolean = false;
    technology: string = "NORDLYNX";
    obfuscate: boolean = false;
    protocol: string = "UDP";

    autoconnect: boolean = false;
    routing: boolean = true;
    meshnet: boolean = false;
    notify: boolean = false;
    dns: string | null = null;

    analytics: boolean = true;
    dark_mode: boolean = false;
}

export const technologies = [
    "NORDLYNX",
    "OPENVPN",
];

export const protocols = [
    "UDP",
    "TCP",
];