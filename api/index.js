// import twilio/SMS functions
const TwilioFns = require( "./twilio" );
const soap = require( 'soap-as-promised' );
const rxAPI = `https://mws.envisionrx.com/rxfunctions.asmx?WSDL`;
const BaseURL = 'http://mws.envisionrx.com/';
const username = 'medtrak1';
const password = 'Med%123';

soap.createClient( rxAPI, { empty: true } )
  .then( ( client ) => {

    let credentials = {
      UserCredentials: {
        UserID: username,
        Password: password
      }
    };

    client.addSoapHeader( credentials, 'UserCredentials', "", "http://mws.envisionrx.com/" );

    return client.GetDrugByName( { "DrugName": "Adderall" } );
  } )
  .then( ( result ) => {
    console.log( `The result was: ${result}` );
  } )
  .catch( ( error ) => {
    console.error( `There was an error! ${error}` );
  } );

module.exports = TwilioFns;