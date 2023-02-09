
export class Settings {
    threat_protection_lite: boolean = false;
    firewall: boolean = false;
    kill_switch: boolean = false;
    ipv6: boolean = false;
    custom_dns: string | null = null;

    auto_connect: boolean = false;
    meshnet: boolean = false;
    notify: boolean = false;

    analytics: boolean = false;
}