// @ts-ignore
import express from "express";
import {arrivalsNearPostcodeToJson, cabsNearPostcodeToJson} from "./tfl_display";

const app = express();
const port = 8000;

function checkHasPostcode(request: express.Request, response: express.Response) {
    if ("postcode" in request.query) return true;
    else {
        response.status(400);
        response.send({status: 400, message: "No postcode given"});
        return false;
    }
}

function catchError(response: express.Response, error: {name: string, status:number, message:string}) {
    if (error.name === "UserError") {
        response.status(error.status);
        response.send({status: error.status, message: error.message});
    } else {
        console.log(error);
        response.status(500);
        response.send({status: 500, message: "Internal error"});
    }
}

app.get("/api/departureBoards", (request, response) => {
    if (!checkHasPostcode(request, response)) return;

    arrivalsNearPostcodeToJson(request.query.postcode as string)
        .then(data => response.send(data))
        .catch(catchError.bind(null, response));
});

app.get("/api/cabs", (request, response) => {
    if (!checkHasPostcode(request, response)) return;

    cabsNearPostcodeToJson(request.query.postcode as string)
        .then(data => response.send(data))
        .catch(catchError.bind(null, response));
});

app.use("/", express.static("frontend"));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
