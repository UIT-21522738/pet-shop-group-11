const express = require('express');
const router = express.Router();

const ProductController = require('../app/controllers/ProductController');

//[POST] /products/create
router.post("/create",ProductController.pAddProduct);
//[GET] /product/totalpage
router.get("/totalpage",ProductController.getTotalPage);
// [GET] /products/get?p=...
router.get("/get", ProductController.getProducts);
//[POST] /products/searchbycategory
router.post("/searchbycategory",ProductController.pSearchByCategory);
//[POST] /products/searchbycode
router.post("/searchbycode",ProductController.pSearchByCode);
//[POST] /products/searchbyname
router.post("/searchbyname",ProductController.pSearchByName);

module.exports = router