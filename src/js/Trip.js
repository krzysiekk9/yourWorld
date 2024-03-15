export default class Trip {
  _data;
  _id;
  _parentElement = document.querySelector(".form");

  _setDescription() {
    //TODO fix description function
    this.description = console.log("description", this.date);
  }
  render(data, id) {
    this._data = data;
    this._id = id;

    const markup = this._generateMarkup();

    this._parentElement.insertAdjacentHTML("afterend", markup);
  }
}
