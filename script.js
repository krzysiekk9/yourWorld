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
const imageIcon = document.querySelector(".photos_icon");
const tripList = document.querySelector(".trips");
const gallery = document.querySelector(".gallery");
const galleryImage = document.querySelector(".gallery-photo");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

class App {
  #map;
  #mapZoom = 10;
  #trips = [];
  // #markerIcon = L.icon({
  //   iconUrl: "./img/location-pin.png",
  //   //FIXME fix pin map and description
  // });
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

  defaultIcon = new L.icon({
    iconUrl: require("./node_modules/leaflet/dist/images/marker-icon.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    // popupAnchor: [0, -2],
  });
  constructor() {
    this._loadMap();
    this._onFormSubmition();
    this._onImageClick();
    //TODO generate list from db after opening app
    //TODO count visited countries and display other map
    //TODO add coorinates to each trip
    //TODO phone look
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
    L.marker([lat, lng], { icon: this.defaultIcon }).addTo(this.#map);
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

      const generateListItem = ({ tripDetails, tripId }, uploadWithImages) => {
        switch (tripDetails.tripType) {
          case "flight":
            flightTrip.render(tripDetails, tripId, uploadWithImages);
            break;
          case "car":
            carTrip.render(tripDetails, tripId, uploadWithImages);
            break;
          case "cycling":
            cyclingTrip.render(tripDetails, tripId, uploadWithImages);
            break;
          case "hike":
            hikeTrip.render(tripDetails, tripId, uploadWithImages);
            break;
        }
      };

      const formData = new FormData(form);
      //form with pictures added - photos upload needed
      if (formData.get("file").name !== "" && formData.get("file").size !== 0) {
        formData.delete("file");

        for (let i = 0; i < inputFiles.files.length; i++) {
          formData.append("files", inputFiles.files[i]);
        }

        fetch("http://localhost:3000/api/photosUpload", {
          method: "post",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success === false) {
              return alert(data.message);
            }
            const uploadWithImages = true;
            generateListItem(data, uploadWithImages);
          });
      } else {
        //form without images submitted
        const dataUpload = new URLSearchParams(formData);
        dataUpload.delete("file");
        fetch("http://localhost:3000/api/tripDetails", {
          method: "post",
          body: dataUpload,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success === false) {
              return alert(data.message);
            }
            const uploadWithImages = false;
            generateListItem(data, uploadWithImages);
          });
      }

      this._hideForm();
    });
  }

  _onImageClick() {
    tripList.addEventListener("click", (e) => {
      if (e.target.matches(".photos_icon")) {
        const elementId = e.target.closest("li").id;

        fetch(`http://localhost:3000/api/getPhotos/${elementId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success === true) {
              const imageUrlArr = data.imageArr[0].url;
              this._openGallery(imageUrlArr);
            }
          });
      }
    });
  }

  _openGallery(imageUrlArr) {
    gallery.classList.remove("hidden");
    let currentImage = 0; //currently viewed image

    galleryImage.src = imageUrlArr[currentImage]; //setting image url from AWS as a source of displayed image

    const closeGallery = document.querySelector(".close--gallery");
    closeGallery.addEventListener("click", (e) => {
      gallery.classList.add("hidden");
    });

    if (imageUrlArr.length > 1) {
      this._showArrows(currentImage, imageUrlArr);

      rightArrow.addEventListener("click", (e) => {
        if (currentImage < imageUrlArr.length - 1) {
          currentImage++;
          galleryImage.src = imageUrlArr[currentImage];
          this._showArrows(currentImage, imageUrlArr);
        }
      });

      leftArrow.addEventListener("click", (e) => {
        if (currentImage > 0) {
          currentImage--;
          galleryImage.src = imageUrlArr[currentImage];
          this._showArrows(currentImage, imageUrlArr);
        }
      });
    }
  }
  _showArrows(currentImage, imageUrlArr) {
    //if there is ony one photo arrows unnecessary
    //only need right arrow
    if (currentImage === 0) {
      rightArrow.classList.remove("hidden");
      leftArrow.classList.add("hidden");
    }
    //only need left arrow
    if (currentImage === imageUrlArr.length - 1) {
      rightArrow.classList.add("hidden");
      leftArrow.classList.remove("hidden");
    }
    if (currentImage > 0 && currentImage < imageUrlArr.length - 1) {
      leftArrow.classList.remove("hidden");
      rightArrow.classList.remove("hidden");
    }
  }
}
const app = new App();
