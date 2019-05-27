document.addEventListener('DOMContentLoaded', function (){
    let welcomeSlider = new window.Slider(document.querySelector('#welcome-slider'));

    const stationsMap = document.querySelector('#stations-map');
    const initMap = async function() {
        let map = new window.LeafletMap('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.');
        await map.loadMap(stationsMap);
        let requestStationsList = new window.Request('https://api.jcdecaux.com/vls/v1/stations')
        requestStationsList.setParams({
            'contract': 'nantes',
            'apiKey': '3ce01edd3b8a04bb2a11192cf0fc8d3075b204cc'
        })
        requestStationsList.execute(function(parsedDatas) {
            let stationsList = parsedDatas;
            stationsList.forEach((station) => {
                let marker = map.addMarker(station.position.lat, station.position.lng, station.address);
            })
            map.centerOnMarkers();
        }, function(status, statusText) {
            console.error(status + statusText);
        })
    }
    if (stationsMap !== null) {
        initMap();
    }
})
