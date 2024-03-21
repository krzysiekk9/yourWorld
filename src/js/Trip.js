export default class Trip {
  _data;
  _id;
  _uploadWithImages;
  _parentElement = document.querySelector(".form");

  _setDescription() {
    //FIXME description function
    this.description = console.log("description", this.date);
  }
  render(data, id, uploadWithImages) {
    this._data = data;
    this._id = id;
    this._uploadWithImages = uploadWithImages;

    const markup = this._generateMarkup();

    this._parentElement.insertAdjacentHTML("afterend", markup);
  }
}
