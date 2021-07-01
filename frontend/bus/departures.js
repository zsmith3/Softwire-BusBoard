let lastPostcode = null;

function makeRequest(postcode) {
    console.log("Request: " + postcode);

    if (postcode === null) {
        if (lastPostcode === null) return;
        else postcode = lastPostcode;
    } else lastPostcode = postcode;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:8000/api/departureBoards?postcode=${postcode}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onload = function() {
        const response = JSON.parse(xhttp.response);
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";

        if (Array.isArray(response)) {
            response.forEach(stop => {
                const stopContainer = document.createElement("div");
                resultsContainer.appendChild(stopContainer);

                const title = document.createElement("h3");
                title.innerText = stop.stop;
                stopContainer.appendChild(title);

                const list = document.createElement("ul");
                stopContainer.appendChild(list);
                stop.arrivals.forEach(arrival => {
                    const item = document.createElement("li");
                    item.innerText = `${arrival.eta} min(s): ${arrival.line} to ${arrival.destination}`;
                    list.appendChild(item);
                });
            });
        } else {
            const error = document.createElement("p");
            error.innerText = "Error: " + response.message;
            resultsContainer.appendChild(error);
        }
    }

    xhttp.send();
}

setInterval(() => makeRequest(null), 30 * 1000);
