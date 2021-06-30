import {Arrival, arrivalsNearPostcode, StopPoint} from "./tfl_api";


function displayStopArrivals(data: {stop: StopPoint, arrivals: Arrival[]}) {
    console.log("Stop: " + data.stop.commonName);
    console.log("Arrivals:")
    data.arrivals.slice(0, 5).forEach(bus => {
        console.log(`Line: ${bus.lineName}, Destination: ${bus.destinationName}, ETA: ${Math.round(bus.timeToStation / 60)} min(s)`);
    });
    console.log();
}

export function displayArrivalsNearPostcode(postcode: string) {
    arrivalsNearPostcode(postcode).then(stops => {
        stops.forEach(stop => displayStopArrivals(stop));
    });
}
