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

export interface Cab {
    TradingName: string;
    BookingsPhoneNumber: string;
    NumberOfVehicles: number;
    AddressLine1: string;
    AddressLine2: string;
    Postcode: string;
    Distance: number;
}

async function tflRequest(url: string) {
    try {
        return await axios.get(url + `&app_key=${appKey}`);
    } catch (error) {
        throw `TFL error: ${error.response.data.message} at URL: ${url}`;
    }
}

export async function stopPointsWithinRadius(latLon: LatLon, radius: number): Promise<StopPoint[]> {
    const response = await tflRequest(`https://api.tfl.gov.uk/StopPoint?stopTypes=NaptanPublicBusCoachTram&modes=bus&lat=${latLon.lat}&lon=${latLon.lon}&radius=${radius}`);
    const stopPoints: StopPoint[] = response.data.stopPoints;
    return stopPoints.sort(stopPoint => stopPoint.distance);
}

export async function getArrivalsAtStop(stopId: string): Promise<Arrival[]> {
    const response = await tflRequest(`https://api.tfl.gov.uk/StopPoint/${stopId}/Arrivals?`);
    return response.data.sort((a: Arrival, b: Arrival) => a.timeToStation - b.timeToStation);
}

export async function arrivalsNearPostcode(postcode: string): Promise<{stop: StopPoint, arrivals: Arrival[]}[]> {
    const latLon = await latLonFromPostcode(postcode);
    const stopPoints = await stopPointsWithinRadius(latLon, 500);
    return Promise.all(stopPoints.map(async stop => ({
        stop: stop,
        arrivals: await getArrivalsAtStop(stop.id)
    })));
}

export async function cabsNearLatLon(latLon: LatLon): Promise<Cab[]> {
    const response = await tflRequest(`https://api.tfl.gov.uk/Cabwise/search?lat=${latLon.lat}&lon=${latLon.lon}`);
    const cabs: Cab[] = response.data.Operators.OperatorList;
    return cabs.sort((a, b) => a.Distance - b.Distance);
}

export async function cabsNearPostcode(postcode: string): Promise<Cab[]> {
    const latLon = await latLonFromPostcode(postcode);
    return await cabsNearLatLon(latLon);
}
