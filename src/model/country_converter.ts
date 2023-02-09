import country_codes from './country_codes.json';

export const country_converter = (country_code: string) => {
    const codes: any = country_codes;
    return codes[country_code];
}