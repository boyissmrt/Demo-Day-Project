let nycMap = L.map('map').setView([40.7128,-74.0060], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(nycMap);

//category colors

const categoryColors = {
    cooling: "blue",
    activities: "green",
    trash: "orange",
    gas: "red",
    libraries: "purple"
};

//cooling marker setup

let coolingMark = L.circleMarker([40.7345,-73.9995],{
    radius: 5,
    color: categoryColors.cooling,
    fillColor:categoryColors.cooling,
    fillOpacity: 0.8
}).addTo(nycMap);


//cooling marker description
coolingMark.bindPopup(`
    <h3>Jefferson Market Library</h3>

    <p>
        <strong>Address:</strong>
        425 Avenue of the Americas, New York, NY
    </p>

   
        <strong>Hours:</strong>
        <ul>
        <li>Monday - Thursday: 10:00 AM - 8:00 PM </li>
        <li>Friday - Saturday: 10:00 AM - 5:00 PM </li>
        <li>Sunday: 1:00 PM - 5:00 PM </li>
        </ul>
   

    <p><strong>Accessibility:</strong></p>

    <ul>
        <li>Wheelchair accessible</li>
        <li>Elevator available</li>
        <li>Accessible seating</li>
    </ul>
`);

//activities marker

let activityMark = L.circleMarker([40.74838,-74.0020],{
    radius:5,
    color:categoryColors.activities,
    fillColor:categoryColors.activities,
    fillOpacity:.8
}).addTo(nycMap);

//activity marker description
activityMark.bindPopup(`
    <h3>Chelsea Recreation Center</h3>

    <p>
        <strong>Address:</strong>
        430 W 25th St, New York, NY 
    </p>

    
        <strong>Hours:</strong>
        <ul>
        <li>Monday - Friday: 7:00 AM - 8:00 PM </li>
        <li>Saturday: 8:00 AM - 4:00 PM </li>
        <li>Sunday: 8:00 AM - 2:00 PM </li>
        </ul>
    

    <p><strong>Accessibility:</strong></p>

    <ul>
        <li>Wheelchair accessible</li>
        <li>Accessible seating</li>
    </ul>
`);

//trash marker
let trashMark = L.circleMarker([40.7536,-73.9832],{
    radius:5,
    color:categoryColors.trash,
    fillColor:categoryColors.trash,
    fillOpacity:.8
}).addTo(nycMap);

trashMark.bindPopup(`
    <h3>Bryant Park</h3>

    <p>
        <strong>Address:</strong>
        Bryant Park, New York, NY
    </p>

   
        <strong>Hours:</strong>
        <ul>
        <li>Monday - Sunday: 7:00 AM - 11:00 PM </li>
        </ul>
   

    <p><strong>Accessibility:</strong></p>

    <ul>
        <li>Ramps</li>
        <li>Accessible Restrooms</li>
        <li>Public Transit</li>
        <li>Wheelchair accessible</li>
        <li>Accessible seating</li>
    </ul>
`);

//gas station marker
let gasMark = L.circleMarker([40.7567,-73.9980],{
    radius:5,
    color:categoryColors.gas,
    fillColor:categoryColors.gas,
    fillOpacity:.8
}).addTo(nycMap);
gasMark.bindPopup(`
    <h3>10 Ave Petroleum</h3>

    <p>
        <strong>Address:</strong>
        466 10th Ave, New York, NY
    </p>

   
        <strong>Hours:</strong>
        <ul>
        <li>Sunday - Saturday: Open 24/7 </li>
        </ul>
   

    <p><strong>Accessibility:</strong></p>

    <ul>
        <li>Accessible Restrooms</li>
        <li>Convenience store</li>
    </ul>
`);


//library marker
let libraryMark = L.circleMarker([40.7532,-73.9822],{
    radius:5,
    color:categoryColors.libraries,
    fillColor:categoryColors.libraries,
    fillOpacity:.8
}).addTo(nycMap);
libraryMark.bindPopup(`
    <h3>Stephen A. Schwarzman Building</h3>

    <p>
        <strong>Address:</strong>
        476 5th Ave, New York, NY
    </p>

   
        <strong>Hours:</strong>
        <ul>
        <li>Monday: 10:00 AM - 6:00 PM </li>
        <li>Tuesday - Wednesday: 10:00 AM - 8:00 PM </li>
        <li>Thursday - Saturday: 10:00 AM - 6:00 PM </li>
        <li>Sunday: CLOSED </li>

        </ul>
    

    <p><strong>Accessibility:</strong></p>

    <ul>
        <li>Accessible Restrooms</li>
        <li>Public Transit</li>
        <li>Wheelchair accessible</li>
        <li>Accessible seating</li>
    </ul>
`);


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
        radius: 5,
        color: categoryColors.cooling,
        fillColor: categoryColors.cooling,
        fillOpacity: 0.8
    }).addTo(nycMap);

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

