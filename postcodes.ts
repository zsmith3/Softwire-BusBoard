import axios from "axios";


export interface LatLon {
    lat: number;
    lon: number;
}


export async function latLonFromPostcode(postcode: string): Promise<LatLon> {
    const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
    return { lat: response.data.result.latitude, lon: response.data.result.longitude };
}
