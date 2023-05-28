const Product = require('../models/Products');
const Category = require('../models/Category');

class ProductController {
    // [POST] /products/create
    // thêm sản phẩm
    pAddProduct(req, res, next) {
        if (
            typeof req.body.name        === 'undefined' ||
            typeof req.body.price       === 'undefined' ||
            typeof req.body.storage     === 'undefined' ||
            typeof req.body.description === 'undefined' ||
            typeof req.body.type_id     === 'undefined' ||
            typeof req.body.code        === 'undefined'
        ) {
            res.statusCode =402; res.json({msg: "invalid data"});
            return;
        }
        
        Product.findOne({name: req.body.name})
        .then(data => {
            if (typeof data !== 'undefined') {
                res.statusCode =402; res.json({msg: "product exists"});
                return;
            }
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })

        Product.findOne({code: req.body.code})
        .then(data => {
            if (typeof data !== 'undefined') {
                res.statusCode =402; res.json({msg: "product exists"});
                return;
            }
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })

        var newProduct = new Product(req.body);
        newProduct.save()
        .then(() => {
            res.statusCode =200; res.json({msg:"success"});
        })
        .catch(err => {res.statusCode =500; res.json({msg: err.message});});
    }

    //[GET] /products/totalpage
    // lấy tổng số page
    getTotalPage(req, res, next) {
        Product.find({})
        .then(data => {
            res.statusCode =200; res.json({data: parseInt((data.length - 1) / 12) + 1});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({err: err.message}); return;});
    }

    // [GET] /products/get?p=...
    // lấy danh sách sản phẩm theo trang hoặc tất cả
    getProducts(req, res, next) {
        if (typeof req.query.p   === 'undefined')
        {
            res.statusCode =402; res.json({msg: 'invalid query'});
            return;
        }

        // p = 0 nghĩa là lấy tất cả danh sách sản phẩm.
        
        Product.find({})
        .then(data => {
            if (req.query.p === '0') 
            {
                res.statusCode =200; res.json({msg: 'success', data: data});
                return;
            }
            let x = parseInt((req.query.p-1) * 12)
            if (x > (data.length - 1) / 12 + 1) { res.statusCode =402; res.json({msg: 'invalid page'}); return;}
            res.statusCode =200; res.json({msg: 'success', data: data.splice(x, x + 12)});
            return;
        })
        .catch(err => {res.statusCode =500; res.json({msg: err.message});});
    }

    //[POST] /products/searchbycategory
    pSearchByCategory(req, res, next) 
    {
        if (typeof req.body.categoryName === 'undefined' &&
            typeof req.body.categoryId   === 'undefined'
        ) {
            res.statusCode =404; res.json({msg: 'invalid category'});
            return;
        }

        Category.findById(req.body.categoryId)
        .then(data => { 
            if (data) {
                res.statusCode =200; res.json({msg: 'success', data: data}); 
                return;
            }
            res.statusCode =402; res.json({msg: 'not found'})
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});

        Category.findOne({name: req.body.categoryName})
        .then(data => { 
            if (data) {
                res.statusCode =200; res.json({msg: 'success', data: data}); 
                return;
            }
            res.statusCode =402; res.json({msg: 'not found'})
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
    }

    //[POST] /products/searchbycode
    pSearchByCode(req, res, next) 
    {
        if (typeof req.body.code === 'undefined') {res.statusCode =404; res.json({msg: 'invalid code'}); return; }

        Product.findOne({code: req.body.code})
        .then(data => {
            if (data) {
                res.statusCode =200; res.json({msg: 'success', data: data});
                return;
            }
            res.statusCode =402; res.json({msg: 'not found'});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
    }

    //[POST] /products/searchbyname
    pSearchByName(req, res, next) {
        if (typeof req.body.name === 'undefined') {
            res.statusCode =404; res.json({msg: 'invalid name'});
            return;
        }

        Product.findOne({name: req.body.name})
        .then(data => {
            if (data) {
                res.statusCode =200; res.json({msg: 'success', data: data});
                return;
            }
            
            res.statusCode =404; res.json({msg: 'not found'});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
    }

    //[POST] /products/checkStock
    pCheckStock(req, res, next) {
        if (typeof req.body.name === 'undefined') {
            res.statusCode =404; res.json({msg: 'invalid name'});
            return;
        }

        Product.findOne({name: req.body.name})
        .then(data => {
            if (data) {
                res.statusCode =200; res.json({msg: 'success', data: data.storage});
                return;
            }
            
            res.statusCode =404; res.json({msg: 'not found'});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
    }
}

module.exports = new ProductController();