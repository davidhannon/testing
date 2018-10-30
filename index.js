require('newrelic');
const ex = require( "express" );
const pkg = require( "./package.json" );
import path from 'path'
const { name } = pkg;
const { Router } = ex;
const app = ex( );
const api = require( "./api/index" );
let host = `0.0.0.0`;
let port = 5010;

const ensureSecure = (req, res, next) => {
  if (!req.hostname.includes('www.takecardcard.com')) {
    return next();
  }
  if (req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  res.redirect(`https://${req.hostname}${req.url}`);
};

app.use(ensureSecure)
app.use( '/api/v1', api );
app.use( "/src", ex.static( path.join(__dirname, "build/src") ) );
app.use( "/bower_components", ex.static(path.join(__dirname, 'build/bower_components')));
app.use(ex.static(path.join(__dirname, '/public')))
app.use( "/build", ex.static( "./build" ) );
// app.use( "/", ex.static( "." ) );

app.get('*', function(req, res){
  res.sendFile('index.html', { root: __dirname + "/build" } );
});

const server = app.listen(process.env.PORT || 5000);

server.on( "listening", z => console.log( `Server listening on http://${server.address().address}:${server.address().port}` ) ).on( "error", err => console.error( err ) );