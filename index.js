const ex = require( "express" );
const pkg = require( "./package.json" );
const { name } = pkg;
const { Router } = ex;
const app = ex( );
const api = require( "./api/index" );
let host = `0.0.0.0`;
let port = 5010;

app.use( '/api/v1', api );
app.use( "/src", ex.static( "./src" ) );
app.use( "/bower_components", ex.static( "./bower_components" ) );
app.use( "/", ex.static( "." ) );
const server = app.listen(process.env.PORT || 5000);

server.on( "listening", z => console.log( `Server listening on http://${server.address().address}:${server.address().port}` ) ).on( "error", err => console.error( err ) );