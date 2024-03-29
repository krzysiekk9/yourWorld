import Trip from "./Trip.js";
import photos from "../../img/photos.png";

class Hike extends Trip {
  typeOfTrip = "hike";

  calcPace() {
    return Math.round((+this._data.distance / +this._data.duration) * 10) / 10;
  }
  _generateMarkup() {
    return `
            <li id=${
              this._id
            } class="bg-gray-800/80 rounded-md p-2 border-l-4 border-green-500 mb-2">
                <div class="flex flex-row">
                    <div class="w-11/12">
                        <div class="flex flex-row">
                            <h2 class="pr-1">${this._data.name}</h2>
                            <h3>on ${this._data.date}</h3>
                        </div>
                        <div class="flex flex-row justify-evenly">
                            <div class="trip__details pr-3">
                                <span class="trip__icon">👟</span>
                                <span class="trip__value">${
                                  this._data.distance
                                }</span>
                                <span class="trip__unit">steps</span>
                            </div>
                            <div class="workout__details">
                                <span class="workout__icon">⏱</span>
                                <span class="workout__value">${
                                  this._data.duration
                                }</span>
                                <span class="workout__unit">min</span>
                            </div>
                            <div class="trip__details flex justify-center">
                                <span class="trip__icon pr-1">⚡</span>
                                <span class="trip__value pr-1">${this.calcPace()}</span>
                                <span class="trip__unit">steps/min</span>
                            </div>
                        </div>
                    </div>
                    ${
                      this._data.with_images
                        ? `  <div class="w-1/12 items-center flex">
                            <img src=${photos} alt="photos" class="photos_icon" />
                        </div>
                     `
                        : ""
                    }
                </div>
            </li>
        `;
  }
}

export default new Hike();
