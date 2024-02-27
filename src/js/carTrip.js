import Trip from "./Trip.js";

class Car extends Trip {
  typeOfTrip = "car";
  // constructor(
  //   name,
  //   coords,
  //   date,
  //   duration,
  //   distance,
  //   gasPrice,
  //   avgFuelConsumption
  // ) {
  //   super(name, coords, date, duration);
  //   this.distance = distance;
  //   this.gasPrice = gasPrice;
  //   this.avgFuelConsumption = avgFuelConsumption;
  //   this._setDescription();
  //   this.tripCost = this.calcCost();
  // }
  calcCost() {
    return (
      Math.round(
        ((+this.distance * +this.avgFuelConsumption) / 100) *
          this.gasPrice *
          100
      ) / 100
    );
  }

  _generateMarkup() {
    return `
        <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-pink-500 mb-2">
            <div class="flex flex-row">
                <h2 class="pr-1">${this._data.name}</h2>
                <h3> on ${this._data.date}</h3>
            </div>
            <div class="flex flex-row justify-evenly">
                <div class="trip__details pr-8">
                    <span class="trip__icon">🚗</span>
                    <span class="trip__value">${this._data.distance}</span>
                    <span class="trip__unit">km</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${this._data.duration}</span>
                    <span class="workout__unit">h</span>
                </div>
                <div class="trip__details">
                    <span class="trip__icon">💰</span>
                    <span class="trip__value">${this._data.tripCost}</span>
                    <span class="trip__unit">$</span>
                </div>
            </div>
        </li>
    `;
  }
}

export default new Car();