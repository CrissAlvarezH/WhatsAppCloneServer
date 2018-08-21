
class UsuariosControlador {

    constructor(){
        this.usuarios = [];
    }

    getUsuarios(){
        return this.usuarios;
    }

    agregarUsuario( usuario ){
        this.usuarios.push( usuario );
    }

    getUsuario( idUsuario ){
        let personasFiltradas =  this.usuarios.filter( (usuario) => usuario.idSocket == idUsuario );

        // Sabemos que solo debe haber una coincidencia
        return personasFiltradas[0];
    }

    borrarUsuario( idUsuario ){
        let usuarioBorrar = this.getUsuario( idUsuario );

        // Creamos un nuevo array con los usuarios que no tengan el id idUsuario
        let usuariosRestantes = this.usuarios.filter( (usuario) => usuario.idSocket != idUsuario );

        // Reemplazamos los usuarios con los restantes
        this.usuarios = usuariosRestantes;

        // Retornamos el usuario borrado para tener registro de esta acción
        return usuarioBorrar;
    }
}

module.exports = {
    UsuariosControlador
}