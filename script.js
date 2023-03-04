
function setlocation(txt) {
    document.getElementById('loc').innerText = txt
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
            let url = `https://apis.mapmyindia.com/advancedmaps/v1/<YOUR LICENCE KEY>/rev_geocode?lat=${lat}&lng=${longi}`
            
            const response = await fetch(url);
            var data = await response.json();
            console.log(data.results[0])
            
            let pk = `${data.results[0].formatted_address}`
            setlocation(pk)
        }
    })

   