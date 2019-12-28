module.exports = (app) => {
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/profile', require('./profile'))
    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).render('404')
        }
    })
}
