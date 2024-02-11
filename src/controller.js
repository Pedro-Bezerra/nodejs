const pool = require('../db');
const queries = require('./queries');

const getTemas = (req, res) => {
    pool.query(queries.getTemas, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    });
}

/*const getTemasById = (req, res) => {
    let array = [];
    const id = parseInt(req.params.id);
    pool.query(queries.getTemasById, [id], (error, results) => {
        if (error) throw error;
        //const { id_tema, assunto, nome, responsavel, codigo, descricao } = results.rows[0];
        //console.log(assunto, nome, responsavel, descricao);
        array = results.rows[0];
        console.log(array);
    })
    console.log(array);
    return array;
};*/

const getTemasById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        //console.log(id);
        const results = await pool.query(queries.getTemasById, [id]);
        const array = results.rows[0];
        console.log(array);
        return array;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getTemasByUsuario = async (req, res) => {
    try {
        const id = req.session.passport.user;
        const results = await pool.query(queries.getTemasByUsuario, [id]);
        console.log(results.rows);
        if (results) {
            return results.rows;
        } 
        return null
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/*const insertTema = (req, res) => {
    const { assunto, nome, responsavel, codigo, descricao } = req.body;
    pool.query(queries.checkCodigoExists, [codigo], (error, results) => {
        if(results.rows.length) {
            //res.send("Tema de código ", codigo, " já foi cadastrado");
            console.log('já foi cadastrado');
            return false;
        } else {
            pool.query(queries.insertTema, [assunto, nome, responsavel, codigo, descricao], (error, results) => {
                if (error) throw error;
                return true;
                //res.status(201).send("Tema inserido com sucesso");
            })
        }
    });
};*/

const insertTema = async (req, res) => {
    let { categoria, nome, responsavel, letra, codigo, descricao } = req.body;
    const id_usuario = req.session.passport.user;
    codigo = letra + codigo;
    const resultados = await pool.query(queries.checkCodigoExists, [codigo]);
    if (!resultados.rows.length) {
        try {
            const temas = await pool.query(queries.insertTema, [categoria, nome, responsavel, codigo, descricao, id_usuario]);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    console.log('não foi cadastrado');
    return false;
};

const insertUsuario = (req, res, senha) => {
    const { nome, sobrenome, email } = req.body;
    pool.query(queries.checkEmail, [email], (error, results) => {
        if(results && results.rows.length > 0) {
            console.info('já foi cadastrado');
        } else {
            pool.query(queries.insertUsuario, [nome, sobrenome, email, senha], (error, results) => {
                if (error) throw error;
            });
        }
    });
};

const getTemaById = async (id) => {
    const results = await pool.query(queries.getTemasById);
    return results.rows[0];
}

const getUsuarioByEmail = async (email) => {
    const results = await pool.query(queries.checkEmail, [email]);
    return results.rows[0];
};

const getUsuarioById = async (id) => {
    const results = await pool.query(queries.checkId, [id]);
    return results.rows[0];
};

const getIdByCodigo = async (codigo) => {
    const results = await pool.query(queries.checkCodigoExists, [codigo]);
    //console.log(results.rows[0].id_tema);
    return results.rows[0].id_tema;
}

const updateTema = async (req, res) => {
    let { categoria, letra, nome, responsavel, codigo, descricao } = req.body;
    codigo = letra + codigo;
    console.log(codigo);
    const resultados = await pool.query(queries.getTemasById, [req.params.id]);
    if (resultados.rows.length) {
        try {
            const temas = await pool.query(queries.updateTema, [categoria, nome, responsavel, descricao, req.params.id]);
            console.log(temas);
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    console.log('não foi cadastrado');
    return false;
}

const deleteTema = async (codigo) => {
    try {
        const removido = await pool.query(queries.deleteTema, [codigo]);
        return true;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    getTemas, 
    getTemasById,
    insertTema,
    insertUsuario,
    getUsuarioByEmail,
    getUsuarioById,
    getIdByCodigo,
    updateTema,
    getTemaById,
    getTemasByUsuario,
    deleteTema,
}