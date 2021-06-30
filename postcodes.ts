import axios from "axios";


export interface LatLon {
    lat: number;
    lon: number;
}


export async function latLonFromPostcode(postcode: string): Promise<LatLon> {
    try {
        const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
        return { lat: response.data.result.latitude, lon: response.data.result.longitude };
    } catch (error) {
        throw {name: "UserError", message: "Invalid postcode", status: 400};
    }
}
