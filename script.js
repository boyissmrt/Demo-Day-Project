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
    radius: 8,
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
    radius:8,
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
    radius:8,
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
    radius:8,
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
    radius:8,
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
