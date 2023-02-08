
export class ConnectionDetails {
    hostname: string;
    ip: string;
    country: string;
    city: string;
    current_technology: string;
    current_protocol: string;
    transfer: string;
    uptime: string;

    constructor(obj: any) {
        this.hostname = obj.hostname;
        this.ip = obj.ip;
        this.country = obj.country;
        this.city = obj.city;
        this.current_technology = obj.current_technology;
        this.current_protocol = obj.current_protocol;
        this.transfer = obj.transfer;
        this.uptime = obj.uptime;
    }
}