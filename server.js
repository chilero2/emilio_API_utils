var db = require('./database.js')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Create express app
var express = require('express')
var app = express()

// Server port
var HTTP_PORT = 8000
// Start server
app.listen(HTTP_PORT, () => {
  console.log('Server running on port %PORT%'.replace('%PORT%', HTTP_PORT))
})
// Root endpoint
app.get('/', (req, res, next) => {
  res.json({ message: 'Ok' })
})

// Insert here other API endpoints
app.get('/api/users', (req, res, next) => {
  var sql = 'select * from user'
  var params = []
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
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
      res.status(400).json({ error: err.message })
      return
    }
    res.json({
      message: 'success',
      data: row,
    })
  })
})

app.post("/api/user/", (req, res, next) => {
  var errors=[]
  if (!req.body.password){
      errors.push("No password specified");
  }
  if (!req.body.email){
      errors.push("No email specified");
  }
  if (errors.length){
      res.status(400).json({"error":errors.join(",")});
      return;
  }
  var data = {
      name: req.body.name,
      email: req.body.email,
      password : md5(req.body.password)
  }
  var sql ='INSERT INTO user (name, email, password) VALUES (?,?,?)'
  var params =[data.name, data.email, data.password]
  db.run(sql, params, function (err, result) {
      if (err){
          res.status(400).json({"error": err.message})
          return;
      }
      res.json({
          "message": "success",
          "data": data,
          "id" : this.lastID
      })
  });
})

// Default response for any other request
app.use(function (req, res) {
  res.status(404)
})
