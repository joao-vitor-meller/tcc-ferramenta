const express = require('express');
const pg = require('pg');

const config = {
    user: 'postgres',
    database: 'terras',
    password: 'secret',
    port: 5432
};

const routes = express.Router();

const pool = new pg.Pool(config);

routes.get('/', (req, res) => {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('select DISTINCT municipio from municipio order by municipio ASC', function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 res.status(400).send(err);
             }
             res.render('index.dust', {municipio: result.rows});
        })
    })    
})


routes.post('/cidades', (req, res) => {
     pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        client.query('select DISTINCT regiao, municipio, atividade, produção as producao, ano, valor as media, trunc(avg(valor*$2)) as calc from regiao, municipio, atividade, tempo where municipio.id_municipio = atividade.id_municipio and municipio.id_regiao = regiao.id_regiao and atividade.id_atividade = tempo.id_atividade and municipio.municipio = $1 GROUP BY regiao.id_regiao, municipio.id_municipio, atividade.id_atividade, tempo.id_tempo order by regiao, municipio, atividade, produção, ano desc',
        //client.query('select DISTINCT regiao, municipio, atividade, produção as producao, avg(valor) as media, trunc(avg(valor*$2)) as calc from regiao, municipio, atividade, tempo where municipio.id_municipio = atividade.id_municipio and municipio.id_regiao = regiao.id_regiao and atividade.id_atividade = tempo.id_atividade and municipio.municipio = $1 GROUP BY regiao.id_regiao, municipio.id_municipio, atividade.id_atividade order by regiao, municipio, atividade, produção',
        [req.body.cidade,req.body.hectare],
        function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 res.status(400).send(err);
             }
             res.render('resultado.dust', {regioes: result.rows, cidade: req.body.cidade, hectares: req.body.hectare});
        })
    })    
 
})

routes.post('/cidadesCalc', (req, res) => {
     pool.connect(function (err, client, done) {
        if (err) {
            console.log("Can not connect to the DB" + err);
        }
        //client.query('select DISTINCT regiao, municipio, atividade, produção as producao, ano, valor, trunc(avg(valor*$2)) as calc from regiao, municipio, atividade, tempo where municipio.id_municipio = atividade.id_municipio and municipio.id_regiao = regiao.id_regiao and atividade.id_atividade = tempo.id_atividade and municipio.municipio = $1 GROUP BY regiao.id_regiao, municipio.id_municipio, atividade.id_atividade, tempo.id_tempo order by regiao, municipio, atividade, produção, ano',
        client.query('select DISTINCT regiao, municipio from regiao, municipio where municipio.id_regiao = regiao.id_regiao and municipio.municipio = $1 GROUP BY regiao.id_regiao, municipio.id_municipio order by regiao, municipio LIMIT 1;',
        [req.body.cidade],
        function (err, result) {
             done();
             if (err) {
                 console.log(err);
                 res.status(400).send(err);
             }
            res.render('resultadoCalc.dust', { regioes: result.rows, cidade: req.body.cidade, hectares: req.body.hectare, atividade: req.body.atividade, producao: req.body.producao, valor: req.body.valor, calc:req.body.valor * req.body.hectare });
        })
    })    
 
})

module.exports = routes;