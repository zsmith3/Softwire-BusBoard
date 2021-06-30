import axios from "axios";
import {LatLon, latLonFromPostcode} from "./postcodes";

const appKey = "3850472a16334622aa04dcca7ac01b8a";


export interface Arrival {
    lineName: string;
    destinationName: string;
    timeToStation: number;
}

export interface StopPoint {
    id: string;
    distance: number;
    commonName: string;
}


export async function stopPointsWithinRadius(latLon: LatLon, radius: number): Promise<StopPoint[]> {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${latLon.lat}&lon=${latLon.lon}&radius=${radius}&app_key=${appKey}`);
    const stopPoints: StopPoint[] = response.data.stopPoints;
    return stopPoints.sort(stopPoint => stopPoint.distance);
}

export async function getArrivalsAtStop(stopId: string): Promise<Arrival[]> {
    const response = await axios.get(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?app_key=${appKey}`);
    return response.data.sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
}

export async function arrivalsNearPostcode(postcode: string): Promise<{stop: StopPoint, arrivals: Arrival[]}[]> {
    const latLon = await latLonFromPostcode(postcode);
    const stopPoints = await stopPointsWithinRadius(latLon, 500);
    return Promise.all(stopPoints.slice(0, 2).map(async stop => ({
        stop: stop,
        arrivals: await getArrivalsAtStop(stop.id)
    })));
}
