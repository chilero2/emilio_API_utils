const crearFormulario = document.getElementById('crear')
const loginFormulario = document.getElementById('login')
const messagesForm = document.getElementById('messages')
const createMessages = document.getElementById('createMessages')
const buttons = document.getElementById('list')
const forms = document.querySelectorAll('.form')
const regMail = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/

window.addEventListener('load', () => {
  fetch('https://localhost:8000/api/users')
    .then((res) => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
    .then((res) => res.json())
    .then((res) => {
      const users = document.getElementById('user')
      const usersCreate = document.getElementById('user_create')
      users.append(createSelect(res.data))
      usersCreate.append(createSelect(res.data))
    })
    .catch((res) => alert('Error en la petición'))
})

buttons.addEventListener('click', (e) => {
  const actions = {
    Login: 'form__login',
    'Crear Usuario': 'form__createUser',
    'Ver Mensajes': 'form__message',
    'Crear mensajes': 'form__createMessage',
  }
  ocultar(forms)

  mostrar(actions[e.target.textContent])

  e.target.classList.add('show')
})

crearFormulario.addEventListener('submit', (e) => {
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

loginFormulario.addEventListener('submit', (e) => {
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

messagesForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const userId = messagesForm.elements['user'].value
  fetch(`https://localhost:8000/api/comments/${userId}`)
    .then((res) => (res.ok ? Promise.resolve(res) : Promise.reject(res)))
    .then((res) => res.json())
    .then((res) => {
      const box = document.getElementById('showMessages')
      box.textContent = ''
      const fragment = document.createDocumentFragment()
      const table = document.createElement('table')
      const encabezado = document.createElement('tr')
      const fechas = document.createElement('th')
      fechas.textContent = 'Fecha'
      encabezado.append(fechas)
      const mensajes = document.createElement('th')
      mensajes.textContent = 'Mensaje'
      encabezado.append(mensajes)
      table.append(encabezado)
      res.data.forEach((user) => {
        const fila = document.createElement('tr')
        const fecha = document.createElement('td')
        fecha.textContent = user.date
        fila.append(fecha)
        const mensaje = document.createElement('td')
        mensaje.textContent = user.message
        fila.append(mensaje)
        table.append(fila)
      })
      fragment.append(table)
      box.append(fragment)
    })
    .catch((res) => alert('Error en la petición'))
})

createMessages.addEventListener('submit', (e) => {
  e.preventDefault()
  if (document.getElementById('message').value.trim().length < 1) {
    alert('Hay que que escribir un comentario')
  } else {
    createMessages.submit()
  }
})

const ocultar = (element) => {
  element.forEach((div) => {
    div.classList.add('hidden')
  })
}

const mostrar = (classForm) => {
  const mostrar = [...forms].filter((form) =>
    form.classList.contains(classForm)
  )
  console.log(mostrar[0])
  mostrar[0].classList.remove('hidden')
}

const createSelect = (data) => {
  const fragment = document.createDocumentFragment()
  data.forEach((user) => {
    const optionItem = document.createElement('option')
    optionItem.textContent = user.email
    optionItem.setAttribute('value', user.id)
    fragment.append(optionItem)
  })
  return fragment
}
