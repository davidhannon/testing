/* Twilio Setup */
const Twilio = require( 'twilio' );
const AccountId = 'ACf4b1b6f82373457668a6f2cf510347e2';
const Token = '505276292fe9e5ca6bd26841ba7bc3ae';
let client = new Twilio( AccountId, Token );

/* API Routing */
const { Router } = require( 'express' );
const bodyParser = require( 'body-parser' );
let router = new Router( );

const IntroMessage = `
  Here is your prescription savings card. It's activated!

  Member ID: CBS2233
  Group ID: CBS2
  BIN: 014244
  PCN: ROIRX

  Questions? 1-877-684-0032`;

router.use( "/sms", bodyParser.json( ), ( req, res, next ) => {
  let { phone: phoneNumber } = req.body;

  client.messages.create( {
    from: "+16466811609",
    to: phoneNumber,
    body: IntroMessage,
    mediaUrl: "https://carecard-beta.ethershaft.engineering/src/sections/graphics/carecard_email_sms.png"
  }, ( err, response ) => {
    err ? ( res.send( { ok: false } ) && console.error( err ) ) : res.send( { ok: true } );
  } );
} );

module.exports = router;