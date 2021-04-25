//display user's IP address data on initial page load
document.onload = getIpData('', 'ipAddress');

///////////////////////////////////////////
///////////GET IP ADDRESS DATA/////////////
///////////////////////////////////////////

// Get DOM Elements
const inputSubmitButton = document.querySelector('.search-form__submit');
const input = document.querySelector('#ip-address');

// Add event listeners for input submission
inputSubmitButton.addEventListener('click', getInputContent);
input.addEventListener('keypress', getInputContent)

function getInputContent(e) {
    if (e.key === 'Enter' || e.type === 'click') {
        e.preventDefault();
        const inputType = ipAddressOrDomain(input.value);
        getIpData(input.value, inputType);
        input.value = '';
    }
}

//determine if input is IP address or domain
function ipAddressOrDomain(input) {
    if(input  
        .split('.')
        .every(block => block >= 0 && block <=255)) return 'ipAddress';
    return 'domain'
} 

//fetch IP data from API
function getIpData(input, inputType) {
    const apiKey = 'at_0NZU95erjF2tuCfpk63RCqKRPVI1O';
    const url = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&${inputType}=${input}`;
    fetch(url)
        .then(resp => resp.json())
        .then(data => {
            displayData(data);
            moveMap(data.location.lat, data.location.lng);
            addMarker(data.location.lat, data.location.lng);
        });
}

//TODO: add error message if not valid ip address or domain
//TODO: add message while page is waiting for data

///////////////////////////////////////////
/////////DISPLAY IP ADDRESS DATA///////////
///////////////////////////////////////////

function displayData(data) {
    console.log(data);
    const ip = data.ip;
    const location = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
    const timezone = `UTC ${data.location.timezone}`
    const isp = data.isp;

    document.querySelector('.ip').innerHTML = ip;
    document.querySelector('.location').innerHTML = location;
    document.querySelector('.timezone').innerHTML = timezone;
    document.querySelector('.isp').innerHTML = isp;
}

///////////////////////////////////////////
///////////////////MAP/////////////////////
///////////////////////////////////////////

//create map in #map div
const map = L.map('map', {zoomControl: false});
map.setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiMTVrd2FhbCIsImEiOiJja254a210MXcwbDhjMnFwcGNuMDk0OHRiIn0.eex65TN__8i9W1iltZ9txw'
}).addTo(map);

// icon settings for map marker
const mapIcon = L.icon({
    iconUrl: '../images/icon-location.svg',
});

//move map based on IP address data
function moveMap(lat, long){
    map.setView([lat, long], 13);
}

//add marker to map
function addMarker(lat, long){
    L.marker([lat, long], {icon: mapIcon}).addTo(map);
}