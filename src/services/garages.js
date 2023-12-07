import api from "../plugins/api.js";

class GarageService {
    async getAllGarages() {
        const response = await api.get("/garages/");
        return response.data;
    }
    async deleteGarage(garageId) {
        try {
            const response = await api.delete(`/garages/${garageId}/`);
            return response.data;
        } catch (error) {
            // Trate os erros conforme necessário
            console.error('Error deleting garage:', error);
            throw error;
        }
    }
}

export default new GarageService();