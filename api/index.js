// import twilio/SMS functions
const TwilioFns = require( "./twilio" );
const EmailFns = require( "./email" );
// import envision functions
const Envision = require( "./envision" );

const { Router } = require( 'express' );
const router = new Router( );

router.use( ( req, res, next ) => {
  res.append( 'Access-Control-Allow-Origin', '*' );
  next( );
} )
router.use( TwilioFns );
router.use( EmailFns );
router.use( Envision );

module.exports = router;