const signIn = require('./signin');
const register = require('./register')
const product = require('./product')

// chuyển hướng khi vào các đầu url dưới
function route(app) {
    app.use('/products', product)
    app.use('/register', register)
    app.use('/signin', signIn)
    app.use('/', function(req, res) {
        res.send('hello');
    })
}

module.exports = route;