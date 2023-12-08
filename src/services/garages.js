import api from "../plugins/api.js";

class GarageService {
    async getAllGarages() {
        try {
            const response = await api.get("/garages/");
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error("Error fetching garages:", error);
            throw error;
        }
    }

    async getGarageById(garageId) {
        try {
            const response = await api.get(`/garages/${garageId}/`);
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error("Error fetching garage:", error);
            throw error;
        }
    }

    async createGarage(garageData) {
        try {
            const response = await api.post("/garages/", garageData);
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error("Error creating garage:", error);
            throw error;
        }
    }

    async updateGarage(garageId, garageData) {
        try {
            const response = await api.put(`/garages/${garageId}/`, garageData);
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error("Error updating garage:", error);
            throw error;
        }
    }

    async deleteGarage(garageId) {
        try {
            const response = await api.delete(`/garages/${garageId}/`);
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error("Error deleting garage:", error);
            throw error;
        }
    }
}

export default new GarageService();
