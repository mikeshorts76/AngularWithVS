module.exports = function(app) {
    require('./home')(app);
    require('./data')(app);
    require('./message')(app);
    require('./status')(app);
};