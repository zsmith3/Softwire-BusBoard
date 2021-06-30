import {Arrival, arrivalsNearPostcode, StopPoint} from "./tfl_api";


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
            arrivals: stop.arrivals.map(arrival => ({
                line: arrival.lineName,
                destination: arrival.destinationName,
                eta: arrival.timeToStation
            }))
        }));
    } else {
        throw {name: "UserError", message: "No stops found near postcode", status: 404};
    }
}
