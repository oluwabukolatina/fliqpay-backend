const express = require('express');

const router = express.Router();

const controller = require('../../../controllers/requests/admin/request.controller');

// middleware: only signed in users can access this route
const admin = require('../../../middlewares/admin/admin');

const { getAllRequests, getARequest } = controller;
router.get('/', admin, getAllRequests);
router.get('/:id', admin, getARequest);
// router.put('/:id', admin, resolveRequest);

module.exports = router;
