let nycMap = L.map('map').setView([40.7128,-74.0060], 11);


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(nycMap);




//search input section
let searchInput = document.getElementById("searchfield");
let searchBtn = document.getElementById("searchbtn");
let clearBtn = document.getElementById("clearbtn");


let searchLocationMarker = null;


searchBtn.addEventListener("click", function() {


    let query = searchInput.value.trim();


    if (query === "") {
        return;
    }


    fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ", New York City")}`
    )
    .then(response => response.json())
    .then(data => {


        if (data.length === 0) {
            alert("Location not found.");
            return;
        }


        let latitude = parseFloat(data[0].lat);
        let longitude = parseFloat(data[0].lon);


        nycMap.setView([latitude, longitude], 16);


        if (searchLocationMarker !== null) {
            searchLocationMarker.removeFrom(nycMap);
        }


        searchLocationMarker = L.marker([latitude, longitude])
            .addTo(nycMap)
            .bindPopup(`<strong>${query}</strong>`)
            .openPopup();


        findNearbyMarkers(latitude, longitude);


    })
    .catch(error => {
        console.error("Search error:", error);
    });


});




function findNearbyMarkers(searchLat, searchLng) {


    let nearbyLocations = [];


    let oneMile = 1609.34;


    for (let category in markerGroups) {


        markerGroups[category].forEach(function(marker) {


            let markerLocation = marker.getLatLng();


            let distance = nycMap.distance(
                [searchLat, searchLng],
                [markerLocation.lat, markerLocation.lng]
            );


            if (distance <= oneMile) {


                nearbyLocations.push({
                    marker: marker,
                    category: category,
                    distance: distance
                });


            }


        });


    }


    nearbyLocations.sort(function(a, b) {
        return a.distance - b.distance;
    });


    let placesList = document.getElementById("places-list");


    placesList.innerHTML = "";


    if (nearbyLocations.length === 0) {


        placesList.innerHTML = `
            <p>
                No locations were found within 1 mile.
            </p>
        `;


        return;
    }


    nearbyLocations.forEach(function(location) {


        let distanceInMiles =
            (location.distance / 1609.34).toFixed(2);


        let categoryName =
            location.category.charAt(0).toUpperCase() +
            location.category.slice(1);


        let result = document.createElement("div");


        result.classList.add("nearby-result");


        result.innerHTML = `
            <h3>${categoryName}</h3>


            <p>
                <strong>Distance:</strong>
                ${distanceInMiles} miles away
            </p>


            <button class="view-marker">
                View on map
            </button>
        `;


        placesList.appendChild(result);


        result.querySelector(".view-marker")
            .addEventListener("click", function() {


                let markerLocation =
                    location.marker.getLatLng();


                nycMap.setView(
                    [markerLocation.lat, markerLocation.lng],
                    17
                );


                location.marker.openPopup();


            });


    });


}




clearBtn.addEventListener("click", function() {


    searchInput.value = "";


    if (searchLocationMarker !== null) {


        searchLocationMarker.removeFrom(nycMap);


        searchLocationMarker = null;
    }


    document.getElementById("places-list").innerHTML = `
        <p class="placeholder-text">
            Search for a location to find nearby accessible places.
        </p>
    `;


    filterMarkers("all");


    nycMap.setView([40.7128, -74.0060], 12);


});




//category colors


const categoryColors = {
    cooling: "blue",
    activities: "green",
    food: "yellow",
    trash: "orange",
    gas: "red",
    libraries: "purple"
};




//marker groups
const markerGroups = {
    cooling: [],
    activities: [],
    food: [],
    trash: [],
    gas: [],
    libraries: []
};

const trashCluster = L.markerClusterGroup({
    chunkedLoading: true
});



function filterMarkers(selectedCategory) {

    for (let category in markerGroups) {

        if (category === "trash") {

            if (selectedCategory === "all" || selectedCategory === "trash") {
                trashCluster.addTo(nycMap);
            } else {
                trashCluster.removeFrom(nycMap);
            }

            continue;
        }

        if (selectedCategory === "all" || category === selectedCategory) {

            markerGroups[category].forEach(function(marker) {
                marker.addTo(nycMap);
            });

        } else {

            markerGroups[category].forEach(function(marker) {
                marker.removeFrom(nycMap);
            });

        }
    }
}


//filter button
document.getElementById("filter").addEventListener("change",function(){
    let selectedCategory = this.value;
    filterMarkers(selectedCategory);
})



//auto marker maker for cooling


const coolingAPI =
    "https://services6.arcgis.com/yG5s3afENB5iO9fj/ArcGIS/rest/services/CoolingCenters_PROD_view/FeatureServer/0/query" +
    "?where=1%3D1" +
    "&outFields=*" +
    "&returnGeometry=true" +
    "&outSR=4326" +
    "&f=json";


fetch(coolingAPI)
    .then(response => response.json())
    .then(data => {


       data.features.forEach(location => {




    const latitude = location.geometry.y;
    const longitude = location.geometry.x;


    const marker = L.circleMarker([latitude, longitude], {
        radius: 8,
        color: categoryColors.cooling,
        fillColor: categoryColors.cooling,
        fillOpacity: 0.8
    }).addTo(nycMap);
   
    markerGroups.cooling.push(marker);


    marker.bindPopup(`
        <h3>${location.attributes.Facility_name}</h3>


        <p>
            <strong>Address:</strong>
            ${location.attributes.Address}
        </p>


        <p>
            <strong>Borough:</strong>
            ${location.attributes.Borough_name}
        </p>


        <p>
            <strong>Accessibility:</strong>
            ${location.attributes.Accessible}
        </p>


        <p>
            <strong>Phone:</strong>
            ${location.attributes.Phone}
        </p>
    `);


});


    })
    .catch(error => {
        console.error("Error loading cooling centers:", error);
    });


    //Auto marker maker for activities (Parks , Entertainment, Food)
//activities

const parksAPI =
    "https://data.cityofnewyork.us/resource/enfh-gkve.geojson?$limit=500";


function createActivityMarker(latitude, longitude, name, category, address) {

    const activityMarker = L.circleMarker(
        [latitude, longitude],
        {
            radius: 8,
            color: categoryColors.activities,
            fillColor: categoryColors.activities,
            fillOpacity: 0.8
        }
    ).addTo(nycMap);

    markerGroups.activities.push(activityMarker);

    activityMarker.bindPopup(`
        <h3>${name}</h3>

        <p>
            <strong>Category:</strong>
            ${category}
        </p>

        <p>
            <strong>Address:</strong>
            ${address}
        </p>

        <p>
            <strong>Accessibility:</strong><br>
            Contact the facility for specific accessibility information.
        </p>
    `);
}


function getPolygonCenter(coordinates) {

    let points = [];

    function collectPoints(coords) {

        if (
            Array.isArray(coords) &&
            coords.length >= 2 &&
            typeof coords[0] === "number" &&
            typeof coords[1] === "number"
        ) {

            points.push(coords);

        } else if (Array.isArray(coords)) {

            coords.forEach(collectPoints);

        }

    }

    collectPoints(coordinates);


    if (points.length === 0) {
        return null;
    }


    let totalLongitude = 0;
    let totalLatitude = 0;


    points.forEach(point => {

        totalLongitude += point[0];
        totalLatitude += point[1];

    });


    return {
        longitude: totalLongitude / points.length,
        latitude: totalLatitude / points.length
    };
}


fetch(parksAPI)
.then(response => {

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();

})
.then(data => {

    console.log("Parks GeoJSON:", data);

    console.log(
        "Number of park records:",
        data.features.length
    );


    data.features.forEach(location => {

        if (
            !location.geometry ||
            !location.geometry.coordinates
        ) {
            return;
        }


        const center = getPolygonCenter(
            location.geometry.coordinates
        );


        if (!center) {
            return;
        }


        const properties = location.properties || {};


        createActivityMarker(

            center.latitude,
            center.longitude,

            properties.park_name ||
            properties.name ||
            "NYC Park",

            properties.typecategory ||
            properties.subcategory ||
            "Park",

            properties.address ||
            properties.location ||
            "NYC"

        );

    });


    console.log(
        "Activities after parks:",
        markerGroups.activities.length
    );

})
.catch(error => {

    console.error(
        "Error loading parks:",
        error
    );

});














//food

const foodAPI =
    "https://data.cityofnewyork.us/resource/43nn-pn8j.json" +
    "?$select=camis,dba,building,street,boro,zipcode,latitude,longitude,grade,cuisine_description,inspection_date" +
    "&$where=latitude IS NOT NULL " +
    "AND longitude IS NOT NULL " +
    "AND latitude != 0 " +
    "AND longitude != 0 " +
    "&$order=inspection_date DESC" +
    "&$limit=5000";


function createFoodMarker(
    latitude,
    longitude,
    name,
    address,
    cuisine,
    grade
) {

    const foodMarker = L.circleMarker(
        [latitude, longitude],
        {
            radius: 8,
            color: categoryColors.food,
            fillColor: categoryColors.food,
            fillOpacity: 0.8
        }
    ).addTo(nycMap);


    markerGroups.food.push(foodMarker);


    foodMarker.bindPopup(`
        <h3>${name}</h3>

        <p>
            <strong>Category:</strong>
            Food & Drink
        </p>

        <p>
            <strong>Cuisine:</strong>
            ${cuisine || "Not available"}
        </p>

        <p>
            <strong>Address:</strong>
            ${address}
        </p>

        <p>
            <strong>Health Grade:</strong>
            ${grade || "Not available"}
        </p>

        <p>
            <strong>Accessibility:</strong><br>
            Contact the facility for specific accessibility information.
        </p>
    `);
}


fetch(foodAPI)
.then(response => {

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    return response.json();

})
.then(data => {

    console.log(
        "Food inspection records:",
        data.length
    );


    const restaurants = new Map();


    data.forEach(location => {

        const latitude =
            parseFloat(location.latitude);

        const longitude =
            parseFloat(location.longitude);


        if (
            isNaN(latitude) ||
            isNaN(longitude)
        ) {
            return;
        }


        const restaurantID =
            location.camis ||
            `${latitude},${longitude},${location.dba}`;


     
        if (!restaurants.has(restaurantID)) {

            restaurants.set(
                restaurantID,
                location
            );

        }

    });


    console.log(
        "Unique food locations:",
        restaurants.size
    );


    restaurants.forEach(location => {

        const latitude =
            parseFloat(location.latitude);

        const longitude =
            parseFloat(location.longitude);


        const address =
            `${location.building || ""} ` +
            `${location.street || ""}, ` +
            `${location.boro || ""} ` +
            `${location.zipcode || ""}`;


        createFoodMarker(

            latitude,
            longitude,

            location.dba ||
            "Food Location",

            address,

            location.cuisine_description,

            location.grade

        );

    });


    console.log(
        "Food markers loaded:",
        markerGroups.food.length
    );

})
.catch(error => {

    console.error(
        "Error loading food locations:",
        error
    );

});


//trash API
const trashAPI =
    "https://data.cityofnewyork.us/resource/8znf-7b2c.json?$limit=5000";

fetch(trashAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {

        console.log("Trash API response:", data);
        console.log("First trash record:", data[0]);

        data.forEach(location => {

            if (!location.point ||
                !location.point.coordinates) {
                console.log("No coordinates:", location);
                return;
            }

            const longitude =
                parseFloat(location.point.coordinates[0]);

            const latitude =
                parseFloat(location.point.coordinates[1]);

            if (isNaN(latitude) || isNaN(longitude)) {
                return;
            }

            const trashMarker = L.marker(
                [latitude, longitude],
                {
                    icon: L.divIcon({
                        className: "trash-marker",

                        html: `
                            <div class="trash-dot"></div>
                        `,

                        iconSize: [18, 18],
                        iconAnchor: [9, 9]
                    })
                }
            );

            trashMarker.bindPopup(`
                <h3>Recycling Bin</h3>

                <p>
                    <strong>Location:</strong><br>
                    ${location.location_description || "NYC"}
                </p>

                <p>
                    <strong>Site Type:</strong><br>
                    ${location.baskettype || "Public Recycling Bin"}
                </p>
            `);

            markerGroups.trash.push(trashMarker);
            trashCluster.addLayer(trashMarker);
        });

        trashCluster.addTo(nycMap);

        console.log(
            "Trash markers in cluster:",
            markerGroups.trash.length
        );
    })
    .catch(error => {
        console.error(
            "Error loading recycling bins:",
            error
        );
    });


    // gas station API
const gasAPI =
"https://data.ny.gov/resource/wn3j-2ia4.json?$limit=1000";

function isInNYC(lat, lng) {
    return (
        lat >= 40.4774 &&
        lat <= 40.9176 &&
        lng >= -74.2591 &&
        lng <= -73.7004
    );
}

fetch(gasAPI)
.then(response => response.json())
.then(data => {

    data.forEach(location => {

        if (!location.georeference) {
            return;
        }

        const coordinates = location.georeference.coordinates;

        const longitude = parseFloat(coordinates[0]);
        const latitude = parseFloat(coordinates[1]);

        if (isNaN(latitude) || isNaN(longitude)) {
            return;
        }

        if (!isInNYC(latitude, longitude)) {
            return;
        }

        const gasMarker = L.circleMarker(
            [latitude, longitude],
            {
                radius: 8,
                color: categoryColors.gas,
                fillColor: categoryColors.gas,
                fillOpacity: 0.8
            }
        ).addTo(nycMap);

        markerGroups.gas.push(gasMarker);

        gasMarker.bindPopup(`
            <h3>${location.station_name || "Gas Station"}</h3>

            <p>
                <strong>Address:</strong><br>
                ${location.address || "N/A"}<br>
                ${location.city || ""}, ${location.st || ""} ${location.zip || ""}
            </p>

            <p>
                <strong>Accessibility:</strong><br>
                Contact the station for specific accessibility information.
            </p>
        `);

    });

    console.log(
        "Gas stations loaded:",
        markerGroups.gas.length
    );

})
.catch(error => {
    console.error(
        "Error loading gas stations:",
        error
    );
});



// library API
const libraryAPI =
    "https://data.cityofnewyork.us/api/v3/views/feuq-due4/query.geojson?accessType=DOWNLOAD";

fetch(libraryAPI)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
    })
    .then(data => {

        console.log("Library API response:", data);
        console.log("Library features:", data.features.length);
        console.log("First library:", data.features[0]);

        data.features.forEach(location => {

            if (!location.geometry ||
                !location.geometry.coordinates) {
                return;
            }

            const longitude =
                parseFloat(location.geometry.coordinates[0]);

            const latitude =
                parseFloat(location.geometry.coordinates[1]);

            if (isNaN(latitude) || isNaN(longitude)) {
                return;
            }

            const libraryMarker = L.circleMarker(
                [latitude, longitude],
                {
                    radius: 8,
                    color: categoryColors.libraries,
                    fillColor: categoryColors.libraries,
                    fillOpacity: 0.8
                }
            ).addTo(nycMap);

            markerGroups.libraries.push(libraryMarker);

            const properties = location.properties || {};

            libraryMarker.bindPopup(`
                <h3>
                    ${properties.name ||
                      properties.facname ||
                      properties.facility_name ||
                      "Library"}
                </h3>

                <p>
                <strong>Address:</strong><br>
                ${properties.housenum || ""} ${properties.streetname || ""}
                </p>

                <p>
                    <strong>Accessibility:</strong><br>
                    Contact the library for specific accessibility information.
                </p>
            `);

        });

        console.log(
            "Libraries loaded:",
            markerGroups.libraries.length
        );

    })
    .catch(error => {
        console.error(
            "Error loading libraries:",
            error
        );
    });