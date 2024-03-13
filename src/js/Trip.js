export default class Trip {
  _data;
  _parentElement = document.querySelector(".form");

  _setDescription() {
    //TODO fix description dunction
    this.description = console.log("description", this.date);
  }
  render(data) {
    this._data = data;

    const markup = this._generateMarkup();

    this._parentElement.insertAdjacentHTML("afterend", markup);
  }
}
