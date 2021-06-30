import * as readlineSync from "readline-sync";

import {Arrival, getArrivals} from "./api";


const stopId = readlineSync.question("Enter stop ID: ");

getArrivals(stopId).then(arrivals => {
    arrivals.slice(0, 5).forEach(bus => {
        console.log(`Line: ${bus.lineName}, Destination: ${bus.destinationName}, Time left: ${Math.round(bus.timeToStation / 60)} min(s)`);
    });
});
