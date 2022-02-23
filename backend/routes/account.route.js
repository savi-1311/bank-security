const { Router } = require('express');
const passport = require('passport');
const {registerAccount} = require('../controllers/account.controller');
const accountRouter = Router();

// User router for handling requests from clients
accountRouter.post('/registerAccount', passport.authenticate('jwt', { session: false }) ,registerAccount);

module.exports = accountRouter;