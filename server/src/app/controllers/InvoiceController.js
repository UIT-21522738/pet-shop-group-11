const Customer = require('../models/Customers');
const Product = require('../models/Products');
const Invoice = require('../models/Invoices');
const Staff = require('../models/Users');
const Invoice_details = require('../models/Invoice_details');


//sử dụng hàm bất đồng bộ để lấy giá của các sản phẩm.
async function getPrice(products)
{
    let products_price = []
    for (let id of products) {
        await Product.findById(id)
        .then(async (data) => {
            await new Promise((resolve) => setTimeout(resolve, 300));
            products_price.push(data.price);
        })
        .catch(err => {console.log(err.message)})
    }
    return products_price;
}

class SellController {
    //[POST] /invoice/create
    async pCreateInvoice(req, res, next) {
        if (
            typeof req.body.staffId === 'undefined' ||
            typeof req.body.customerId === 'undefined' ||
            typeof req.body.products === 'undefined' ||
            typeof req.body.quantity === 'undefined' ||
            typeof req.body.discount === 'undefined' 
        ) {
            res.statusCode = (404);
            res.json({msg: "invalid data"});
            return;
        }
        let products = req.body.products;
        let quantities = req.body.quantity;
        let products_price = await getPrice(products);
        let sum = 0;
        for (let i = 0; i < products.length; i++) {
            sum += parseInt(quantities[i]) * products_price[i];
        }
        await new Promise((resolve, reject) => setTimeout(resolve,500));
        //tạo hóa đơn
        let invoice = new Invoice({
            customerId: req.body.customerId,
            staffId: req.body.staffId,
            discount: parseFloat(req.body.discount),
            totalPrice: sum * (1 - parseFloat(req.body.discount))
        });
        invoice.save()
        .then(async (data) => {
            // tạo các hóa đơn detail tương ứng của hóa đơn.
            for (let i = 0; i < products.length; i++) {
                await new Promise((resolve) => setTimeout(resolve, 300));
                let invoiceDetails = new Invoice_details({productId: products[i], invoiceId: data._id, quantity: quantities[i], price: products_price[i]});
                await invoiceDetails.save();
            }
            Customer.findByIdAndUpdate(req.body.customerId, {score: sum * (1 - parseFloat(req.body.discount)) / 100});

            res.statusCode = 200;
            res.json({msg: 'Success'});
        })
        .catch(err => {res.statusCode = 404; res.json({msg: err.message, t: "0"}); return;}); 
    }

    //[POST] /invoice/get
    pGetInvoice(req, res, next) {
        if (typeof req.body.customerId === 'undefined') {
            res.statusCode = 404;
            res.json({ msg: "invalid customer Id"}); 
            return;
        }
        
        Invoice.find({ customerId: req.body.customerId})
        .then(async (data) => {
            //test async await promise
            // for (let d in data) {
            //     await new Promise((resolve) => {
            //         setTimeout(() => {invoices.push(d);},300);
            //         resolve();
            //     });
            // }
            res.statusCode = 200;
            res.json({msg: 'success', data: data});
        })
        .catch(err => {
            res.statusCode = err.statusCode;
            res.json({msg: err.message});
        })
    }

    //[POST] /invoice/search
    async pSearchInvoice(req, res, next) {
        if (typeof req.body.invoiceId === 'undefined') {
            res.statusCode = 404;
            res.json({msg: 'invoiceid invalid'})
            return;
        }
        
        var products = [];

        await Invoice_details.find({invoiceId: req.body.invoiceId})
        .then(async (data) => {
            // gán dữ liệu về các invoice details vào biến products
            // await new Promise((resolve, reject) =>{
            //     setTimeout(() => {
            //         products = data;
            //     },1000)
            // })

            // gán dữ liệu về sản phẩm vào invoice details tương ứng
            for (let i = 0; i < data.length; i++) 
            {
                await Product.findById(data[i].productId)
                .then(async (product) => {
                    await new Promise((resolve, reject) =>{
                        setTimeout(() => {
                            product['quantity'] = data[i].quantity;
                            products.push(product);
                            resolve();
                        },100)
                    })
                });
            }
            // await new Promise((resolve, reject) => setTimeout(() => {},1000));
        })
        .catch((err) => { res.statusCode = 500; res.json({msg: err.message}); });

        res.statusCode = 200;
        res.json({msg: 'success', products: products});
        
    }

    //[POST] /invoice/revenue/month
    pRevenueMonth(req, res, next){
        if (
            typeof req.body.month === 'undefined' ||
            typeof req.body.year === 'undefined'
        ){
            res.statusCode = 404;
            res.json({msg: 'invalid data'});
            return;
        }

        let month = parseInt(req.body.month) -1;
        let year = parseInt(req.body.year);
        let startDate = new Date();

        startDate.setUTCFullYear(year);
        startDate.setUTCMonth(month);
        startDate.setUTCDate(1);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        let finishDate = new Date();
        
        finishDate.setUTCFullYear(year);
        finishDate.setUTCMonth(month);
        if ((((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) && month === 2)
        {
            finishDate.setUTCDate(29);
        }
        else if (month === 2) {
            finishDate.setUTCDate(28);
        }
        else {
            if (month === 4 || month === 6 || month === 9 || month === 11) finishDate.setUTCDate(30);
            else finishDate.setUTCDate(31);
        }
        finishDate.setHours(23);
        finishDate.setMinutes(59);
        finishDate.setSeconds(59);

        const query = { createdAt: {
            $gte: startDate, $lte: finishDate 
        }};

        Invoice.find(query)
        .then(data => {
            res.statusCode = 200;
            res.json({msg: 'success', data: data});
        })
        .catch(err => { res.statusCode = 500; res.json({msg: err.message}); });

        
    }
}

module.exports = new SellController();