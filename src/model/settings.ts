
export class Settings {
    threatprotectionlite: boolean = false;
    firewall: boolean = true;
    killswitch: boolean = false;
    ipv6: boolean = false;
    dns: string | null = null;

    autoconnect: boolean = false;
    meshnet: boolean = false;
    notify: boolean = false;

    analytics: boolean = true;
    dark_mode: boolean = false;
}