const getTemas = "SELECT * FROM temas"
const getTemasById = "SELECT * FROM temas WHERE id_tema = $1";
const insertTema = "INSERT INTO temas(categoria, nome, responsavel, codigo, descricao, id_usuario) VALUES ($1, $2, $3, $4, $5, $6)";
const checkCodigoExists = "SELECT id_tema FROM temas WHERE codigo = $1";
const insertUsuario = "INSERT INTO usuarios(nome, sobrenome, email, senha) VALUES ($1, $2, $3, $4)";
const checkEmail = "SELECT * FROM usuarios WHERE email = $1"
const checkId = "SELECT * FROM usuarios WHERE id_usuario = $1"
const updateTema = `UPDATE temas 
SET categoria = $1,
	nome = $2,
	responsavel = $3,
	descricao = $4
WHERE id_tema = $5`;
const getTemasByUsuario = "SELECT id_tema, codigo, nome FROM TEMAS WHERE id_usuario = $1";

module.exports = {
    getTemas, 
    getTemasById,
    insertTema,
    checkCodigoExists,
    insertUsuario,
    checkEmail,
    checkId,
    updateTema,
    getTemasByUsuario,
}