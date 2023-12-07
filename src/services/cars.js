import api from "../plugins/api.js";

class CarService {
  async getAllCars() {
    const response = await api.get("/cars/");
    return response.data;
  }
  async deleteCar(car) {
    const response = await api.delete("/cars/${car.id}/");
    return response.data;
  }
}

export default new CarService();
