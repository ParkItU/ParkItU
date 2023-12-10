import api from "../plugins/api.js";

class GarageService {
    async getAllGarages() {
        const response = await api.get("/garages/");
        return response.data;
    }

    async createGarage(garageData) {
        try {
            const response = await api.post("/garages/", garageData);
            return response.data;
        } catch (error) {
            console.error("Error creating garage:", error);
            throw error;
        }
    }
}

export default new GarageService();
