const LocalStrategy = require('passport-local').Strategy;
const controller = require('./src/controller');
const bcrypt = require('bcrypt');

function iniciar(passport, getUsuarioByEmail, getUsuarioById) {
    const autenticarUsuario = async (email, senha, done) => {
        const usuario = await getUsuarioByEmail(email);
        console.log(usuario);
        if (!usuario) {
            return done(null, false, { message: "Não há usuário com o e-mail informado" })
        }
        try {
            if(await bcrypt.compare(senha, usuario.senha)) {
                return done(null, usuario);
            } else {
                return done(null, false, { message: "Senha inválida" });
            }
        } catch (error) {
            return done(error);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, autenticarUsuario));
    passport.serializeUser((usuario, done) => done(null, usuario.id_usuario));
    passport.deserializeUser((id, done) => done(null, getUsuarioById(id)));
}

module.exports = {
    iniciar,
}