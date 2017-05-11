/* Google Sheets Integration */
// const agent = require( "superagent" );
// const ApiKey = 'pk_c52546c353b89884ecc8e868e099c82005';
// const Template = 'dqQnNW';
const toJSON = require( 'write-json-file' );
const { Router } = require( 'express' );
let persisted = require( "./cc_signups.json" );
const bodyParser = require( 'body-parser' );
let router = new Router( );

/* API Routing */

router.use( "/signup", bodyParser.json( ), ( req, res, next ) => {
  let { firstName, lastName, address1, address2, email, zip } = req.body;
  let newSignups = persisted.signups.push( { firstName, lastName, address1, address2, email, zip } );
  toJSON( "./cc_signups.json", { "signups": newSignups } );
  res.send( { ok: true } )
} );

module.exports = router;