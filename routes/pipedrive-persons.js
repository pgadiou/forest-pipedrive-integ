const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');
const { pipedrivePersons } = require('../models');
const superagent = require('superagent');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('pipedrivePersons');
const recordSerializer = new RecordSerializer({ name: 'pipedrivePersons' });


// Get a Person details
router.get('/pipedrivePersons/:recordId', permissionMiddlewareCreator.list(), (request, response, next) => {
  const recordId = request.params.recordId;
  return superagent
    .get(`https://api.pipedrive.com/v1/persons/${recordId}?&api_token=${process.env.PIPEDRIVE_API_KEY}`)
    .then((apiResponse) => JSON.parse(apiResponse.res.text))
    .then((rawRecord) => recordSerializer.serialize(rawRecord.data))
    .then((record) => response.send(record));
});

module.exports = router;