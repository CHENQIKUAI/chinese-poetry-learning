module.exports = (app) => {
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/signout', require('./signout'))
    app.use('/profile', require('./profile'))
    app.use('/poetry', require('./poetry'))
    app.use('/writer', require('./writer'))
    app.use('/mustLearn', require('./mustLearn'))
    app.use('/poetrySearch', require('./poetrySearch'))
    app.use('/favoritePoetry', require('./favoritePoetry'))
    app.use('/personalSetting', require('./personalSetting'))
    app.use('/poetryLearning', require('./poetryLearning'))
    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).send("404")
        }
    })
}
