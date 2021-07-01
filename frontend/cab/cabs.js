function makeRequest(postcode) {
    console.log("Request: " + postcode);

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:8000/api/cabs?postcode=${postcode}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");

    xhttp.onload = function() {
        const response = JSON.parse(xhttp.response);
        const resultsContainer = document.getElementById("results");
        resultsContainer.innerHTML = "";

        if (Array.isArray(response)) {
            response.forEach(cab => {
                const cabContainer = document.createElement("div");
                resultsContainer.appendChild(cabContainer);

                const title = document.createElement("h3");
                title.innerText = cab.name;
                cabContainer.appendChild(title);

                const para = document.createElement("p");
                para.innerHTML = `<b>Vehicles: </b>${cab.number}<br /><b>Address: </b>${cab.address}<br /><b>Phone: </b>${cab.phone}<br />`;
                cabContainer.appendChild(para);
            });
        } else {
            const error = document.createElement("p");
            error.innerText = "Error: " + response.message;
            resultsContainer.appendChild(error);
        }
    }

    xhttp.send();
}
