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
        const results = await pool.query(queries.getTemasById, [id]);
        const array = results.rows[0];
        console.log(array);
        return array;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const insertTema = (req, res) => {
    const { assunto, nome, responsavel, codigo, descricao } = req.body;
    pool.query(queries.checkCodigoExists, [codigo], (error, results) => {
        if(results.rows.length) {
            res.send("Tema de código ", codigo, " já foi cadastrado");
            console.log('já foi cadastrado');
        } else {
            pool.query(queries.insertTema, [assunto, nome, responsavel, codigo, descricao], (error, results) => {
                if (error) throw error;
                res.status(201).send("Tema inserido com sucesso");
            })
        }
    });
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

const getUsuarioByEmail = async (email) => {
    const results = await pool.query(queries.checkEmail, [email]);
    return results.rows[0];
};

const getUsuarioById = async (id) => {
    const results = await pool.query(queries.checkId, [id]);
    return results.rows[0];
};

module.exports = {
    getTemas, 
    getTemasById,
    insertTema,
    insertUsuario,
    getUsuarioByEmail,
    getUsuarioById
}