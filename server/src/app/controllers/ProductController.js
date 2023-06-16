const Product = require('../models/Products');
const Category = require('../models/Category');
const User = require('../models/Users');

class ProductController {
    // [POST] /products/create
    // thêm sản phẩm
    pAddProduct(req, res, next) {
        if (
            typeof req.body.name        === 'undefined' ||
            typeof req.body.price       === 'undefined' ||
            typeof req.body.storage     === 'undefined' ||
            typeof req.body.description === 'undefined' ||
            typeof req.body.typeName    === 'undefined' ||
            typeof req.body.brand       === 'undefined' ||
            typeof req.body.token       === 'undefined'
        ) {
            res.statusCode =402; res.json({msg: "invalid data"});
            return;
        }

        try {var id = jwt.verify(token, 'petshop')}
        catch (e) {
            res.statusCode =500; res.json({msg: e.message});
            return;
        }

        var body = req.body;

        User.findById(id)
        .then(data => {
            body.creater = data.code;
        })
        .catch(err => { console.log(err); return;});
        
        Category.findOne({name: body.typeName})
        .then(data => {
            body.typeId = data._id.toString();
            return;
        })
        .catch(err => { console.log(err); return;})

        const count = Product.countDocuments({typeId: body.typeId});
        if (count < 9) body.code = `${body.typeName.charAt(0)}0${count+1}`;
        else body.code = `${body.typeName.charAt(0)}${count+1}`

        Product.findOne({$or: [{name: req.body.name}, {code: req.body.code}]})
        .then(data => {
            if (data) {
                res.statusCode =402; res.json({msg: "product exists"});            
            }
            else {
                const newProduct = new Product(req.body);
                newProduct.save()
                .then(() => {
                    res.statusCode =200; res.json({msg:"success"});
                    return;
                })
                .catch(err => {res.statusCode =500; res.json({msg: err.message}); return;});
            }
        })
        .catch(err => {
            res.statusCode =500; res.json({msg: err.message});
            return;
        })
    }

