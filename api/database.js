var sqlite3 = require('sqlite3').verbose()
var crypto = require('crypto-js')

const DBSOURCE = 'db.sqlite'

let db = new sqlite3.Database(DBSOURCE, err => {
  if (err) {
    // Cannot open database
    console.error(err.message)
    throw err
  } else {
    console.log('Connected to the SQLite database.')
    db.run(
      `CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text, 
            email text UNIQUE, 
            password text, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
      err => {
        if (err) {
          // Table already created
        } else {
          // Table just created, creating some rows
          var insert = 'INSERT INTO user (name, email, password) VALUES (?,?,?)'
          db.run(insert, [
            'admin',
            'admin@example.com',
            crypto.SHA512('admin123456').toString(),
          ])
          db.run(insert, [
            'user',
            'user@example.com',
            crypto.SHA512('user123456').toString(),
          ])
        }
      }
    )
    db.run(
      `CREATE TABLE messages (
            iduser INTEGER,
            date TEXT, 
            message TEXT, 
            CONSTRAINT user_date_pk PRIMARY KEY (iduser, date),
            CONSTRAINT user_fk FOREIGN KEY (iduser) REFERENCES user(id)
            )`,
      err => {
        if (err) {
          // Table already created
        }
      }
    )
  }
})

module.exports = db
