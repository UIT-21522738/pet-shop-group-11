const signIn = require('./signin');
const register = require('./register');
const product = require('./product');
const customer = require('./customer');
const staff = require('./staff');
const invoice = require('./invoice');

// chuyển hướng khi vào các đầu url dưới
function route(app) {
    app.use('/staff', staff);
    app.use('/invoice', invoice);
    app.use('/customer', customer)
    app.use('/products', product)
    app.use('/register', register)
    app.use('/signin', signIn)
    app.use('/', function(req, res) {
        res.send('hello');
    })
}

module.exports = route;