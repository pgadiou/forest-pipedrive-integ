const { collection } = require('forest-express-sequelize');

collection('pipedrivePersons', {
  fields: [
    {
      field: 'id',
      type: 'Number',
    }, {
      field: 'first_name',
      type: 'String',
    }, {
      field: 'last_name',
      type: 'String',
    }, {
      field: 'email',
      type: 'String',
      get: (person) => person.email[0].value,
    }, {
      field: 'phone',
      type: 'String',
      get: (person) => person.phone[0].value,
    }, {
      field: 'active_flag',
      type: 'Boolean',
    }, {
      field: 'open_deals_count',
      type: 'String',
    }, {
      field: 'closed_deals_count',
      type: 'String',
    }, {
      field: 'last_activity_date',
      type: 'Date',
    }, {
      field: 'add_time',
      type: 'Date',
    }, {
      field: 'pipedriveLink',
      type: 'String',
      get: (person) => `https://${process.env.PIPEDRIVE_DOMAIN}.pipedrive.com/person/${person.id}`,
    }, {
      field: 'owner_name',
      type: 'String',
    },
  ],
});