const ex = require( "express" );
const pkg = require( "./package.json" );
const { name } = pkg;
const { static, Router } = ex;
const app = ex( );
const api = require( "./api/index" );
let host = `0.0.0.0`;
let port = 5010;

app.use( '/api/v1', api );
app.use( "/src", static( "./src" ) );
app.use( "/bower_components", static( "./bower_components" ) );
app.use( "/", ( req, res, next ) => res.sendFile( "index.html", { root: process.cwd( ) } ) );
const server = app.listen( port, host );

server.on( "listening", z => console.log( `Server listening on http://${server.address().address}:${server.address().port}` ) ).on( "error", err => console.error( err ) );