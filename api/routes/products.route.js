import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deleteproduct, getProducts, updateproduct } from '../controllers/products.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getproducts',getProducts);
router.delete('/deleteproduct/:productId/:userId', verifyToken, deleteproduct);
router.put('/updateproduct/:productId/:userId', verifyToken, updateproduct)


export default router;