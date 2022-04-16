const { Router } = require('express');
const passport = require('passport');
const {registerAccount, scanAll, listAccounts} = require('../controllers/account.controller');
const accountRouter = Router();

// User router for handling requests from clients
accountRouter.post('/registerAccount', passport.authenticate('jwt', { session: false }) ,registerAccount);
accountRouter.post('/listAccounts', passport.authenticate('jwt', { session: false }) ,listAccounts);
accountRouter.post('/scanAll', passport.authenticate('jwt', { session: false }) ,scanAll);

module.exports = accountRouter;