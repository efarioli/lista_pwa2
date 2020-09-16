let listaProductos = []
const endpoint = 'https://5f61ec3889dbd70016e190fa.mockapi.io/lista'
const s = selector => document.querySelector(selector)
const a = selector => [...document.querySelectorAll(selector)]

class ajax2 {
  constructor(url, { queryString = '', method = 'get', data, responseType = 'json' } = {}) {
    this.url = url
    this.method = method
    this.data = data
    this.responseType = responseType
    this.queryString = queryString
  }
  static objectToStrParam(obj) {
    let str = ''
    for (var key in obj) {
      if (str != '') {
        str += '&'
      }
      str += key + '=' + encodeURIComponent(obj[key])
    }
    return str
  }
  response() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.responseType = this.responseType
      xhr.open(this.method, `${this.url}${this.queryString}`)
      xhr.addEventListener('load', () => {
        resolve(xhr.response)
      })
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      xhr.send(ajax2.objectToStrParam(this.data))
    })
  }
}
let doAjax = (xhr, callback) => {
  xhr
    .response()
    .then(callback)
    .catch(err => console.log(err))
}

const borrarProducto = id => deleteProductoWeb(id, renderLista)

function cambiarCantidad(id, e) {
  const cantidad = Number(e.value)
  const index = listaProductos.findIndex(prod => prod.id == id)
  listaProductos[index].cantidad = cantidad
  const nuevoProducto = listaProductos[index]
  updateProductoWeb(id, nuevoProducto, () => {
    console.log('Modificado correctamente')
  })
}

function cambiarPrecio(id, e) {
  const precio = Number(e.value)
  const index = listaProductos.findIndex(prod => prod.id == id)

  listaProductos[index]['precio'] = precio
  const nuevoProducto = listaProductos[index]

  updateProductoWeb(id, nuevoProducto, () => {
    console.log('Modificado correctamente')
  })
}

function configurarListeners() {
  s('#btn_entrada_producto').addEventListener('click', () => {
    const inputProducto = s('#ingreso_producto')

    let prod = inputProducto.value
    if (prod !== '') {
      const producto = { nombre: prod, cantidad: 0, precio: 0 }
      inputProducto.value = ''
      inputProducto.focus()
      postProductoWeb(producto, renderLista)
    }
  })
  s('#btn_borrar_todos_productos').addEventListener('click', () => {
    listaProductos = []
    renderLista()
  })
}

function renderLista() {
  const xhr = new ajax2('templates/lista-productos.hbs', { responseType: 'text' })
  console.log(xhr)

  xhr.response().then(source => {
    console.log(source)
    var template = Handlebars.compile(source)
    console.log(template)
    getProductosWeb2()
      .response()
      .then(respuesta => {
        listaProductos = respuesta
        s('#lista').innerHTML = template({ listaProductos })
        componentHandler.upgradeElements(s('#lista'))
      })
      .catch(err => {
        console.log(err)
      })
  })
}

function getProductosWeb(callback) {
  const xhr = new ajax2(endpoint)
  doAjax(xhr, callback)
}
function getProductosWeb2() {
  return new ajax2(endpoint)
  //   doAjax(xhr, callback)
}

function deleteProductoWeb(id, callback) {
  const xhr = new ajax2(endpoint, { method: 'delete', queryString: `/${id}` })
  doAjax(xhr, callback)
}

function updateProductoWeb(id, producto, callback) {
  const xhr = new ajax2(endpoint, { method: 'put', data: producto, queryString: `/${id}` })
  doAjax(xhr, callback)
}

function postProductoWeb(producto, callback) {
  const xhr = new ajax2(endpoint, { method: 'post', data: producto })
  doAjax(xhr, callback)
}

function registrarServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      this.navigator.serviceWorker
        .register('./sw.js')
        .then(function (reg) {
          /* console.log('El service worker se registró correctamente', reg) */
        })
        .catch(function (err) {
          console.warn('Error al registrar el service worker', err)
        })
    })
  }
}

function start() {
  registrarServiceWorker()
  renderLista()
  configurarListeners()
}

window.addEventListener('load', start)
