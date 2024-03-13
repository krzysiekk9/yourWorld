import Trip from "./Trip.js";
import photos from "../../img/photos.png";

class Cycling extends Trip {
  typeOfTrip = "cycling";

  calcSpeed() {
    return Math.round((+this.distance / +this.duration) * 100) / 100;
  }
  _generateMarkup() {
    return `
    <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-amber-500 mb-2">
        <div class="flex flex-row">
            <div class="w-11/12">
                <div class="flex flex-row">
                    <h2 class="pr-1">${this._data.name}</h2>
                    <h3>on ${this._data.date}</h3>
                </div>
                <div class="flex flex-row justify-evenly">
                    <div class="trip__details pr-8">
                        <span class="trip__icon">🚲</span>
                        <span class="trip__value">${this._data.distance}</span>
                        <span class="trip__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${
                          this._data.duration
                        }</span>
                        <span class="workout__unit">min</span>
                    </div>
                    <div class="trip__details">
                        <span class="trip__icon">⚡</span>
                        <span class="trip__value">${this._data.speed}</span>
                        <span class="trip__unit pr-2">km/min</span>
                    </div>
                    ${
                      this._data.elevationGain
                        ? `
                    <div class="trip__details">
                        <span class="trip__icon">⛰️</span>
                        <span class="trip__value pr-1">${this._data.elevationGain}</span>
                        <span class="trip__unit">m</span>
                    </div>
                    `
                        : ""
                    }
                </div>
            </div>
            <div class="w-1/12 items-center flex">
                <img src=${photos} alt="photos" class="photos_icon"/>
            </div>
        </div>
    </li>
    `;
  }
}

export default new Cycling();
