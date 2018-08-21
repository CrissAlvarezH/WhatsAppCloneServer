const { io } = require('./config/server');
const { UsuariosControlador } = require('./controladores/UsuariosControlador');
const colors  = require('colors/safe');

const usuarioCtrl = new UsuariosControlador();

io.on('connection', (cliente) => {

    console.log( colors.yellow(`Usuario conectado, id: ${ cliente.id }`) );

    cliente.on('entrarChat', (usuario) => {
        console.log( colors.blue(`Usuario entró al char ${ JSON.stringify( usuario ) }`) );

        let usuariosConectados = usuarioCtrl.agregarUsuario(usuario);

        cliente.emit('entradaAlChat', cliente.id);// Le mandamos el id al usuario conectado

        // Avisamos a los demas usuarios que se conectó alguien
        cliente.broadcast.emit('usuarioConectado', usuario);
        cliente.broadcast.emit('listarConectados', usuarioCtrl.getUsuarios());

        console.log( colors.blue(`Usuarios conectados ${ JSON.stringify (usuarioCtrl.getUsuarios() ) }`));
    });

    cliente.on('enviarMensaje', (idEmisor, idReceptor, mensaje) => {
        cliente.broadcast.to(idReceptor).emit('recibirMensaje', {
            'idEmisor': idEmisor,
            'mensaje': mensaje
        });
    });

    cliente.on('disconnect', () => {
        console.log( colors.red(`Usuario desconectado, id: ${ cliente.id }`) );

        let usuarioDesconectado = usuarioCtrl.borrarUsuario( cliente.id );

        // Avisamos a los demas que se desconectó alguien
        cliente.broadcast.emit('usuarioDesconectado', usuarioDesconectado);
        cliente.broadcast.emit('listarConectados', usuarioCtrl.getUsuarios());

        console.log( colors.red(`Usuarios conectados ${ JSON.stringify (usuarioCtrl.getUsuarios() )  }`));
    });

});