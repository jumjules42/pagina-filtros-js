const ajax = new XMLHttpRequest();

const botonStock = document.querySelector('#filtroStock');
const botonEnCarrito = document.querySelector('#filtroEnCarrito');
const botonLimpiarFiltros = document.querySelector('#limpiarFiltros');
const listaDeProductos = document.querySelector('#listaDeProductos');
const precioMayorIgual = document.querySelector('#filtroDePrecio');
const filtroProducto = document.querySelector('#filtroPorProducto');


ajax.open('GET', 'api/json.json');

ajax.addEventListener('load', ajaxCallback);

ajax.send();


function ajaxCallback() {
    if(ajax.status === 200) {
        const productos = JSON.parse(ajax.response);
        botonStock.addEventListener('click', enStock);
        botonEnCarrito.addEventListener('click', enCarrito);
        botonLimpiarFiltros.addEventListener('click', limpiarFiltros);
        precioMayorIgual.addEventListener('input', filtroPrecio);
        filtroProducto.addEventListener('change', filtroPorProducto);

        

        listaDePrecios(productos.data);
        crearLista(productos.data);
    }
}

function enStock() {
    if(!botonStock.disabled){
        const productos = JSON.parse(ajax.response);
        const elementosEnStock = productos.data.filter((item) => item.stock);
        eliminarListaDeProductos();
        crearLista(elementosEnStock);
    }
    disabled(botonStock);
    disabled(botonEnCarrito);
    disabled(precioMayorIgual);
    disabled(filtroProducto);
}

function enCarrito() {
    if(!botonEnCarrito.disabled){
        const productos = JSON.parse(ajax.response);
        const elementosEnCarrito = productos.data.filter((item) => item.enCarrito);
        eliminarListaDeProductos();
        crearLista(elementosEnCarrito);
    }

    disabled(botonEnCarrito);
    disabled(botonStock);
    disabled(precioMayorIgual);
    disabled(filtroProducto);

}

function filtroPrecio() {
    const productos = JSON.parse(ajax.response);
    const precios = productos.data.map((item) => item);
    const listaProductosPorPrecio = precios.filter((item) => {
        eliminarListaDeProductos();
        let precio = precioMayorIgual.value;
        return item.precio <= precio;
    })

    if(precioMayorIgual.value == "") {
        ajaxCallback();
    }
    disabled(botonEnCarrito);
    disabled(botonStock);
    disabled(filtroProducto);
    crearLista(listaProductosPorPrecio);
}

function filtroPorProducto() {
    const productos = JSON.parse(ajax.response);
    const nombreProductos = productos.data.map((item) => item);

    let listaEntera = nombreProductos.filter(item => item.producto.slice(0,5) === filtroProducto.options[event.target.value].textContent.slice(0,5));

    eliminarListaDeProductos();
    disabled(botonEnCarrito);
    disabled(botonStock);
    disabled(precioMayorIgual);
    

    crearLista(listaEntera);

}

function limpiarFiltros() {
    botonStock.disabled = false;
    botonEnCarrito.disabled = false;
    precioMayorIgual.disabled = false;
    precioMayorIgual.value = "";
    filtroProducto.disabled = false
    filtroProducto.value = 0;
    eliminarListaDeProductos();
    ajaxCallback();
}

function crearLista(data) {
    const productosMap = data.map(item => crearProducto(item));
    mostrarProductos(productosMap);
}

function mostrarProductos(prod) {
    const listaProductos = prod.reduce((acu, item) => {
        acu.appendChild(item);
        return acu;
    }, document.createDocumentFragment());

    listaDeProductos.appendChild(listaProductos);
}


function disabled(boton) {
    boton.disabled = true;
}

function eliminarListaDeProductos() {
    listaDeProductos.innerHTML = "";
}


function crearProducto(producto) {
    const contenedor = document.createElement('div');
    contenedor.classList.add('contenedor');

    const nombreProducto = document.createElement('p');
    nombreProducto.classList.add('nombreProducto');
    nombreProducto.textContent = producto.producto;

    const marcaProducto = document.createElement('p');
    marcaProducto.classList.add('marcaProducto');
    marcaProducto.textContent = producto.marca;

    const precioProducto = document.createElement('p');
    precioProducto.classList.add('precioProducto');
    precioProducto.textContent = `$${producto.precio}`;

    contenedor.appendChild(nombreProducto);
    contenedor.appendChild(marcaProducto);
    contenedor.appendChild(precioProducto);

    return contenedor;
}

function listaDePrecios(data) {
    data.map(item => item.precio);
}
