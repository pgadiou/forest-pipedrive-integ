# forest-pipedrive-integ

Demo of a manual integration of the Pipedrive API into a Forest Admin project

### Use case #1 => display link to the Pipedrive interface for the organization corresponding to a company stored in the database

**PR**: [add-pipedrivelink-to-companies](https://github.com/pgadiou/forest-pipedrive-integ/pull/1/files), [fix-pipedrivelink-for-null-value](https://github.com/pgadiou/forest-pipedrive-integ/pull/7/files)

**Features used**: smart field

### Use case #2 => display list of persons from Pipedrive associated to a company stored in the database

**PR**: [pipedrivepersons-relationship-to-companies](https://github.com/pgadiou/forest-pipedrive-integ/pull/2/files), [add-pipedrive-persons-details-route](https://github.com/pgadiou/forest-pipedrive-integ/pull/5/files) 

**Features used**: smart relationships, smart fields

Demo video available here => https://www.loom.com/share/62d8f60b828a48bf8c2bb76d183acbfe

### Use case #3 => add organization to Pipedrive from a record from the companies table stored in the databse

**PR**: [add-to-pipedrive-organizations-action](https://github.com/pgadiou/forest-pipedrive-integ/pull/6/files)

**Features used**: smart action
