import api from "../plugins/api.js";

class CarService {
  async getAllCars() {
    const response = await api.get("/cars/");
    return response.data;
  }

  async createCar(carData) {
    try {
      const response = await api.post("/cars/", carData);
      return response.data;
    } catch (error) {
      console.error("Error creating car:", error);
      console.error("Response data:", error.response.data);
      throw error;
    }
  }
}

export default new CarService();