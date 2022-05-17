/* Prototype (if NPM 'json-schema-generator' does not work as expected)*/
var jsonSchemaGenerator = require('json-schema-generator'),
    obj = { some: { object: true } },
    schemaObj;
 
schemaObj = jsonSchemaGenerator(json);

console.log('Generated JSON schema: ' + schemaObj);