const parksAPI = "https://data.cityofnewyork.us/resource/enfh-gkve.json?$limit=300";
const funAPI = "https://maps.mail.ru/osm/tools/overpass/api/interpreter";
const funQuery = `[out:json][timeout:25];
(
  node["leisure"="bowling_alley"](40.4774,-74.2591,40.9176,-73.7004);
  node["leisure"="amusement_arcade"](40.4774,-74.2591,40.9176,-73.7004);
  node["leisure"~"adult_gaming_centre|escape_game|ice_rink|miniature_golf"](40.4774,-74.2591,40.9176,-73.7004);
  node["amenity"="cinema"](40.4774,-74.2591,40.9176,-73.7004);
  node["sport"~"billiards|pool|laser_tag|darts"](40.4774,-74.2591,40.9176,-73.7004);
);
out 300;`;
const foodAPI = "https://data.cityofnewyork.us/resource/43nn-pn8j.json?$where=latitude%20IS%20NOT%20NULL%20AND%20latitude!=%270%27&$limit=200";

const funSpots = [
  { name: "Chinatown Fair Family Fun Center", lat: 40.7142, lng: -73.9980, category: "amusement_arcade", address: "8 Mott Street" },
  { name: "Dave & Buster's", lat: 40.7560, lng: -73.9888, category: "amusement_arcade", address: "234 West 42nd Street" },
  { name: "The Escape Game", lat: 40.7505, lng: -73.9785, category: "escape_game", address: "295 Madison Avenue" },
  { name: "SPIN New York", lat: 40.7408, lng: -73.9875, category: "table_tennis", address: "48 East 23rd Street" },
  { name: "AMC Empire 25", lat: 40.7563, lng: -73.9897, category: "cinema", address: "234 West 42nd Street" }
];

const boroughMap = {
  'M': 'Manhattan', 
  'B': 'Brooklyn', 
  'Q': 'Queens', 
  'X': 'Bronx', 
  'R': 'Staten Island',
  '1': 'Manhattan',
  '2': 'Bronx',
  '3': 'Brooklyn',
  '4': 'Queens',
  '5': 'Staten Island'
};

const activityLayerGroup = L.layerGroup().addTo(nycMap);

function renderActivityMarkers(parksData, foodData) {
  activityLayerGroup.clearLayers();

  if (Array.isArray(parksData)) {
    parksData.forEach(park => {
      let lat = parseFloat(park.lat || park.latitude);
      let lng = parseFloat(park.lon || park.longitude);

      if (isNaN(lat) && park.multipolygon && park.multipolygon.coordinates) {
        lng = park.multipolygon.coordinates[0][0][0][0];
        lat = park.multipolygon.coordinates[0][0][0][1];
      }

      if (!isNaN(lat) && !isNaN(lng)) {
        const parkMarker = L.circleMarker([lat, lng], {
          radius: 5,
          color: categoryColors.activities,
          fillColor: categoryColors.activities,
          fillOpacity: 0.8
        }).addTo(activityLayerGroup);

        const typeStr = park.typecategory || park.type || '';
        parkMarker.bindPopup(`
          <h3>${park.park_name || park.name || park.signname || "Park / Nature Spot"}</h3>
          <p><strong>Category:</strong> ${typeStr || "Outdoor Park / Nature"}</p>
          <p><strong>Borough:</strong> ${boroughMap[park.borough] || park.borough || "NYC"}</p>
          <p><strong>Address:</strong> ${park.location || park.address || "NYC Park Location"}</p>
        `);
      }
    });
  }

  if (Array.isArray(foodData)) {
    foodData.forEach(spot => {
      const lat = parseFloat(spot.latitude);
      const lng = parseFloat(spot.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        const foodMarker = L.circleMarker([lat, lng], {
          radius: 5,
          color: "#27ae60",
          fillColor: "#2ecc71",
          fillOpacity: 0.8
        }).addTo(activityLayerGroup);

        foodMarker.bindPopup(`
          <h3>${spot.dba || "Food Spot"}</h3>
          <p><strong>Category:</strong> Food & Drink Spot</p>
          <p><strong>Cuisine:</strong> ${spot.cuisine_description || "Eatery"}</p>
          <p><strong>Borough:</strong> ${spot.boro || "NYC"}</p>
          <p><strong>Address:</strong> ${spot.building || ''} ${spot.street || ''}</p>
        `);
      }
    });
  }
}

