if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
//const srcRoutes = require('./src/routes');
const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const controller = require('./src/controller');
const app = express();
const port = 3000;

const iniciarPassport = require('./passport-config');
const { checkCodigoExists } = require('./src/queries');
iniciarPassport.iniciar(
    passport, 
    controller.getUsuarioByEmail,
    controller.getUsuarioById
);
// Aplicar os elementos estáticos - html, imagens, css
app.use(express.static('./public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({
    extended: false,
    limit: 10000,
    parameterLimit: 5,
}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

//app.use('/paratodosverem', srcRoutes);
app.set('view engine', 'ejs');

app.get('/paratodosverem', checkNotAuthenticated, (req, res) => {
    res.render('home');
});

app.get('/paratodosverem/cadastro', checkNotAuthenticated, (req, res) => {
    res.render('cadastro');
});

app.get('/paratodosverem/login', checkNotAuthenticated, (req, res) => {
    res.render('login');
});

app.get('/paratodosverem/formulario', checkAuthenticated, (req, res) => {
    res.render('formulario');
});

//app.get('/paratodosverem/leitura', (req, res) => {
//    res.setHeader('content-header', 'text/html');
//    res.sendFile(__dirname + '/public/telas/leitura.html');
//});
app.get('/paratodosverem/leitura', checkAuthenticated, (req, res) => {
    res.render('leitura', {subject: '', name: '', entity: '', description: ''});
});
app.get('/paratodosverem/leitura/:id', async (req, res) => {
    const { id_tema, assunto, nome, responsavel, codigo, descricao } = await controller.getTemasById(req, res);
    res.render('leitura', {subject: assunto, name: nome, entity: responsavel, description: descricao});
    //console.log(assunto, nome, responsavel, descricao);
});

app.post('/paratodosverem/cadastro', checkNotAuthenticated, async (req, res) => {
    try {
        if (req.body.senha === req.body.senha2) {
            const hashSenha = await bcrypt.hash(req.body.senha, 10);
            controller.insertUsuario(req, res, hashSenha);
            res.redirect('/paratodosverem/login');
        } else {
            res.send("As senhas não são idênticas");
        }
    } catch (error) {
        res.redirect('/paratodosverem/cadastro');
    }
});

app.post('/paratodosverem/login', passport.authenticate('local',
{
    successRedirect: '/paratodosverem/formulario',
    failureRedirect: '/paratodosverem/login',
    failureFlash: true,
}));

app.post('/paratodosverem/formulario', checkAuthenticated, async (req, res) => {
    if(await controller.insertTema(req, res)) {
        console.log("chegou aqui com sucesso");
        res.redirect('/paratodosverem/leitura/' + controller.getIdByCodigo(req.body.codigo));
    } else {
        console.log("não chegou aqui");
        res.redirect('/paratodosverem/leitura');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/paratodosverem/login');
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/paratodosverem/formulario');
    }
    next();
}

app.listen(port,  () => console.info("servidor na porta 3000 inicializado"));