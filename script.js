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

import hikeTrip from "./src/js/hikeTrip";
import cyclingTrip from "./src/js/cyclingTrip";
import carTrip from "./src/js/carTrip";
import flightTrip from "./src/js/flightTrip";

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

class App {
  #map;
  #mapZoom = 10;
  #trips = [];
  #markerIcon = L.icon({
    iconUrl: "./img/location-pin.png",
  });
  tripDetails = {
    name: "",
    coords: [],
    date: "",
    duration: 0,
    distance: 0,
    elevationGain: 0,
    fuelCost: 0,
    avgFuelConsumption: 0,
    ticketCost: 0,
    tripType: "",
  };

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
    this.tripDetails.coords = [lat, lng];
    L.marker([lat, lng], {
      icon: this.#markerIcon,
    }).addTo(this.#map);
    this._showForm();
    this._onTripTypeChange();
  }

  _onTripTypeChange() {
    inputType.addEventListener("change", (e) => {
      this.tripDetails.tripType = e.target.value;
      this._hideUnnecessaryFields();
      if (this.tripDetails.tripType === "hike") {
        inputDistance.placeholder = "steps";
        inputDuration.placeholder = "min";
      }
      if (this.tripDetails.tripType === "cycling") {
        inputDuration.placeholder = "min";
        inputDistance.placeholder = "km";
        formElevationGain.classList.remove("hidden");
      }
      if (this.tripDetails.tripType === "car") {
        inputDuration.placeholder = "h";
        inputDistance.placeholder = "km";
        formFuel.classList.remove("hidden");
      }
      if (this.tripDetails.tripType === "flight") {
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

      this.tripDetails = {
        name: inputName.value,
        date: inputDate.value,
        duration: inputDuration.value,
        distance: inputDistance.value,
        elevationGain: inputElevationGain.value,
        fuelCost: inputFuelCost.value,
        avgFuelConsumption: inputAvgFuelConsumption.value,
        ticketCost: inputTicketCost.value,
        tripType: inputType.value,
        photos: inputFiles.files[0],
      };

      switch (this.tripDetails.tripType) {
        case "flight":
          flightTrip.render(this.tripDetails);
          break;
        case "car":
          carTrip.render(this.tripDetails);
          break;
        case "cycling":
          cyclingTrip.render(this.tripDetails);
          break;
        case "hike":
          hikeTrip.render(this.tripDetails);
          break;
      }
      const formData = new FormData(form);
      // console.log("newForm", ...formData);

      if (formData.get("file").name !== "" && formData.get("file").size !== 0) {
        const formFiles = new FormData();

        for (let i = 0; i < inputFiles.files.length; i++) {
          formFiles.append("files", inputFiles.files[i]);
        }

        fetch("http://localhost:3000/api/photosUpload", {
          method: "post",
          body: formFiles,
        })
          .then((res) => res.json())
          .then((data) => console.log(data));
      }

      formData.delete("file");

      // console.log(this.tripDetails);
      // fetch("http://localhost:3000/api/tripDetails", {
      //   method: "post",
      //   body: formData,
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data));

      this._hideForm();
    });
  }
}
const app = new App();
