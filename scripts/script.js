const crearFormulario = document.getElementById('crear')
const loginFormulario = document.getElementById('login')
const regMail = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/

const user = document.getElementById('user')

crearFormulario.addEventListener('submit', e => {
  e.preventDefault()
  const nombre = crearFormulario.elements['nom'].value.trim()
  const email = crearFormulario.elements['email'].value.trim()
  const pass = crearFormulario.elements['password'].value
  const pass2 = crearFormulario.elements['pss2'].value
  const error = []
  if (nombre.length < 1) error.push('No has introducido un nombre\n')
  if (pass.length < 8)
    error.push('La contraseña tiene que tener más de 8 caracteres\n')
  if (pass !== pass2) error.push('Las constraseñas no coinciden\n')
  if (!regMail.exec(email)) error.push('El mail no es válido\n')

  if (error.length > 0) {
    let mensaje = error.reduce((cont, text) => cont + text)
    alert(mensaje)
  } else {
    crearFormulario.submit()
  }
})

loginFormulario.addEventListener('submit', e => {
  e.preventDefault()
  const email = loginFormulario.elements['email'].value.trim()
  const pass = loginFormulario.elements['password'].value
  const error = []
  if (!regMail.exec(email)) error.push('El mail no es válido\n')
  if (pass.length < 8)
    error.push('La contraseña tiene que tener más de 8 caracteres\n')
  if (error.length > 0) {
    let mensaje = error.reduce((cont, text) => cont + text)
    alert(mensaje)
  } else {
    loginFormulario.submit()
  }
})


user.addEventListener('load', () {
  fetch('/api/users', ())
})