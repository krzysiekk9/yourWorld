// import jsVectorMap from "jsvectormap";
// import "jsvectormap/dist/maps/world.js";

// const map = new jsVectorMap({
//   selector: "#map",
//   map: "world",
//   visualizeData: {
//     scale: ["#C8EEFF", "#0071A4"],
//     values: {
//       PL: 29,
//       US: 1,
//       CA: 1,
//       BR: 75,
//       // ...
//     },
//   },
// });
import L from "leaflet";

import "leaflet/dist/leaflet.css";

const form = document.querySelector(".form");
const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputDate = document.querySelector(".form__input--date");
const inputDuration = document.querySelector(".form__input--duration");
const inputDistance = document.querySelector(".form__input--distance");
const inputFiles = document.querySelector(".form__input--photos");

class Trip {
  constructor(name, coords, date, duration) {
    this.name = name;
    this.coords = coords;
    this.date = date;
    this.duration = duration;
  }
  _setDescription() {
    this.description = console.log("description", this.date);
  }
}

class Hike extends Trip {
  typeOfTrip = "hike";
  constructor(name, coords, date, duration, distance) {
    super(name, coords, date, duration);
    this._setDescription();
    this.distance = distance;
    this.calcPace();
  }
  calcPace() {
    this.peace = 2; //this.stepsNum / duration;
    return this.peace;
  }
}

class Cycling extends Trip {
  typeOfTrip = "cycling";
  constructor(name, coords, date, duration, elevationGain) {
    super(name, coords, date, duration);
    this.elevationGain = elevationGain;
    this._setDescription();
  }
}

class Car extends Trip {
  typeOfTrip = "car";
  constructor(name, coords, date, duration, drivenDistance, gasPrice) {
    super(name, coords, date, duration);
    this.drivenDistance = drivenDistance;
    this.gasPrice = gasPrice;
    this._setDescription();
  }
}

class Flight extends Trip {
  typeOfTrip = "flight";
  constructor(name, coords, date, duration, ticketCost, flightDuration) {
    super(name, coords, date, duration);
    this.ticketCost = ticketCost;
    this.flightDuration = flightDuration;
  }
}

class App {
  #map;
  #mapZoom = 10;
  #trips = [];
  #newTrip;
  #coords = [];
  typeOfTrip = "";
  #markerIcon = L.icon({
    iconUrl: "./img/location-pin.png",
    // iconSize: [38, 95], // size of the icon
    // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    // popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
  });

  constructor() {
    this._loadMap();
    this._onFormSubmition();
  }

  _loadMap() {
    this.#map = L.map("map", {
      center: L.latLng(30, 0),
      zoom: this.#mapZoom,
    });

    L.tileLayer(
      "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.{ext}",
      {
        minZoom: 2,
        maxZoom: 15,
        attribution:
          '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        ext: "png",
      }
    ).addTo(this.#map);

    this.#map.setView([30, 0], 3);

    this.#map.on("click", this._onMapClick.bind(this));
  }

  _showForm() {
    form.classList.remove("hidden");
    inputName.focus();
  }

  _onMapClick(e) {
    const { lat, lng } = e.latlng;
    this.#coords = [lat, lng];
    L.marker([lat, lng], {
      icon: this.#markerIcon,
    }).addTo(this.#map);
    this._showForm();
  }

  _onFormSubmition() {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("type", inputType.value);
      switch (inputType.value) {
        case "flight":
          console.log("aaa"); //name, coords, date, duration, ticketCost, flightDuration
          this.#newTrip = new Flight(
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value,
            10, // CHANGE
            10
          );
          break;
        case "car":
          this.#newTrip = new Car( //name, coords, date, duration, drivenDistance, gasPric
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value,
            2
          );
          break;
        case "cycling":
          this.#newTrip = new Cycling(
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value
          );
          break;
        case "hike":
          this.#newTrip = new Hike(
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value
          );
          break;
      }
      this._renderWorkout(this.#newTrip);
    });
  }

  _renderWorkout = ({
    name,
    coords,
    date,
    duration,
    distance,
    typeOfTrip,
    ...rest
  }) => {
    let html;
    if (typeOfTrip === "hike") {
      html = `
          <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-green-500 mb-2">
            <h2>${name}</h2>
            <h3>Hike on ${date}</h3>
            <div class="trip__details">
              <span class="trip__icon">👟</span>
              <span class="trip__value">${distance}</span>
              <span class="trip__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${duration}</span>
              <span class="workout__unit">min</span>
            </div>
            <div class="trip__details">
              <span class="trip__icon">⚡</span>
              <span class="trip__value">50</span>
              <span class="trip__unit">steps/min</span>
            </div>
          </li>
    `;
    }
    if (typeOfTrip === "cycling") {
      html = `
      <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-blue-500 mb-2">
        <h2>${name}</h2>
        <h3>Hike on ${date}</h3>
        <div class="flex flex-row">
          <div class="trip__details pr-8">
            <span class="trip__icon">🚲</span>
            <span class="trip__value">${distance}</span>
            <span class="trip__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">h</span>
          </div>
        </div>
        <div class="trip__details">
          <span class="trip__icon">⚡</span>
          <span class="trip__value">50</span>
          <span class="trip__unit">steps/min</span>
        </div>
      </li>
      `;
    }
    if (typeOfTrip === "car") {
      console.log("caar");
      html = `
        <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-pink-500 mb-2">
          <h2>${name}</h2>
          <h3>Hike on ${date}</h3>
          <div class="flex flex-row">
            <div class="trip__details pr-8">
              <span class="trip__icon">🚗</span>
              <span class="trip__value">12000</span>
              <span class="trip__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">24</span>
              <span class="workout__unit">min</span>
            </div>
          </div>
          <div class="trip__details">
            <span class="trip__icon">⚡</span>
            <span class="trip__value">50</span>
            <span class="trip__unit">steps/min</span>
          </div>
        </li>
        `;
    }
    if (typeOfTrip === "flight") {
      html = `
        <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-cyan-500 mb-2">
        <h2>${name}</h2>
        <h3>Hike on ${date}</h3>
        <div class="flex flex-row">
          <div class="trip__details pr-8">
            <span class="trip__icon">✈️</span>
            <span class="trip__value">12000</span>
            <span class="trip__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">24</span>
            <span class="workout__unit">min</span>
          </div>
        </div>
        <div class="trip__details">
          <span class="trip__icon">⚡</span>
          <span class="trip__value">50</span>
          <span class="trip__unit">steps/min</span>
        </div>
      </li>
        `;
    }

    form.insertAdjacentHTML("afterend", html);
  };
}
const app = new App();
