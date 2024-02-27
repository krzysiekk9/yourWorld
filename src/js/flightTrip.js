import Trip from "./Trip.js";

class Flight extends Trip {
  typeOfTrip = "flight";
  //   constructor(name, coords, date, duration, ticketCost) {
  //     super(name, coords, date, duration);
  //     this.ticketCost = ticketCost;
  //   }

  _generateMarkup() {
    return `
            <li data-id="123" class="bg-gray-800/80 rounded-md p-2 border-l-4 border-cyan-500 mb-2">
                <div class="flex flex-row">
                    <h2 class='pr-1'>${this._data.name}</h2>
                    <h3>on ${this._data.date}</h3>
                </div>
                <div class="flex flex-row justify-evenly">
                    <div class="trip__details pr-8">
                        <span class="trip__icon">✈️</span>
                        <span class="trip__value">${this._data.distance}</span>
                        <span class="trip__unit">km</span>
                    </div>
                    <div class="workout__details">
                        <span class="workout__icon">⏱</span>
                        <span class="workout__value">${this._data.duration}</span>
                        <span class="workout__unit">days</span>
                    </div>
                    <div class="trip__details">
                        <span class="trip__icon">💰</span>
                        <span class="trip__value">${this._data.ticketCost}</span>
                        <span class="trip__unit">$</span>
                    </div>
                </div>
            </li>
        `;
  }
}

export default new Flight();