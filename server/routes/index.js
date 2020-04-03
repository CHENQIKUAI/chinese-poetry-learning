module.exports = (app) => {
    app.use('/signup', require('./signup'))
    app.use('/signin', require('./signin'))
    app.use('/profile', require('./profile'))
    
    app.use('/poetry', require('./poetry'))
    app.use('/writer', require('./writer'))
    app.use('/mustLearn', require('./mustLearn'))

    app.use('/poetrySearch', require('./poetrySearch'))
    app.use('/learningCenter', require('./learningCenter'))
    app.use('/poetryLearningSet', require('./poetryLearningSet'))
    app.use('/favoritePoetry', require('./favoritePoetry'))
    app.use('/personalSetting', require('./personalSetting'))

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).send("404")
        }
    })
}
 