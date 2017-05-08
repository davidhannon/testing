// curl https://a.klaviyo.com/api/v1/email-template/dqQnNW/send \
//   -X POST \
//   -d api_key=pk_c52546c353b89884ecc8e868e099c82005 \
//   -d from_email=davidhannon7@gmail.com \
//   -d from_name='Your Name' \
//   -d subject='Your Weekly Summary' \
//   -d to='[{ "email" : "recipient@example.com", "name" : "Recipient Name" }]' \
//   -d context='{ "name" : "Recipient", "notifcation_count" : 8 }'

/* Klaviyo Integration */
const agent = require( "superagent" );
const ApiKey = 'pk_c52546c353b89884ecc8e868e099c82005';
const Template = 'dqQnNW';
const { Router } = require( 'express' );
const bodyParser = require( 'body-parser' );
let router = new Router( );

function endpoint( template ) {
  return `https://a.klaviyo.com/api/v1/email-template/${template}/send`
}

/* API Routing */

router.use( "/email", bodyParser.json( ), ( req, res, next ) => {
  let { email: emailAddress } = req.body;

  agent.post( endpoint( Template ) ).type( 'form' ).send( {
    api_key: ApiKey,
    from_email: "hello@takecarecard.com",
    from_name: "CareCard",
    subject: "Your CareCard",
    to: emailAddress
  } ).end( ( err, result ) => {
    if ( err ) {
      console.error( err );
      res.send( { ok: false } );
    } else {
      res.send( { ok: true } );
    }
  } );
} );

module.exports = router;