const cachedActivities = JSON.parse(localStorage.getItem("nycActivities") || "null");
if (cachedActivities) {
  renderActivityMarkers(cachedActivities.parks, cachedActivities.food);
}

Promise.all([
  fetch(parksAPI).then(res => res.ok ? res.json() : []).catch(() => []),
  fetch(foodAPI).then(res => res.ok ? res.json() : []).catch(() => [])
])
.then(([parksData, foodData]) => {
  if (parksData.length || foodData.length) {
    localStorage.setItem("nycActivities", JSON.stringify({ parks: parksData, food: foodData }));
    renderActivityMarkers(parksData, foodData);
  }
})
.catch(error => console.error("Error combining activities APIs:", error));

function addFunMarker(name, lat, lng, category, address) {
  const funMarker = L.circleMarker([lat, lng], {
    radius: 5,
    color: "#16a085",
    fillColor: "#1abc9c",
    fillOpacity: 0.85
  }).addTo(nycMap);

  funMarker.bindPopup(`
    <h3>${name}</h3>
    <p><strong>Category:</strong> ${category}</p>
    <p><strong>Type:</strong> ${category}</p>
    <p><strong>Address:</strong> ${address}</p>
  `);
}

funSpots.forEach(spot => {
  addFunMarker(spot.name, spot.lat, spot.lng, spot.category, spot.address);
});

const cachedFunSpots = JSON.parse(localStorage.getItem("nycFunSpots") || "null");
if (Array.isArray(cachedFunSpots)) {
  cachedFunSpots.forEach(venue => {
    const lat = parseFloat(venue.lat || venue.center?.lat);
    const lng = parseFloat(venue.lon || venue.center?.lon);
    if (!isNaN(lat) && !isNaN(lng)) {
      addFunMarker(
        venue.tags?.name || "Fun Activity Spot",
        lat,
        lng,
        venue.tags?.leisure || venue.tags?.sport || "Recreation",
        `${venue.tags?.['addr:housenumber'] || ''} ${venue.tags?.['addr:street'] || ''}`
      );
    }
  });
}

fetch(funAPI, { method: "POST", body: "data=" + encodeURIComponent(funQuery) })
  .then(res => res.ok ? res.json() : [])
  .then(data => {
    if (Array.isArray(data.elements) && data.elements.length) {
      localStorage.setItem("nycFunSpots", JSON.stringify(data.elements));
    }
    (data.elements || []).forEach(venue => {
      const lat = parseFloat(venue.lat || venue.center?.lat);
      const lng = parseFloat(venue.lon || venue.center?.lon);

      if (!isNaN(lat) && !isNaN(lng)) {
        addFunMarker(
          venue.tags?.name || "Fun Activity Spot",
          lat,
          lng,
          venue.tags?.leisure || venue.tags?.sport || "Recreation",
          `${venue.tags?.['addr:housenumber'] || ''} ${venue.tags?.['addr:street'] || ''}`
        );
      }
    });
  })
  .catch(error => console.error("Error loading fun activities:", error));
