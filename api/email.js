/* Klaviyo Integration */
const Mailchimp = require( "mailchimp-api-v3" );
const ApiKey = 'a1547c1092d21082c505cf201810e572-us5';
const ListID = '0ecfc791dc';
const RecipientList = '30485cc033';
const SubscriptionList = 'e8edb8d592';
const { Router } = require( 'express' );
const bodyParser = require( 'body-parser' );
let router = new Router( );
let mailchimp = new Mailchimp( ApiKey );

async function addMember( email, fullName ) {
  let [ FNAME, ...LNAME ] = fullName.split( " " );
  LNAME = LNAME.join( " " );
  try {
    let request = await mailchimp.post( `/lists/${RecipientList}`, {
      members: [ {
        email_address: email,
        status: 'subscribed',
        merge_fields: { FNAME, LNAME }
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

router.use( "/email", bodyParser.json( ), ( req, res, next ) => {
  let { emailAddress, fullName } = req.body;
  addMember( emailAddress, fullName ).then( ( success ) => {
    if ( success ) {
      return res.json( { ok: true } );
    } else {
      onError( req, res, next );
    }
  } ).catch( e => onError( req, res, next ) );

} );

module.exports = router;