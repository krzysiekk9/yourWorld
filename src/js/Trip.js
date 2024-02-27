export default class Trip {
  _data;
  _parentElement = document.querySelector(".form");

  // constructor(name, coords, date, duration) {
  //   this.name = name;
  //   this.coords = coords;
  //   this.date = date;
  //   this.duration = duration;
  // }
  _setDescription() {
    this.description = console.log("description", this.date);
  }
  render(data) {
    this._data = data;

    const markup = this._generateMarkup();

    this._parentElement.insertAdjacentHTML("afterend", markup);
  }
}
