// import twilio/SMS functions
const TwilioFns = require( "./twilio" );
// import envision functions
const Envision = require( "./envision" );

const { Router } = require( 'express' );
const router = new Router( );

router.use( TwilioFns );
router.use( Envision );

module.exports = router;