const signIn = require('./signin');
const register = require('./register')

// chuyển hướng khi vào các đầu url dưới
function route(app) {
    app.use('/register', register)
    app.use('/signin', signIn)
    app.use('/', function(req, res) {
        res.send('hello');
    })
}

module.exports = route;