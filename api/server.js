// Create express app
var express = require('express')
var app = express()
var db = require('./database.js')
var crypto = require('crypto-js')
var fs = require('fs')
var https = require('https')
const cors = require('cors') //Para aceptar consultas de otros
var bodyParser = require('body-parser')
const {config} = require('./config.js') //Archivo de configuración del servidor

app.use(cors(config.application.cors.server))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//SERVIDOR HTTPS
const PUERTO = 8000

https
  .createServer(
    {
      cert: fs.readFileSync('cert.crt'),
      key: fs.readFileSync('key.key'),
    },
    app
  )
  .listen(PUERTO, function () {
    console.log('Servidor https correindo en el puerto ' + PUERTO)
  })

app.get('/', function (req, res) {
  res.send('Hola, estas en la pagina inicial')
  console.log('Se recibio una petición get a través de https')
})

// Insert here other API endpoints
app.get('/api/users', (req, res, next) => {
  var sql = 'select * from user'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message})
      return
    }
    res.json({
      message: 'success',
      data: rows,
    })
  })
})

app.get('/api/user/:id', (req, res, next) => {
  var sql = 'select * from user where id = ?'
  var params = [req.params.id]
  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({error: err.message})
      return
    }
    res.json({
      message: 'success',
      data: row,
    })
  })
})

app.post('/api/user/', (req, res, next) => {
  var errors = []
  if (!req.body.password) {
    errors.push('No password specified')
  }
  if (!req.body.email) {
    errors.push('No email specified')
  }
  if (errors.length) {
    res.status(400).json({error: errors.join(',')})
    return
  }
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: crypto.SHA512(req.body.password).toString(),
  }
  var sql = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params = [data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({error: err.message})
      return
    }
    res.json({
      message: 'success',
      data: data,
      id: this.lastID,
    })
  })
})

app.patch('/api/user/:id', (req, res, next) => {
  var data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password ? sha512(req.body.password) : null,
  }
  db.run(
    `UPDATE user set 
         name = COALESCE(?,name), 
         email = COALESCE(?,email), 
         password = COALESCE(?,password) 
         WHERE id = ?`,
    [data.name, data.email, data.password, req.params.id],
    function (err, result) {
      if (err) {
        res.status(400).json({error: res.message})
        return
      }
      res.json({
        message: 'success',
        data: data,
        changes: this.changes,
      })
    }
  )
})

app.delete('/api/user/:id', (req, res, next) => {
  db.run(
    'DELETE FROM user WHERE id = ?',
    req.params.id,
    function (err, result) {
      if (err) {
        res.status(400).json({error: res.message})
        return
      }
      res.json({message: 'deleted', changes: this.changes})
    }
  )
})

app.post('/api/login', (req, res, next) => {
  const mail = req.body.email
  const pass = crypto.SHA512(req.body.password).toString()
  var sql = 'SELECT * FROM user WHERE email = ? AND password = ?'
  db.get(sql, [mail, pass], (err, user) => {
    if (err) res.status(400).json({error: res.message})
    else {
      if (user) {
        res.json({mensaje: 'success'})
      } else {
        res.json({mensaje: 'Constraseñas incorrecta'})
      }
    }
  })
})

app.post('/api/comments/', (req, res) => {
  var errors = []
  if (!req.body.message) {
    errors.push('No message specified')
  }
  if (errors.length) {
    return res.status(400).json({error: errors.join(',')})
  }
  var data = {
    message: req.body.message,
    id: req.body.iduser,
    date: new Date().toLocaleString(),
  }
  var sql = 'INSERT INTO messages (iduser, date, message) VALUES (?,?,?)'
  var params = [data.id, data.date, data.message]
  db.run(sql, params, function (err, result) {
    if (err) {
      res.status(400).json({error: err.message})
      return
    }
    res.json({
      message: 'success',
    })
  })
})

app.get('/api/comments/:id', (req, res) => {
  var sql = 'select * from messages where iduser = ?'
  var params = req.params.id
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({error: err.message})
      return
    }
    res.json({
      message: 'success',
      data: rows,
    })
  })
})
