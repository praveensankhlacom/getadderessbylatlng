// Global Function
function setlocation(txt, txt2, txt3) {
    document.getElementById('loc').innerText = txt
    document.getElementById('range').innerText = txt2
    document.getElementById('latlong').innerText = txt3
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000; // Earth's radius in meters
    const deltaLat = (lat2 - lat1) * (Math.PI / 180);
    const deltaLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
    
    return distance;
}

// Function to check if the given latitude and longitude are within the specified range
function isWithinRange(latitude1,longitude1,latitude2,longitude2,rangeMeters) 
{
    const distance = calculateDistance(latitude1,longitude1,latitude2,longitude2);
    return distance <= rangeMeters;
}

// for get lat long of 500m range using this function 
function getCoordinatesInRange(latitude, longitude, rangeMeters) {
    const earthRadius = 6371000; // Earth's radius in meters
    const maxDistance = rangeMeters / earthRadius;

    // Convert latitude and longitude to radians
    const latRad = latitude * (Math.PI / 180);
    const lonRad = longitude * (Math.PI / 180);

    // Generate a random angle in radians
    const randomAngle = Math.random() * 2 * Math.PI;

    // Calculate the new latitude and longitude
    const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(maxDistance) +
        Math.cos(latRad) * Math.sin(maxDistance) * Math.cos(randomAngle)
    );
    const newLonRad =
    lonRad +
    Math.atan2(
        Math.sin(randomAngle) * Math.sin(maxDistance) * Math.cos(latRad),
        Math.cos(maxDistance) - Math.sin(latRad) * Math.sin(newLatRad)
    );

    // Convert back to degrees
    const newLatitude = newLatRad * (180 / Math.PI);
    const newLongitude = newLonRad * (180 / Math.PI);

    return { latitude: newLatitude, longitude: newLongitude };
}


document.getElementById('submit').addEventListener('click', function getlocation() {
    const d = new Date(); var date = d.toLocaleDateString(); var time = d.toLocaleTimeString();

    if (navigator.geolocation) {
        let t = navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }

    async function showPosition(position) {
        position.coords
        let lat = position.coords.latitude
        let longi = position.coords.longitude
        let url = `https://apis.mapmyindia.com/advancedmaps/v1/{Your API Key}/rev_geocode?lat=${lat}&lng=${longi}`
        
        const response = await fetch(url);
        var data = await response.json();
        
        const currentLatitude = lat;
        const currentLongitude = longi;
        const rangeMeters = 500;

        let responseLatitude =  localStorage.getItem("responseLatitude")
        if(responseLatitude == null)
        {
            localStorage.setItem("responseLatitude", lat);
        }
        let responseLongitude = localStorage.getItem("responseLongitude")

        if(responseLongitude == null)
        {
            localStorage.setItem("responseLongitude", longi)
        }
        //const responseLatitude = 40.7126;
        //const responseLongitude = -74.0055;

        // for find user is in range or not 
        const isInRange = isWithinRange(currentLatitude, currentLongitude, responseLatitude, responseLongitude, rangeMeters);
        let pk2 = `User is in the verified Range location : ${isInRange}`

        // for lat long in  500 m range 
        const newCoordinates = getCoordinatesInRange(currentLatitude, currentLongitude, rangeMeters);
        let pk3  = `New Latitude and Longitude around 500 meter range from your current location is : ${newCoordinates.latitude}, ${newCoordinates.longitude}`

        let pk = `${data.results[0].formatted_address}`
        console.log(data.results);
        setlocation(pk, pk2, pk3)
    }
})
