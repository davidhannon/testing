/* Mailchimp Integration */
const Mailchimp = require( "mailchimp-api-v3" );
const ApiKey = 'a1547c1092d21082c505cf201810e572-us5';
const TestListId = '0ecfc791dc';
const RecipientList = '30485cc033';
const SubscriptionList = 'e8edb8d592';
const { Router } = require( 'express' );
const bodyParser = require( 'body-parser' );
let router = new Router( );
let mailchimp = new Mailchimp( ApiKey );

async function addMember( email, firstName, lastName, address1, address2, zipcode ) {
  try {
    let request = await mailchimp.post( `/lists/${SubscriptionList}`, {
      members: [ {
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME: firstName, LNAME: lastName, ZIP: zipcode }
    } ]
    } );
    return true;
  } catch ( err ) {
    console.error( err );
    return false;
  }
}

function onError( req, res, next ) {
  res.send( { ok: false } );
}
/* API Routing */

router.use( "/signup", bodyParser.json( ), ( req, res, next ) => {
  let { email, firstName, lastName, address1, address2, zipcode } = req.body;
  addMember( email, firstName, lastName, address1, address2, zipcode ).then( ( success ) => {
    if ( success ) {
      return res.json( { ok: true } );
    } else {
      onError( req, res, next );
    }
  } ).catch( e => onError( req, res, next ) );

} );

module.exports = router;