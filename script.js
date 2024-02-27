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
const formElevationGain = document.querySelector(".form__elevation-gain");
const inputElevationGain = document.querySelector(
  ".form__input--elevation-gain"
);
const formFuel = document.querySelector(".form__fuel");
const inputFuelCost = document.querySelector(".form__input--fuel-cost");
const inputAvgFuelConsumption = document.querySelector(
  ".form__input--average-fuel-consumption"
);
const formTicketCost = document.querySelector(".form__ticket-cost");
const inputTicketCost = document.querySelector(".form__input--ticket-cost");

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
  constructor(name, coords, date, duration, stepsNum) {
    super(name, coords, date, duration);
    this._setDescription();
    this.stepsNum = stepsNum;
    this.peace = this.calcPace();
  }
  calcPace() {
    return Math.round((+this.stepsNum / +this.duration) * 10) / 10;
  }
}

class Cycling extends Trip {
  typeOfTrip = "cycling";
  constructor(name, coords, date, duration, distance, elevationGain) {
    super(name, coords, date, duration);
    this.distance = distance;
    this.elevationGain = elevationGain;
    this._setDescription();
    this.speed = this.calcSpeed();
  }
  calcSpeed() {
    return Math.round((+this.distance / +this.duration) * 100) / 100;
  }
}

class Car extends Trip {
  typeOfTrip = "car";
  constructor(
    name,
    coords,
    date,
    duration,
    distance,
    gasPrice,
    avgFuelConsumption
  ) {
    super(name, coords, date, duration);
    this.distance = distance;
    this.gasPrice = gasPrice;
    this.avgFuelConsumption = avgFuelConsumption;
    this._setDescription();
    this.tripCost = this.calcCost();
  }
  calcCost() {
    return (
      Math.round(
        ((+this.distance * +this.avgFuelConsumption) / 100) *
          this.gasPrice *
          100
      ) / 100
    );
  }
}

