import locationsRepository from '../repositories/locationRepository.js';

const getStates = async () => {
    return locationsRepository.getStates();
};

const getLocationById = async (id) => {
    return locationsRepository.getLocationById(id);
};

const getCityByState = async (state) => {
    return locationsRepository.getCityByState(state);
};

const getIdByStateAndCity = async (city, state) => {
    return locationsRepository.getIdByStateAndCity(city, state);
};

export default {
    getStates,
    getLocationById,
    getCityByState,
    getIdByStateAndCity,
};
