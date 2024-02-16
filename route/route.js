import express from 'express';
import uploadController from '../controller/uploadController.js';
import searchController from '../controller/searchController.js';
import userController from '../controller/userController.js';


const router = express.Router();

router.post('/upload',uploadController.upload)
router.get('/search/:username',searchController.searchByUsername);
router.get('/policyDetails/:userId',userController.getPolicy)

export default router;