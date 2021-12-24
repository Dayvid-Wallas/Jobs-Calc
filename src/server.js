const express = require('express');
const server = express();
const routes = require('./routes');
const path = require('path');

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));

//Habilitar arquivos statics
server.use(express.static('public'));

//To use request.body
server.use(express.urlencoded({extended: true}));

//routes
server.use(routes);

//request and Response
/*server.get('/', (request, response) => {
    return response.sendFile(`${__dirname}/views/index.html`);
});*/

server.listen(5500, () => { console.log('Server ON!') }); 
