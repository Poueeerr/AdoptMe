import locationServices from "../services/locationServices.js";

const getCityByState = async (req, res) => {
    const { state } = req.params;
    try {
        const response = await locationServices.getCityByState(state);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao buscar cidades.' });
    }
};

const getLocationById = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await locationServices.getLocationById(id);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao buscar local pelo ID.' });
    }
};

const getStates = async (req, res) => {
    try {
        const response = await locationServices.getStates();
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao buscar estados.' });
    }
};

const getIdByStateAndCity = async (req, res) => {
    const { state, city } = req.params;
    try {
        const response = await locationServices.getIdByStateAndCity(city, state);
        res.json(response);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao buscar ID por estado e cidade.' });
    }
};

export default {
    getCityByState,
    getLocationById,
    getStates,
    getIdByStateAndCity,
};
