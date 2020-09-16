let listaProductos = [];
const endpoint = 'https://5f596df68040620016ab9111.mockapi.io/lista'

function borrarProducto(id) {
    console.log(id);
    deleteProductoWeb(id, ()=> {
        renderLista();
    });
}

function cambiarCantidad(id, e) {
    const cantidad = Number(e.value);
    const index = listaProductos.findIndex(prod => prod.id == id);

    listaProductos[index].cantidad = cantidad;
    const nuevoProducto = listaProductos[index];

    updateProductoWeb(id, nuevoProducto, () => {
        console.log('Modificado correctamente');
    })
}

function cambiarPrecio(id, e) {
    const precio = Number(e.value);
    const index = listaProductos.findIndex(prod => prod.id == id);
    
    listaProductos[index]['precio'] = precio;
    const nuevoProducto = listaProductos[index];
    
    updateProductoWeb(id, nuevoProducto, () => {
        console.log('Modificado correctamente');
    })
}

function configurarListeners() {
    $('#btn_entrada_producto').click(() => {
        const inputProducto = $('#ingreso_producto');

        let prod = inputProducto.val();
        if (prod !== '') {
            const producto = {
                nombre: prod,
                cantidad: 0,
                precio: 0
            };

            inputProducto.val('');
            inputProducto.focus();

            postProductoWeb(producto, prod => {
                renderLista();
            })
        }
    });
    $('#btn_borrar_todos_productos').click(() => {
        listaProductos = [];
        renderLista();
    })
}


function renderLista() {
    $.get('templates/lista-productos.hbs', source => {
        const template = Handlebars.compile(source);
        getProductosWeb((productosResponse) => {
            listaProductos = productosResponse;
            $('#lista').html(template({listaProductos}))
            componentHandler.upgradeElements($('#lista'));
        });
    }).fail(err => {
        console.error('Error al intentar traer el template');
    })
}

function getProductosWeb(callback) {
    $.get(endpoint, callback)
    .fail(err => {
        console.log(err);
    })
}

function deleteProductoWeb(id, callback) {
    $.ajax({url: `${endpoint}/${id}`, method: 'delete'})
    .then(callback)
    .fail(err => {
        console.log(err);
    })
}

function updateProductoWeb(id, producto, callback) {
    $.ajax({url: `${endpoint}/${id}`, data: producto, method: 'put'})
    .then(callback)
    .fail(err => {
        console.log(err);
    })
}

function postProductoWeb(producto, callback) {
    $.ajax({url: `${endpoint}`, data: producto, method: 'post'})
    .then(callback)
    .fail(err => {
        console.log(err);
    })
}

function registrarServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            this.navigator.serviceWorker.register('./sw.js').then(function (reg) {
                /* console.log('El service worker se registró correctamente', reg) */
            })
                .catch(function (err) {
                    console.warn('Error al registrar el service worker', err)
                })
        })
    }
}

function start() {
    registrarServiceWorker();
    renderLista();
    configurarListeners();
}

$(document).ready(start);