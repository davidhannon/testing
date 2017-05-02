/* Module Dependencies */
const { Router } = require( 'express' );
const soap = require( 'soap-as-promised' );

/* Envision API Constants */
const rxAPI = `https://mws.envisionrx.com/rxfunctions.asmx?WSDL`;
const BaseURL = 'http://mws.envisionrx.com/';

let ApiClient;
const USERNAME = 'medtrak1';
const PASSWORD = 'Med%123';
const GroupID = 'CBS2';
let credentials = {
  UserCredentials: {
    UserID: USERNAME,
    Password: PASSWORD
  }
};

const router = new Router( );

async function initializeClient( ) {
  try {
    ApiClient = await soap.createClient( rxAPI, { empty: true } );
    ApiClient.addSoapHeader( credentials, 'UserCredentials', "tns", BaseURL );


  } catch ( err ) {
    console.error( err );
  }
}

let clientInitialized = initializeClient( );

async function getDrug( DrugName ) {
  await clientInitialized;
  let { GetDrugByNameResult: { Drug: drugs } } = await ApiClient.GetDrugByName( { DrugName, "GroupID": "CBS2" }, {}, "tns", BaseURL ).catch( console.error );
  let formatted = drugs.map( d => ( { text: d.DrugName, value: d.GPI } ) )
  return formatted;
}

async function getPharmacies( [ Latitude, Longitude ] ) {
  await clientInitialized;
  let { GetPharmaciesByLatLongResult: { Pharmacy: pharmacies } } = await ApiClient.GetPharmaciesByLatLong( { Latitude, Longitude, Distance: 25, MaxPharmacies: 50, "GroupID": "CBS2" }, {}, "tns", BaseURL ).catch( console.error );
  pharmacies.forEach( p => p.PharmacyName = p.PharmacyName.toLowerCase( ) )
  pharmacies.forEach( p => p.Distance = parseFloat( p.Distance ).toFixed( 2 ) )
    // let formatted = drugs.map( d => ( { text: d.DrugName, value: d.GPI } ) )
  return pharmacies;
}

router.get( '/drugs', ( req, res, next ) => {
  let { name } = req.query;
  getDrug( name ).then( drugs => res.send( drugs ) ).catch( next );
} );

router.get( '/pharmacies', ( req, res, next ) => {
  let { lat, lng } = req.query;
  getPharmacies( [ lat, lng ] ).then( pharms => res.send( pharms ) ).catch( next );
} );


module.exports = router;