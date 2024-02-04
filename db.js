const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, '.env')
});

const {Pool} = require('pg');

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

module.exports = pool;

//const app = require('express')();

/*app.get("/all", async (req, res) => {
    const fromDate = new Date();
    
    const results = await pool.query("SELECT * FROM tema_leitura");
    console.table(results.rows);

    const toDate = new Date();
    const elapsed = toDate.getTime() - fromDate.getTime();

    //res.send({"rows": results.rows, "elapsed": elapsed, "method": "pool"})
    res.send(results.rows);

})

app.listen(9000, () => console.log("Listening on port 9000"))*/


/*
(async () => {
    try {
        const {rows} = await pool.query('SELECT current_user');
        const currentUser = rows[0]['current_user'];
        console.log(currentUser);
    } catch(err) {
        console.log(err);
    }
})();*/