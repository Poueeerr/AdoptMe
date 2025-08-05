import express from 'express';
import locationController from '../controllers/locationController.js';

const router = express.Router();

router.get('/states', locationController.getStates);
router.get('/getCity/:state', locationController.getCityByState);
router.get('/:state/:city', locationController.getIdByStateAndCity);
router.get('/:id', locationController.getLocationById);

export default router;

