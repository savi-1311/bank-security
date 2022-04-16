const { Router } = require('express');
const passport = require('passport');
const {listPlugins} = require('../controllers/plugin.controller');
const pluginRouter = Router();

// User router for handling requests from clients
pluginRouter.get('/listPlugins', passport.authenticate('jwt', { session: false }) ,listPlugins);

module.exports = pluginRouter;