class Flight extends Trip {
  typeOfTrip = "flight";
  constructor(name, coords, date, duration, ticketCost) {
    super(name, coords, date, duration);
    this.ticketCost = ticketCost;
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

  _hideForm() {
    form.classList.add("hidden");
  }

  _onMapClick(e) {
    const { lat, lng } = e.latlng;
    this.#coords = [lat, lng];
    L.marker([lat, lng], {
      icon: this.#markerIcon,
    }).addTo(this.#map);
    this._showForm();
    this._onTripTypeChange();
  }

  _onTripTypeChange() {
    inputType.addEventListener("change", (e) => {
      let option = e.target.value;
      this._hideUnnecessaryFields();
      if (option === "hike") {
        inputDistance.placeholder = "steps";
        inputDuration.placeholder = "min";
      }
      if (option === "cycling") {
        inputDuration.placeholder = "min";
        inputDistance.placeholder = "km";
        formElevationGain.classList.remove("hidden");
      }
      if (option === "car") {
        inputDuration.placeholder = "h";
        inputDistance.placeholder = "km";
        formFuel.classList.remove("hidden");
      }
      if (option === "flight") {
        inputDistance.placeholder = "km";
        inputDuration.placeholder = "days";
        formTicketCost.classList.remove("hidden");
      }
    });
  }

  _hideUnnecessaryFields() {
    formElevationGain.classList.add("hidden");
    formFuel.classList.add("hidden");
    formTicketCost.classList.add("hidden");
  }

  _onFormSubmition() {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("type", inputType.value);
      switch (inputType.value) {
        case "flight":
          console.log("aaa"); //name, coords, date, duration, ticketCost
          console.log(inputTicketCost.value);
          this.#newTrip = new Flight(
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value,
            inputTicketCost.value
          );
          break;
        case "car":
          this.#newTrip = new Car( //name, coords, date, duration, drivenDistance, gasPric name,
            // coords,
            // date,
            // duration,
            // drivenDistance,
            // gasPrice,
            // avgFuelConsumption
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value,
            inputFuelCost.value,
            inputAvgFuelConsumption.value
          );
          break;
        case "cycling": //name, coords, date, duration, distance, elevationGain
          this.#newTrip = new Cycling(
            inputName.value,
            this.#coords,
            inputDate.value,
            inputDuration.value,
            inputDistance.value,
            inputElevationGain.value
          );
          break;
        case "hike": //name, coords, date, duration, stepsNum
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
      this._hideForm();
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
    let html = ``;
    if (typeOfTrip === "hike") {
      console.log("rest", rest);
      html = `
          <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-green-500 mb-2">
            <div class="flex flex-row">
              <h2 class="pr-1">${name}</h2>
              <h3>on ${date}</h3>
            </div>
            <div class="flex flex-row justify-around">
              <div class="trip__details pr-3">
                <span class="trip__icon">👟</span>
                <span class="trip__value">${rest.stepsNum}</span>
                <span class="trip__unit">steps</span>
              </div>
              <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${duration}</span>
                <span class="workout__unit">min</span>
              </div>
                <div class="trip__details flex justify-center">
                <span class="trip__icon pr-1">⚡</span>
                <span class="trip__value pr-1">${rest.peace}</span>
                <span class="trip__unit">steps/min</span>
                </div>
              </div>
          </li>
    `;
    }
    if (typeOfTrip === "cycling") {
      html = `
      <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-amber-500 mb-2">
        <div class="flex flex-row">
          <h2 class="pr-1">${name}</h2>
          <h3> on ${date}</h3>
        </div>
          <div class="flex flex-row justify-around">
          <div class="trip__details pr-8">
            <span class="trip__icon">🚲</span>
            <span class="trip__value">${distance}</span>
            <span class="trip__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">min</span>
          </div>
        </div>
        <div class="flex flex-row justify-around">
          <div class="trip__details">
            <span class="trip__icon">⚡</span>
            <span class="trip__value">${rest.speed}</span>
            <span class="trip__unit pr-2">km/min</span>
          </div>
          ${
            rest.elevationGain
              ? `
          <div class="trip__details">
          <span class="trip__icon">⛰️</span>
          <span class="trip__value pr-1">${rest.elevationGain}</span>
          <span class="trip__unit">meters</span>
          </div>
          `
              : ""
          }
        </div>
      </li>
      `;
    }
    if (typeOfTrip === "car") {
      console.log("caar");
      html = `
        <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-pink-500 mb-2">
        <div class="flex flex-row">
            <h2 class="pr-1">${name}</h2>
            <h3> on ${date}</h3>
          </div>
          <div class="flex flex-row justify-evenly">
            <div class="trip__details pr-8">
              <span class="trip__icon">🚗</span>
              <span class="trip__value">${distance}</span>
              <span class="trip__unit">km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">⏱</span>
              <span class="workout__value">${duration}</span>
              <span class="workout__unit">h</span>
            </div>
              <div class="trip__details">
              <span class="trip__icon">💰</span>
              <span class="trip__value">${rest.tripCost}</span>
              <span class="trip__unit">$</span>
              </div>
            </div>
        </li>
        `;
    }
    if (typeOfTrip === "flight") {
      html = `
        <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-cyan-500 mb-2">
        <div class="flex flex-row">
          <h2 class='pr-1'>${name}</h2>
          <h3>on ${date}</h3>
        </div>
        <div class="flex flex-row justify-evenly">
          <div class="trip__details pr-8">
            <span class="trip__icon">✈️</span>
            <span class="trip__value">${distance}</span>
            <span class="trip__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${duration}</span>
            <span class="workout__unit">days</span>
            </div>
              <div class="trip__details">
              <span class="trip__icon">💰</span>
              <span class="trip__value">${rest.ticketCost}</span>
              <span class="trip__unit">$</span>
            </div>
          </div>
      </li>
        `;
    }

    form.insertAdjacentHTML("afterend", html);
  };
}
const app = new App();
