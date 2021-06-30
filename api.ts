import axios from "axios";

const appKey = "3850472a16334622aa04dcca7ac01b8a";


export interface Arrival {
    lineName: string;
    destinationName: string;
    timeToStation: number;
}


export async function getArrivals(stopId: string): Promise<Arrival[]> {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${appKey}`);
    return response.data.sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
}
