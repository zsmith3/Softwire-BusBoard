import * as readlineSync from "readline-sync";

import {displayArrivalsNearPostcode,} from "./tfl_display";


const postcode = readlineSync.question("Enter postcode: ");

displayArrivalsNearPostcode(postcode);
