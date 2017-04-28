const Twilio = require( 'twilio' );
const AccountId = 'ACf4b1b6f82373457668a6f2cf510347e2';
const Token = '505276292fe9e5ca6bd26841ba7bc3ae';
const { Router } = require( 'express' );
let client = new Twilio( AccountId, Token );
let router = new Router( );

const IntroMessage = `
Here is your prescription savings card. It's activated!

Member ID: CBS2233
Group ID: CBS2
BIN: 014244
PCN: ROIRX

Questions? 1-877-684-0032`;


router.use( "/sms", ( req, res, next ) => {
  client.messages.create( {
    from: "+16466811609",
    to: "+12035896988",
    body: IntroMessage,
    mediaUrl: "https://carecard-beta.ethershaft.engineering/src/sections/graphics/carecard_email_sms.png"
  }, ( err, response ) => {
    err ? console.error( err ) : console.log( response );
  } );
} );

module.exports = router;