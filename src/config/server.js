const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mysql = require('mysql');
const formidable = require('formidable');

var conexion = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'whatsappclone'
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let server = http.createServer(app);

server.listen(3000, (error) => {
    if(error) console.error(`Error al iniciar server: ${ error }`)

    console.log(`Servidor corriendo en el puerto 3000`);
});

module.exports.io = socketIO(server);// exportamos Socket IO

app.get('/', (req, res) => {
    console.log(`Peticion GET`);

    res.send("Ola k ace");
});

app.post('/registro', (req, res) => {
    console.log( `Peticion de Registro \n ${ JSON.stringify( req.body ) }` );

    var contacto = req.body;

    conexion.query(
        'INSERT INTO contactos VALUES (?, ?, ?, ?, ?)',
        [contacto.id, contacto.nombre, contacto.pass, contacto.estado, contacto.urlImg],
        (error, resp) => {
            if(error){
                console.error(`>>> ERROR EN LA BASE DE DATOS \n ${ error }`)

                let jsonResp = { 'respuesta' : 'fail' };

                if( error.code == 'ER_DUP_ENTRY' )
                    jsonResp.respuesta = 'id_duplicado';

                res.json( jsonResp );

            } else {
                console.log(`== RESPUESTA DE LA BASE DE DATOS \n ${ JSON.stringify(resp) }`);

                res.json({
                    'respuesta' : 'okay'
                })
            }
        }
    );

});

app.post('/login', (req, res) => {
    console.log(`Peticion de Login\n ${ JSON.stringify( req.body ) }`);

    let contacto = req.body;

    conexion.query(
        'SELECT COUNT(*) AS cantidad FROM contactos WHERE id = ? AND pass = ?',
        [contacto.id, contacto.pass],
        (error, respBD) => {

            if( error ) {
                res.json({
                    'respuesta' : 'fail'
                });

            }else{
                if( respBD[0].cantidad > 0 ){
                    res.json({
                        'respuesta': 'okay'
                    });
                }else{
                    res.json({
                        'respuesta': 'credenciales_incorrectas'
                    });
                }

            }
        }
    );

});

app.post('/subir_archivo', (req, res) => {
    let form = formidable.IncomingForm();

    // Parseamos la request para obtener el formulario de ella
    form.parse(req, (error, campos, archivos) => {

        if(error) return res.json({'respuesta' : 'guardado_fallido'});

        console.log(`Archivos recibidos: ${ JSON.stringify(archivos) }`);
        console.log(`Campos recibidos: ${ JSON.stringify(campos) }`);

        let rutaTemp = archivos.imagen.path;
        let nuevaRuta = 'C:/Users/usuario/WhatsAppClonServer/imgs/' + campos.usuario + '.jpg';

        fs.rename(rutaTemp, nuevaRuta, error => {
            if(error){
                res.json({
                    'respuesta' : 'guardado_fallido'
                });
            }else{
                res.json({
                    'respuesta' : 'guardado_exitoso'
                });
            }
        });
    })
});