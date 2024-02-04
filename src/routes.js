const { Router } = require('express');
//const express = require('express');
const controller = require('./controller');
//const cors = require('cors');
//const app = express();
const router = Router();

/*app.use(cors());
app.use(express.urlencoded({
    extended: false,
    limit: 10000,
    parameterLimit: 5,
}));*/

router.get('/paratodosverem', controller.getTemas);
router.get('/paratodosverem/:id', controller.getTemasById);
router.post('/paratodosverem/formulario', controller.insertTema);

module.exports = router;