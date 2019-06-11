document.addEventListener('DOMContentLoaded', function (){
    const stationsMap = document.querySelector('#stations-map');
    const stationDetailsContainer = document.querySelector('#station-details-container');
    const reservationForm = document.querySelector('#reservation-form');
    const bookBtn = document.querySelector('#reservation-form-book-btn');
    const signaturePadContainer = document.querySelector('#modal-signature-pad');
    const reservationStatus = document.querySelector('#reservation-status');

    const welcomeSlider = new window.Slider(document.querySelector('#welcome-slider'));
    const stationDetails = new window.StationDetails(stationDetailsContainer);
    const reservation = new window.Reservation(reservationForm, bookBtn, reservationStatus);
    const modalSignaturePad = new window.ModalBox(bookBtn);
    const signaturePad = new window.SignaturePad(signaturePadContainer, 450, 400);

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
                function onClick() {
                    stationDetails.setDetails(station);
                    stationDetails.createHtmlStructure();
                    reservationForm.style.display = null;
                }
                let marker = map.addMarker(station.position.lat, station.position.lng, station.address, onClick);
            })
            map.centerOnMarkers();
        }, function(status, statusText) {
            stationsMap.innerHTML = '<p>Une erreur s\'est produite lors du chargement de la carte</p>';
            console.error(status + statusText);
        })
    }

    if (stationsMap !== null) {
        initMap();
    }

    reservation.recoverUserIdentity();
    reservation.recoverReservationDetails();

    bookBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (reservationForm.lastName.value !== "" && reservationForm.firstName.value !== "") {
            modalSignaturePad.openBox(e);
        }
    })
    const signaturePadValidationBtn = document.querySelector('#signature-pad-validation-btn');
    signaturePadValidationBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (signaturePad.isEmpty()) {
            signaturePad.displayErrorText();
            return;
        }
        modalSignaturePad.closeBox(e);
        reservation.displayReservationDetails(stationDetails.address.innerHTML);
    })
})
