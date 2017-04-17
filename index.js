const ex = require( "express" );
const pkg = require( "./package.json" );
const { name } = pkg;
const { static, Router } = ex;
const app = ex( );

let host = `localhost`;
let port = 5010;

const server = app.use( static( "build/unbundled" ) )
  .all( '*', logHost, ( req, res ) => res.redirect( '/' ) ).listen( port, host );

server.on( "listening", z => console.log( `Server listening on http://${server.address().address}:${server.address().port}` ) ).on( "error", err => console.error( err ) );

function logHost( req, res, next ) {
  console.log( `Request made to: ${host}` );
  next( );
}