    //[GET] /products/totalpage
    // lấy tổng số page
    getTotalPage(req, res, next) {
        Product.find({})
        .then(data => {
            res.statusCode =200; res.json({msg: 'success',data: parseInt((data.length - 1) / 12) + 1});
            return;
        })
        .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
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
            else {
                let x = parseInt((req.query.p-1) * 12)
                if (x > (data.length - 1) / 12 + 1) { res.statusCode =402; res.json({msg: 'invalid page'}); return;}
                else {  
                    res.statusCode =200; res.json({msg: 'success', data: data.splice(x, x + 12)});
                    return;
                }
            }
        })
        .catch(err => {res.statusCode =500; res.json({msg: err.message});});
    }

    //[PUT] /products/update
    pUpdateProduct(req, res, next) {
        if (
            (typeof req.body.name        === 'undefined' &&
            typeof req.body.price       === 'undefined' &&
            typeof req.body.storage     === 'undefined' &&
            typeof req.body.description === 'undefined' &&
            typeof req.body.typeName    === 'undefined' &&
            typeof req.body.brand       === 'undefined') ||
            typeof req.body.id === 'undefined'
        ) {
            res.statusCode = 404;
            res.json({msg: "invalid data"})
            return;
        }

        var body = req.body;
        body.id = '';
        if (body.typeName) {
            Category.findOne({name: body.typeName})
            .then(data => {
                body.typeId = data._id.toString();
                return;
            })
            .catch(err => { console.log(err); return;})
        }
        Product.findByIdAndUpdate(body.id, body)
        .then(data => {
            res.statusCode = 200;
            res.json({msg: "success"})
            return;
        })
        .catch(err => { console.log(err.message); return;});
        
    }

    //[POST] /products/search
    pSearch(req, res, next) {
        if(
            typeof req.body.typeName === 'undefined' &&
            typeof req.body.typeId   === 'undefined' &&
            // typeof req.body.code === 'undefined' &&
            typeof req.body.name === 'undefined' &&
            typeof req.body.storage === 'undefined' &&
            typeof req.body.price === 'undefined'
        ) {
            req.statusCode = 404;
            req.json('invalid data');   
        }
        else if (req.body.name)
        {
            Product.find({name: {$regex: req.body.name, $options: 'i'}})
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
        // else if (req.body.code) 
        // {
        //     Product.findOne({code: req.body.code})
        //     .then(data => {
        //         if (data) {
        //             res.statusCode =200; res.json({msg: 'success', data: [data]});
        //             return;
        //         }
        //         res.statusCode =402; res.json({msg: 'not found'});
        //         return;
        //     })
        //     .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        // }
        else if (req.body.typeId)
        {
            Product.find({typeId: req.body.typeId})
            .then(data => { 
                if (data) {
                    res.statusCode =200; res.json({msg: 'success', data: data}); 
                    return;
                }
                // res.statusCode =402; res.json({msg: 'not found'})
                // return;
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
        else if (req.body.typeName)
        {
            Category.findOne({name: {$regex: req.body.typeName, $options: 'i'}})
            .then(data => { 
                if (data) {
                    Product.find({typeId: data._id})
                    .then(products => {
                        if (products) {
                            res.statusCode =200; res.json({msg: 'success', data: products}); 
                            return;
                        }
                        // res.statusCode =402; res.json({msg: 'not found'})
                        // return;
                    })
                    .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
                }
                else {
                    res.statusCode =402; res.json({msg: 'not found'})
                    return;
                }
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
        else if (req.body.storage)
        {
            Product.find({storage: parseInt(req.body.storage)})
            .then(data => {
                res.statusCode =200; res.json({msg: 'success', data});
                return;
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
        else if (req.body.price)
        {
            Product.find({price: parseInt(req.body.price)})
            .then(data => {
                res.statusCode = 200; 
                res.json({msg: "success", data});
                return;
            })
            .catch(err => {
                res.statusCode = 500;
                res.json({msg: err.message});
                return;
            })
        }
    }

    // tạm k xài, đổi qua xài psearch
    //[POST] /products/searchbycategory
    pSearchByCategory(req, res, next) 
    {
        if (typeof req.body.categoryName === 'undefined' &&
            typeof req.body.categoryId   === 'undefined'
        ) {
            res.statusCode =404; res.json({msg: 'invalid category'});
            return;
        }
        if (req.body.categoryId) {
            Product.find({type_id: req.body.categoryId})
            .then(data => { 
                if (data) {
                    res.statusCode =200; res.json({msg: 'success', data: data}); 
                    return;
                }
                // res.statusCode =402; res.json({msg: 'not found'})
                // return;
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
        else {
            Category.findOne({name: req.body.categoryName})
            .then(data => { 
                if (data) {
                    Product.find({type_id: data._id})
                    .then(products => {
                        if (products) {
                            res.statusCode =200; res.json({msg: 'success', data: products}); 
                            return;
                        }
                        // res.statusCode =402; res.json({msg: 'not found'})
                        // return;
                    })
                    .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
                }
                else {
                    res.statusCode =402; res.json({msg: 'not found'})
                    return;
                }
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
    }

        // tạm k xài, đổi qua xài psearch
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

    // tạm k xài, đổi qua xài psearch
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
        if (typeof req.body.id === 'undefined' && typeof req.body.code === 'undefined') {
            res.statusCode =404; res.json({msg: 'invalid name'});
            return;
        }

        if (req.body.code) {
            Product.findOne({code: req.body.code})
            .then(data => {
                if (data) {
                    res.statusCode =200; res.json({msg: 'success', data: data.storage});
                    return;
                }
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
        else {
            Product.findById(req.body.id)
            .then(data => {
                if (data) {
                    res.statusCode =200; res.json({msg: 'success', data: data.storage});
                    return;
                }
                else {
                    res.statusCode =404; res.json({msg: 'not found'});
                    return;
                }
            })
            .catch(err => { res.statusCode =500; res.json({msg: err.message}); return;});
        }
    }

    //[POST] /products/adjustments/:id
    async pAdjustments(req, res, next) {
        if (typeof req.body.quantity === 'undefined') {
            res.statusCode = 400;
            res.json({ msg: "Invalid data" });
            return;
        }
        
        try {
            const product = await Product.findById(req.params.id);
            if (product) {
            product.storage = req.body.quantity;
            await product.save();
            res.statusCode = 200;
            res.json({ msg: "Success" });
            } else {
            res.statusCode = 404;
            res.json({ msg: "Not found" });
            }
        } catch (err) {
            res.statusCode = 500;
            res.json({ msg: err.message });
        }
    }
      
}

module.exports = new ProductController();