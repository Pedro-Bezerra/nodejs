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
const qr = require('qrcode');
const WebSocket = require('ws');
const methodOverride = require('method-override')
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
    parameterLimit: 6,
}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))
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
    console.log(req.session.passport.user)
    res.render('formulario');
});

app.get('/paratodosverem/principal', checkAuthenticated, async (req, res) => {
    const vetor = await controller.getTemasByUsuario(req, res);
    res.render('homeDoLogin', { array: vetor });
});

//app.get('/paratodosverem/leitura', (req, res) => {
//    res.setHeader('content-header', 'text/html');
//    res.sendFile(__dirname + '/public/telas/leitura.html');
//});
/*app.get('/paratodosverem/leitura', checkAuthenticated, (req, res) => {
    qr.toDataURL('http://localhost:3000/paratodosverem', (error, code) => {
        if (error) throw error;
        res.render('leitura', {subject: '', name: '', entity: '', description: '', qrcodeImage: code});
    });
});*/
/*app.get('/paratodosverem/leitura/:id', checkAuthenticated, async (req, res) => {
    const { id_tema, assunto, nome, responsavel, codigo, descricao } = await controller.getTemasById(req, res);
    res.render('leitura', {subject: assunto, name: nome, entity: responsavel, description: descricao, qrcodeImage: ''});
    //console.log(assunto, nome, responsavel, descricao);
});*/
app.get('/paratodosverem/leitura/:id', checkAuthenticated, async (req, res) => {
    try {
        qr.toDataURL('http://localhost:3000/paratodosverem/' + req.params.id, async (error, code) => {
            if (error) throw error;
            const { id_tema, categoria, nome, responsavel, codigo, descricao } = await controller.getTemasById(req, res);
            console.log(descricao)
            res.render('leitura', { subject: categoria, name: nome, entity: responsavel, description: descricao, qrcodeImage: code, temaCode: codigo });    
        });
        
    } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error appropriately, e.g., render an error page
        res.status(500).send("Internal Server Error");
    }
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
    successRedirect: '/paratodosverem/principal',
    failureRedirect: '/paratodosverem/login',
    failureFlash: true,
}));
/*
app.post('/paratodosverem/formulario', checkAuthenticated, async (req, res) => {
    if(await controller.insertTema(req, res)) {
        console.log("chegou aqui com sucesso");
        const redirecionamento = '/paratodosverem/leitura/' + await controller.getIdByCodigo(req.body.codigo);
        console.log(redirecionamento);
        res.redirect(redirecionamento);
    } else {
        console.log("não chegou aqui");
        res.redirect('/paratodosverem/leitura');
    }
});*/
app.post('/paratodosverem/formulario', checkAuthenticated, async (req, res) => {
    try {
        const inserted = await controller.insertTema(req, res);
        if (inserted) {
            console.log("chegou aqui com sucesso");
            const codigo = req.body.letra + req.body.codigo;
            const id = await controller.getIdByCodigo(codigo);
            const redirecionamento = '/paratodosverem/leitura/' + id;
            console.log(redirecionamento);
            res.redirect(redirecionamento);
        } else {
            console.log("não chegou aqui");
            res.redirect('/paratodosverem/principal');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
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


app.get('/paratodosverem/formulario/editar/:id', checkAuthenticated, (req, res) => {
    res.render('formularioEditar');
});


app.post('/paratodosverem/formulario/editar/:id', checkAuthenticated, async (req, res) => {
    try {
        const updated = await controller.updateTema(req, res);
        if (updated) {
            console.log("atualizou com sucesso");
            const redirecionamento = '/paratodosverem/leitura/' + req.params.id;
            console.log(redirecionamento);
            res.redirect(redirecionamento);
        } else {
            console.log("não chegou aqui");
            res.redirect('/paratodosverem/principal');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/', (req, res) => {
    res.render('home');
})

let server = app.listen(port,  () => console.info("servidor na porta 3000 inicializado"));
const wss = new WebSocket.Server({ server: server });

wss.on('connection', function connection(ws) {
    console.log('Conectei pelo WebSocket');
    ws.send('WebSocket conectado com sucesso');
    ws.on('message', function incoming(message) {
        console.log('Código recebido: %s', message);
        controller.deleteTema(message);
        console.log('Tema removido com sucesso');
    })

});

app.delete('/paratodosverem/logout', checkAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            return console.log(err)
        }
        res.redirect('/paratodosverem');
    });
})
