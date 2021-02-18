const express = require('express');
const { PermissionMiddlewareCreator, RecordSerializer } = require('forest-express-sequelize');
const { companies } = require('../models');
const superagent = require('superagent');

const router = express.Router();
const permissionMiddlewareCreator = new PermissionMiddlewareCreator('companies');

// This file contains the logic of every route in Forest Admin for the collection companies:
// - Native routes are already generated but can be extended/overriden - Learn how to extend a route here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/extend-a-route
// - Smart action routes will need to be added as you create new Smart Actions - Learn how to create a Smart Action here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/actions/create-and-manage-smart-actions

// get pipedrive persons associated to a company by organization id
router.get('/companies/:recordId/relationships/pipedrivePersons', permissionMiddlewareCreator.list(), async (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  const recordSerializer = new RecordSerializer({ name: 'pipedrivePersons' });
  const parentId = request.params.recordId;
  const limit = parseInt(request.query.page.size, 10) || 20;
  const offset = (parseInt(request.query.page.number, 10) - 1) * limit;
  const parent = await companies.findByPk(parentId);
  return superagent
    .get(`https://api.pipedrive.com/v1/organizations/${parent.pipedriveId}/persons?&api_token=${process.env.PIPEDRIVE_API_KEY}&limit=${limit}&start=${offset}`)
    .then((apiResponse) => JSON.parse(apiResponse.res.text))
    .then((rawRecords) => recordSerializer.serialize(rawRecords.data))
    .then((records) => response.send(records));
});

// Create a Company
router.post('/companies', permissionMiddlewareCreator.create(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#create-a-record
  next();
});

// Update a Company
router.put('/companies/:recordId', permissionMiddlewareCreator.update(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#update-a-record
  next();
});

// Delete a Company
router.delete('/companies/:recordId', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-record
  next();
});

// Get a list of Companies
router.get('/companies', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-list-of-records
  next();
});

// Get a number of Companies
router.get('/companies/count', permissionMiddlewareCreator.list(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-number-of-records
  next();
});

// Get a Company
router.get('/companies/:recordId(?!count)', permissionMiddlewareCreator.details(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#get-a-record
  next();
});

// Export a list of Companies
router.get('/companies.csv', permissionMiddlewareCreator.export(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#export-a-list-of-records
  next();
});

// Delete a list of Companies
router.delete('/companies', permissionMiddlewareCreator.delete(), (request, response, next) => {
  // Learn what this route does here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/routes/default-routes#delete-a-list-of-records
  next();
});

router.post('/actions/add-to-pipedrive', async (req, res) => {
  const companyId = req.body.data.attributes.ids[0];
  const company = await companies.findByPk(companyId);

  if (company.pipedriveId) {
    return res.status(400).send({ error: 'An organization id from Pipedrive is already assigned to this company' });
  }
  return superagent
    .post(`https://api.pipedrive.com/v1/organizations?ai_token=${process.env.PIPEDRIVE_API_KEY}`)
    .send({
      // list here the attributes to be used to create the entry in Pipedrive
      name: company.name,
    })
    .then((response) => JSON.parse(response.res.text))
    .then((pipedriveOrganization) => {
      company.pipedriveId = pipedriveOrganization.data.id
      return company.save();
    })
    .then(() => res.send({ success: 'Lead has been created in Pipedrive!' }))
    .catch((e) => {
      console.log(e);
      return res.status(400).send({ error: 'could not create organization' })
    });
});

module.exports = router;
