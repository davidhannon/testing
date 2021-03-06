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
  if ( ApiClient ) {
    return ApiClient;
  }
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
  let result = [];
  let products = {};
  let productNames = [];
  let { GetDrugByNameResult: response } = await ApiClient.GetDrugByName( { DrugName, "GroupID": "CBS2" }, {}, "tns", BaseURL ).catch( ( e ) => {
    console.error( e );
  } );

  if (response) {
    let { Drug: drugs } = response;
    // Figure out all the different dosages...
    drugs.map((drug) => {
      if (products[drug.ProductName]) {
        // Add new quantity option
        products[drug.ProductName].push(drug);
      } else {
        // Add new product name
        products[drug.ProductName] = [drug];
        productNames.push(drug.ProductName);
      }
    });
    // Now for each type of drug, get the lowest dosage
    const lowestDoses = productNames.map((name) => {
      let lowest = products[name][0];
      products[name].forEach((drug) => {
        if (parseInt(drug.Strength) < parseInt(lowest.Strength)) {
          lowest = drug
        }
      });
      return lowest;
    });
    result = lowestDoses.map( d => Object.assign( d, { text: d.ProductName, value: d.GPI } ) );
  }

  return {drugs: result, products};
}

async function getPharmacies( [ Latitude, Longitude ] ) {
  await clientInitialized;
  let { GetPharmaciesByLatLongResult: response } = await ApiClient.GetPharmaciesByLatLong( { Latitude, Longitude, Distance: 25, MaxPharmacies: 50, "GroupID": "CBS2" }, {}, "tns", BaseURL ).catch( console.error );

  if (response) {
    return response.Pharmacy.map(p => {
      p.PharmacyName = p.PharmacyName.toLowerCase().split('#')[0].trim();
      p.Distance = parseFloat(p.Distance).toFixed(2);
      return p;
    });
  }
  return [];
}

function filterPharmacies( ApiResponse ) {

  let filtered = ApiResponse.filter( ( pharmacy ) => {

    if ( pharmacy.DrugCost.DrugCost.length > 0 ) {
      return true;
    } else {
      return false;
    }
  } );
  return filtered;
}

function sortPharmacies( ApiResponse ) {
  if ( !ApiResponse || ApiResponse.length < 1 ) {
    return [ ];
  }
  return ApiResponse.sort( ( resultA, resultB ) => {
    if ( !resultA.DrugCost.DrugCost || !resultB.DrugCost.DrugCost ) {
      return 0;
    }
    let costA = resultA.DrugCost.DrugCost;
    let costB = resultB.DrugCost.DrugCost;
    let { Copay: BrandA } = Array.isArray( costA ) && costA.length > 0 ? costA.pop( ) : costA;
    let { Copay: BrandB } = Array.isArray( costB ) && costB.length > 0 ? costB.pop( ) : costB;
    if ( BrandA & BrandB ) {
      return +BrandA < +BrandB ? 1 : -1;
    }
    return 0;
  } );
}

async function getPricing( { Latitude, Longitude, Qty, Days, NDC, brand } ) {
  await clientInitialized;
  let result;
  let { GetBrandGenericDrugPricingByLatLongResult: response } = await ApiClient.GetBrandGenericDrugPricingByLatLong( { Latitude, Longitude, NDC, Qty, Days, Distance: 25, MaxPharmacies: 60, "GroupID": "CBS2" }, {}, "tns", BaseURL ).catch( console.error );
  if ( !response ) {
    result = [ ];
  } else {
    let { RxClaims: { RxClaimMultiDrug: details }, Drug: { Drug: drugs } } = response;
    result = { details, drugs };
  }
  return result;
}

router.get( '/drugs', ( req, res, next ) => {
  let { name } = req.query;
  getDrug( name ).then( drugs => res.send( drugs ) ).catch( next );
} );

router.get( '/pharmacies', ( req, res, next ) => {
  let { lat, lng } = req.query;
  getPharmacies( [ lat, lng ] ).then( pharms => res.send( pharms ) ).catch( next );
} );

router.get( '/pricing', ( req, res, next ) => {
  let { lat, lng, qty, days, NDC } = req.query;
  getPricing( { Latitude: lat, Longitude: lng, Qty: qty, Days: days, NDC } ).then( pharmacies => res.send( pharmacies ) ).catch( next );
} );

module.exports = router;