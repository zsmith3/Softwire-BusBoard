// @ts-ignore
import express from "express";
import {arrivalsNearPostcodeToJson} from "./tfl_display";

const app = express();
const port = 8000;

app.get("/departureBoards", (request, response) => {
    if (!("postcode" in request.query)) {
        response.status(400);
        response.send({status: 400, message: "No postcode given"});
        return;
    }

    arrivalsNearPostcodeToJson(request.query.postcode as string)
        .then(data => response.send(data))
        .catch(error => {
            if (error.name === "UserError") {
                response.status(error.status);
                response.send({status: error.status, message: error.message});
            } else {
                console.log(error);
                response.status(500);
                response.send({status: 500, message: "Internal error"});
            }
        })
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
