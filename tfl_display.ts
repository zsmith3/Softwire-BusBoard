import "ts-replace-all";

import {Arrival, arrivalsNearPostcode, cabsNearPostcode, StopPoint} from "./tfl_api";


function printStopArrivals(data: {stop: StopPoint, arrivals: Arrival[]}) {
    console.log("Stop: " + data.stop.commonName);
    console.log("Arrivals:")
    data.arrivals.slice(0, 5).forEach(bus => {
        console.log(`Line: ${bus.lineName}, Destination: ${bus.destinationName}, ETA: ${Math.round(bus.timeToStation / 60)} min(s)`);
    });
    console.log();
}

export function printArrivalsNearPostcode(postcode: string) {
    arrivalsNearPostcode(postcode).then(stops => {
        stops.forEach(stop => printStopArrivals(stop));
    });
}

export async function arrivalsNearPostcodeToJson(postcode: string) {
    const stops = await arrivalsNearPostcode(postcode);
    if (stops.length) {
        return stops.slice(0, 2).map(stop => ({
            stop: stop.stop.commonName,
            arrivals: stop.arrivals.slice(0, 5).map(arrival => ({
                line: arrival.lineName,
                destination: arrival.destinationName,
                eta: Math.round(arrival.timeToStation / 60)
            }))
        }));
    } else {
        throw {name: "UserError", message: "No stops found near postcode", status: 404};
    }
}

export async function cabsNearPostcodeToJson(postcode: string) {
    const cabs = await cabsNearPostcode(postcode);
    if (cabs.length) {
        return cabs.slice(0, 5).map(cab => ({
            name: cab.TradingName,
            phone: cab.BookingsPhoneNumber,
            number: cab.NumberOfVehicles,
            address: `${`${cab.AddressLine1} ${cab.AddressLine2}`.replaceAll(",", "")}, ${cab.Postcode}`
        }));
    } else {
        throw {name: "UserError", message: "No cabs found near postcode", status: 404};
    }
}
