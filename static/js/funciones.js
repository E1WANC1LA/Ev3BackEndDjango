var GL_ID_TIPO_USUARIO=0;
var GL_ID_TIPO_PRODUCTO=0;
var GL_ID_USUARIO=0;
var GL_ID_PRODUCTO=0;
var GL_ID_SUSCRIPCION=0;
var GL_SUSCRITO=false;
var GL_ID_PROMOCION=0;

function LlenarNavbar(){
    var navbarHtml='';
    $.ajax({
        type: "POST",
        url: "/ObtenerSesion/",
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var sesion = response.datos;
            } else {
                var sesion = 0;
            }
            if (sesion != 0) {
                    var navbarHtml = `
                    <nav class="navbar navbar-expand-lg navbar-personalizado">
                        <a class="navbar-brand" href="/">
                        <img id='imagenLogoNavbar' src="../../static/img/logoJardineria.png" alt="Logo de Paraiso Verde" class="logo-img">
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/productos/">Productos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/nosotros/">Nosotros</a>
                                </li>
                            </ul>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" onclick="CerrarSesion();" style="cursor: pointer; text-decoration: underline;">Cerrar Sesión</a>                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/MiPerfil/">Mi Perfil</a>
                                </li>
                            </ul>
                           <ul class="list-unstyled">
                                <li class="d-flex align-items-center">
                                    <div class="me-2">
                                        <a href="/carrito/" class="text-decoration-none">
                                            <i class="fas fa-shopping-cart carrito-color"></i>
                                            <span class="badge position-absolute carrito-cantidad" id="cantidadProductos" style="margin-left: -10px; margin-top: -10px;">0</span>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>`;
                }
                else if (sesion == 0) 
                    {
                    var navbarHtml = `
                    <nav class="navbar navbar-expand-lg navbar-personalizado">
                        <a class="navbar-brand" href="/">
                        <img id='imagenLogoNavbar' src="../../static/img/logoJardineria.png" alt="Logo de Paraiso Verde" class="logo-img">
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarNav">
                            <ul class="navbar-nav mr-auto">
                                <li class="nav-item">
                                    <a class="nav-link" href="/">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/productos/">Productos</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/nosotros/">Nosotros</a>
                                </li>
                            </ul>
                            <ul class="navbar-nav">
                                <li class="nav-item">
                                    <a class="nav-link" href="/registro/">Registrarse</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="/iniciarSesion/">Iniciar sesión</a>
                                </li>
                            </ul>
                        </div>
                    </nav>`;
                }
                $('#idNavbar').html(navbarHtml);
              
            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
         });




}


function ObtenerCantidadProductosCarro(){
    var fd = new FormData();
    $.ajax({
        type: "POST",
        url: "/ObtenerCantidadProductosCarro/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.estado === 'sin sesion') {
                console.log('Debe Iniciar Sesion para agregar productos al carro');
            }
            if(response.estado === 'completado') {
                $('#cantidadProductos').text(response.datos);
            }
            if (response.estado === 'fallido') {
                alert('Falló la busqueda de productos');
            }

        },
    });
}


function buscarProductosComprar(){
    $.ajax({
        type: "POST",
        url: "/buscarProductosComprar/",
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var productos = response.datos;
                $('#productList').empty();
                $.each(productos, function(i, producto) {
                    if (producto.descuento == 0) {
                        $('#productList').append(`
                            <div class="producto col-md-3" data-IdProducto="${producto.id_producto}" data-nombre="${producto.nombre}" data-tipo="${producto.tipo_producto}" data-precio="${producto.precio_unitario}">
                                    <img src="../../static/img/${producto.imagen_nombre}" class="card-img-top img" alt="Imagen del producto">
                                    <p class="card-text">Nombre: ${producto.nombre}</p>
                                    <p class="card-text">Precio: ${producto.precio_unitario}</p>
                                    <p class="card-text">Tipo: ${producto.tipo_producto_nombre}</p>
                                    <p class="card-text">Stock: ${producto.stock}</p>
                                    <input type="number" class="quantity-input cantidad" max="${producto.stock}">
                                    <button  class="add-to-cart custom-button" onclick="anadirAlCarro(this);">Añadir al carro</button>
                            </div>
                        `);
                    }
                    if (producto.descuento != 0) {
                        $('#productList').append(`
                            <div class="producto col-md-3" data-IdProducto="${producto.id_producto}" data-nombre="${producto.nombre}" data-tipo="${producto.tipo_producto}" data-precio="${producto.precio_unitario}">
                                    <img src="../../static/img/${producto.imagen_nombre}" class="card-img-top img" alt="Imagen del producto">
                                    <p class="card-text">Nombre: ${producto.nombre}</p>
                                    <p class="card-text">
                                    <span style="text-decoration: line-through;">Precio: ${producto.precio_unitario}</span>
                                    <span>Precio con descuento: ${producto.precio_unitario - (producto.precio_unitario * (producto.descuento / 100))}</span>
                                    </p>
                                    <p class="card-text">Tipo: ${producto.tipo_producto_nombre}</p>
                                    <p class="card-text">Descuento: ${producto.descuento} %</p>
                                    <p class="card-text">Stock: ${producto.stock}</p>
                                    <input type="number" class="quantity-input cantidad" max="${producto.stock}">
                                    <button  class="add-to-cart custom-button" onclick="anadirAlCarro(this);">Añadir al carro</button>
                            </div>
                        `);
                    }
                });
            } else {
                alert('Falló la busqueda de productos');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}




function FiltrarProductos() {
    var tipo = ($('#cmbTipoProducto').val() || '').toUpperCase();
    if (parseInt(tipo) == 0) {
        tipo = 0;
    }
    var precio = $('#precioProducto').val() || '';
    var nombre = ($('#nombreProducto').val() || '').toUpperCase();
    var fd = new FormData();
    fd.append("Tipo", tipo);
    fd.append("Precio", precio);
    fd.append("Nombre", nombre);
    $.ajax({
        type: "POST",
        url: "/FiltrarProductos/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                if  (response.datos == 'sin resultados') {
                    $('#Existencias').show();
                    $('#listaProductos').hide();
                } else {
                var productos = response.datos;
                $('#productList').empty();
                $.each(productos, function(i, producto) {
                    $('#productList').append(`
                        <div class="producto col-md-3" data-IdProducto="${producto.id_producto}" data-nombre="${producto.nombre}" data-tipo="${producto.tipo_producto}" data-precio="${producto.precio_unitario}">
                                <img src="../../static/img/${producto.imagen_nombre}" class="card-img-top img" alt="Imagen del producto">
                                <p class="card-text">Nombre: ${producto.nombre}</p>
                                <p class="card-text">Precio: ${producto.precio_unitario}</p>
                                <p class="card-text">Tipo: ${producto.tipo_producto}</p>
                                <input type="number" class="quantity-input cantidad">
                                <button  class="add-to-cart custom-button" onclick="anadirAlCarro(this);">Añadir al carro</button>
                        </div>
                    `);
                });
                $('#Existencias').hide();
                $('#listaProductos').show();
            }
            } else {
                alert('Falló la busqueda de productos');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });




    if (contador == contadorMostrar) {
        $('#Existencias').show();
        $('#listaProductos').hide();
    }
}


function anadirAlCarro(element) {
    var $element = $(element);
    var msg = '';
    var idProducto = $element.parent().data('idproducto');
    var cantidad = $element.siblings('.cantidad').val();
    if (cantidad == "" || isNaN(parseInt(cantidad)) || parseInt(cantidad) <= 0) {
        msg += 'Debe ingresar una cantidad valida';
    }

    if (msg != '') {
        alert(msg);
        return;
    }

    var fd = new FormData();
    fd.append("IdProducto", idProducto);
    fd.append("Cantidad", cantidad);
    $.ajax({
        type: "POST",
        url: "/AgregarProductoCarro/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.estado === 'sin sesion') {
                alert('Debe Iniciar Sesion para agregar productos al carro');
            }

            if(response.estado === 'completado') {
                alert('Producto añadido al carro');
                ObtenerCantidadProductosCarro();
            } 
            if (response.estado === 'fallido'){
                alert('Falló la adición del producto al carro');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}

function EliminarFila(element) {
    var $element = $(element);
    $($element).closest('tr').remove();
    if ($('#tablaProductos tbody tr').length == 0) {
        $('#tablaProductos').hide();
        $('#valorTotal').hide();
        $('#existeProducto').show();
        $('#btnComprar').hide();
        
    } else {

        actualizarPrecio()
    }
}

function actualizarPrecio() {
    var total = 0;
    $('#tablaProductos tbody tr').each(function () {
        var precio = $(this).find('td').eq(2).text();
        var cantidad = $(this).find('td input').val();
        total += parseInt(precio) * parseInt(cantidad);
        $('#textoValor').text("Total a pagar: " + total.toString());
    });

}

function ComprarProductos() {
    alert("Compra realizada con exito");
    $('#modal-carro').modal('hide');
    $('#tablaProductos tbody tr').each(function () {
        $(this).closest('tr').remove();
    });
}

function buscarUsuarios(){
    var fd = new FormData();
    var nombre = $('#NombreBusUsuario').val();
    if  (nombre.toString() === '') {
        nombre = '';
    }
    var tipoUsuario = $('#cmbDivUsuarioTipoUsuario').val();
   
    fd.append("TipoUsuario", tipoUsuario);
    fd.append("Nombre", nombre);
    
    $('#tablaUsuarios tbody').empty();
    $('#divMensajeNoEncontradoUsuario').hide();
    $.ajax({
        type: "POST",
        url: "/AdminBuscarUsuarios/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var tabla = $('#tablaUsuarios'); 
                if (response.datos.length == 0) {
                    $('#tablaUsuarios').parent().parent().parent().parent().hide();
                    $('#divMensajeNoEncontradoUsuario').show();
                    return;
                }
                $('#tablaUsuarios').parent().parent().parent().parent().show();
                $.each(response.datos, function(i, usuario) {
                    var FilaDatos = document.createElement("tr");

                    var cellId = document.createElement("td");
                    var cellNombre = document.createElement("td");
                    var cellEmail = document.createElement("td");
                    var cellTelefono = document.createElement("td");
                    var cellDireccion = document.createElement("td");
                    var cellTipoUsuario = document.createElement("td");
                    var cellAcciones = document.createElement("td");
                    
                    cellNombre.className = 'nombreUsuario';

                    cellId.innerHTML = usuario.id_usuario;
                    cellNombre.innerHTML = usuario.nombre;
                    cellEmail.innerHTML = usuario.correo;
                    cellTelefono.innerHTML = usuario.telefono;
                    cellDireccion.innerHTML = usuario.direccion;
                    cellTipoUsuario.innerHTML = usuario.tipo_usuario_nombre;
                    cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarUsuario('+usuario.id_usuario+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaUsuario('+usuario.id_usuario+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                    FilaDatos.appendChild(cellId);
                    FilaDatos.appendChild(cellNombre);
                    FilaDatos.appendChild(cellEmail);
                    FilaDatos.appendChild(cellTelefono);
                    FilaDatos.appendChild(cellDireccion);
                    FilaDatos.appendChild(cellTipoUsuario);
                    FilaDatos.appendChild(cellAcciones);

                    tabla.append(FilaDatos);
                });
              

             } 
                
                else {
                    alert('Falló la busqueda de usuarios');
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
         });



}

function buscarTipoProducto(){
    var fd = new FormData();
    
    var nombre = $('#NombreBusTipoProducto').val();
    if  (nombre.toString() === '') {
        nombre = '';
    }
    fd.append("Nombre", nombre);
    $('#tablaTipoProducto tbody').empty();
    $('#divMensajeNoEncontradoTipoProducto').hide();

    $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposProducto/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    return;
                }
                if(response.estado === 'completado') {
                    var tabla = $('#tablaTipoProducto'); 
                    if (response.datos.length == 0) {
                        $('#tablaTipoProducto').parent().parent().parent().parent().hide();
                        $('#divMensajeNoEncontradoTipoProducto').show();
                        return;
                    }
                    $('#tablaTipoProducto').parent().parent().parent().parent().show();

                    $.each(response.datos, function(i, tipo) {
                        var FilaDatos = document.createElement("tr");

                        var cellId = document.createElement("td");
                        var cellNombre = document.createElement("td");
                        var cellConteo = document.createElement("td");
                        var cellAcciones = document.createElement("td");
                        
                        cellNombre.className = 'nombreTipoproducto';

                        cellId.innerHTML = tipo.id_tipo_producto;
                        cellNombre.innerHTML = tipo.nombre;
                        cellConteo.innerHTML = tipo.conteo_productos;
                        cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarTipoProducto('+tipo.id_tipo_producto+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaTipoProducto('+tipo.id_tipo_producto+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                        FilaDatos.appendChild(cellId);
                        FilaDatos.appendChild(cellNombre);
                        FilaDatos.appendChild(cellConteo);
                        FilaDatos.appendChild(cellAcciones);

                        tabla.append(FilaDatos);
                    });

                 } 
                    
                    else {
                        alert('Falló la busqueda del tipo de usuario');
                    }
    
                },
                error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
                failure: function (response) { alert(response); }
             });
}

function buscarTiposUsuario(){
    var fd = new FormData();
    
    var nombre = $('#NombreBusTipoUsuario').val();
    if  (nombre.toString() === '') {
        nombre = '';
    }
    fd.append("Nombre", nombre);
    $('#tablaTipoUsuario tbody').empty();
    $('#divMensajeNoEncontradoTipoUsuario').hide();
    $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposUsuario/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    return;
                }
                if(response.estado === 'completado') {
                    var tabla = $('#tablaTipoUsuario'); 
                    if (response.datos.length == 0) {
                        $('#tablaTipoUsuario').parent().parent().parent().parent().hide();
                        $('#divMensajeNoEncontradoTipoUsuario').show();
                        return;
                    }
                    $('#tablaTipoUsuario').parent().parent().parent().parent().show();

                    $.each(response.datos, function(i, tipo) {
                        var FilaDatos = document.createElement("tr");

                        var cellId = document.createElement("td");
                        var cellNombre = document.createElement("td");
                        var cellConteo = document.createElement("td");
                        var cellAcciones = document.createElement("td");
                        
                        cellNombre.className = 'nombreTipousuario';

                        cellId.innerHTML = tipo.id_tipo_usuario;
                        cellNombre.innerHTML = tipo.nombre;
                        cellConteo.innerHTML = tipo.conteo_usuarios;
                        cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarTipoUsuario('+tipo.id_tipo_usuario+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaTipoUsuario('+tipo.id_tipo_usuario+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                        FilaDatos.appendChild(cellId);
                        FilaDatos.appendChild(cellNombre);
                        FilaDatos.appendChild(cellConteo);
                        FilaDatos.appendChild(cellAcciones);

                        tabla.append(FilaDatos);
                    });

                } else {
                    alert('Falló la busqueda del tipo de usuario');
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
         });


}


function llenarCmbProducto(cmb){
    return new Promise((resolve, reject) => {

        var fd = new FormData();
        $.ajax({
            type: "POST",
            url: "/AdminBuscarProductosCMB/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    reject();
                    return;
                }
                if(response.estado === 'completado') {
                    $('#'+cmb.toString()+'').empty();
                    $('#'+cmb.toString()+'').append('<option value="0">Seleccione un producto</option>');
                    $.each(response.datos, function(i, producto) {
                        $('#'+cmb.toString()+'').append('<option value="'+producto.id_producto+'">'+producto.nombre+'</option>');
                    });
                    resolve();
            
                } else {
                    alert('Falló la recuperacion del producto');
                    reject();
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText);
                reject();
                },
            failure: function (response) { alert(response);
                reject();
            }
        });
    });

}

function buscarPromociones(){
    var descuento = $('#DescuentoPromocionBus').val();
    var descripcion = $('#DescripcionPromocionBus').val();
    var producto = $('#cboProductoPromocionoBus').val();

    if (descuento.toString() === '') {
        descuento = '0';
    }
    if (descripcion.toString() === '') {
        descripcion = '';
    }
    if (producto == null || producto.toString() === '0'){
        producto = '0';
    }


    var fd = new FormData();

    fd.append("Descuento", descuento);
    fd.append("Descripcion", descripcion);
    fd.append("Producto", producto);

    $('#tablaPromociones tbody').empty();
    $('#divMensajeNoEncontradoPromociones').hide();
    $.ajax({
            type: "POST",
            url: "/AdminBuscarPromociones/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    return;
                }
                if(response.estado === 'completado') {
                    var tabla = $('#tablaPromociones');
                    if (response.datos.length == 0) {
                        $('#tablaPromociones').parent().parent().parent().parent().hide();
                        $('#divMensajeNoEncontradoPromociones').show();
                        return;
                    }
                    $('#tablaPromociones').parent().parent().parent().parent().show();

                    $.each(response.datos, function(i, promocion) {
                        var FilaDatos = document.createElement("tr");

                        var cellId = document.createElement("td");
                        var cellDescripcion = document.createElement("td");
                        var cellDescuento = document.createElement("td");
                        var cellProducto = document.createElement("td");
                        var cellAcciones = document.createElement("td");

                        cellId.innerHTML = promocion.id_promocion;
                        cellDescripcion.innerHTML = promocion.descripcion;
                        cellDescuento.innerHTML = promocion.descuento;
                        cellProducto.innerHTML = promocion.producto_nombre; 
                        cellProducto.className = 'nombreProducto';
                        cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarPromocion('+promocion.id_promocion+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaPromocion('+promocion.id_promocion+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                        FilaDatos.appendChild(cellId);
                        FilaDatos.appendChild(cellProducto);
                        FilaDatos.appendChild(cellDescripcion);
                        FilaDatos.appendChild(cellDescuento);
                        FilaDatos.appendChild(cellAcciones);

                        tabla.append(FilaDatos);

                    });

                } else {
                    alert('Falló la busqueda de promociones');
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
            failure: function (response) { alert(response); }
            });
}


function GrabarPromocion(){
    var msg = '';
    if ($('#AddDescuentoPromocion').val() == "" || isNaN(parseInt($('#AddDescuentoPromocion').val())) || parseInt($('#AddDescuentoPromocion').val()) <= 0) {
        msg += '\nDebe ingresar un descuento valido';
    }
    if ($('#AddDescripcionPromocion').val() == "") {
        msg += '\nDebe ingresar una descripción';
    }
    if ($('#cmbProductoAddPromocion').val() == 0) {
        msg += '\nDebe seleccionar un producto';
    }
    if (msg != '') {
        alert(msg);
        return;
    }

    var fd = new FormData();
    fd.append("Descuento", $('#AddDescuentoPromocion').val());
    fd.append("Descripcion", $('#AddDescripcionPromocion').val());
    fd.append("Producto", $('#cmbProductoAddPromocion').val());
    $.ajax({
        type: "POST",
        url: "/AdminAgregarPromocion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            
            if(response.estado === 'completado') {
                alert('Promoción agregada con éxito');
                buscarPromociones();
                $('#modal-agregarPromociones').modal('hide');
            }
            if (response.estado === 'fallido'){
                alert('Falló la adición de la promoción');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}

function EliminaPromocion (id_promocion,element){
    var nombre = $(element).closest('tr').find('.nombreProducto').text();
    $('#idMensajeEliminarPromocion').html('¿Está seguro que desea eliminar la promoción del producto '+nombre.toString()+'?');
    $('#modal-confirmaEliminarPromocion').modal('show');
    GL_ID_PROMOCION = id_promocion;
}

function PrepararModalAgregarPromocion(){
    $('#AddDescuentoPromocion').val('');
    $('#AddDescripcionPromocion').val('');
    llenarCmbProducto('cmbProductoAddPromocion');
}


function EliminarPromocion(){
    var fd = new FormData();
    fd.append("IdPromocion", GL_ID_PROMOCION);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarPromocion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Promoción eliminada con éxito');
                buscarPromociones();
            } else {
                alert('Falló la eliminación de la promoción');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EditarPromocion(){
    var msg = '';
    if ($('#EditDescuentoPromocion').val() == "" || isNaN(parseInt($('#EditDescuentoPromocion').val())) || parseInt($('#EditDescuentoPromocion').val()) <= 0) {
        msg += '\nDebe ingresar un descuento valido';
    }
    if ($('#EditDescripcionPromocion').val() == "") {
        msg += '\nDebe ingresar una descripción';
    }
    if (msg != '') {
        alert(msg);
        return;
    }

    var fd = new FormData();
    fd.append("IdPromocion", GL_ID_PROMOCION);
    fd.append("Descuento", $('#EditDescuentoPromocion').val());
    fd.append("Descripcion", $('#EditDescripcionPromocion').val());
    $.ajax({
        type: "POST",
        url: "/AdminEditarPromocion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Promoción editada con éxito');
                buscarPromociones();
                $('#modal-editarPromocion').modal('hide');
            } else {
                alert('Falló la edición de la promoción');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function PrepararModalEditarPromocion(id_promocion){
    $('#modal-editarPromocion').modal('show');
    GL_ID_PROMOCION = id_promocion;
    var fd = new FormData();
    fd.append("IdPromocion", id_promocion);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarPromocionEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                $('#EditDescuentoPromocion').val((response.datos.descuento).toString());
                $('#EditDescripcionPromocion').val((response.datos.descripcion).toString());
            } else {
                alert('Falló la recuperacion de la promoción');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}



function PrepararModalEditarTipoProducto(id_tipo_producto){
    $('#modal-editarTipoProducto').modal('show');
    GL_ID_TIPO_PRODUCTO = id_tipo_producto;
    var fd = new FormData();
    fd.append("IdTipoProducto", id_tipo_producto);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarTipoProductoEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                $('#NombreEditTipoProducto').val((response.datos.nombre).toString());
            } else {
                alert('Falló la recuperacion del tipo de producto');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function PrepararModalEditarTipoUsuario(id_tipo_usuario){
    $('#modal-editarTipoUsuario').modal('show');
    GL_ID_TIPO_USUARIO = id_tipo_usuario;
    var fd = new FormData();
    fd.append("IdTipoUsuario", id_tipo_usuario);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarTipoUsuarioEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                $('#NombreEditTipoUsuario').val((response.datos.nombre).toString());
            } else {
                alert('Falló la recuperacion del tipo de usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EliminarProducto(){
    var fd = new FormData();
    fd.append("IdProducto", GL_ID_PRODUCTO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Producto eliminado con éxito');
                buscarProductos();
            } else {
                alert('Falló la eliminación del producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function EliminaTipoUsuario(id_tipo_usuario,element){
    GL_ID_TIPO_USUARIO = id_tipo_usuario;
    var nombre = $(element).closest('tr').find('.nombreTipousuario').text();
    $('#idMensajeEliminrTipoUsuario').html('¿Está seguro que desea eliminar el tipo de usuario '+nombre.toString()+'?');
    $('#modal-confirmaEliminarTipoUsuario').modal('show');
}

function EliminaProducto(id_producto,element){
    GL_ID_PRODUCTO = id_producto;
    var nombre = $(element).closest('tr').find('.nombreProducto').text();
    $('#idMensajeEliminarProducto').html('¿Está seguro que desea eliminar el producto '+nombre.toString()+'?');
    $('#modal-confirmaEliminarProducto').modal('show');
}

function EliminaUsuario(id_usuario,element){
    GL_ID_USUARIO = id_usuario;
    var nombre = $(element).closest('tr').find('.nombreUsuario').text();
    $('#idMensajeEliminarUsuario').html('¿Está seguro que desea eliminar el usuario '+nombre.toString()+'?');
    $('#modal-confirmaEliminarUsuario').modal('show');
}
function EliminaTipoProducto(id_tipo_producto,element){
    GL_ID_TIPO_PRODUCTO = id_tipo_producto;
    var nombre = $(element).closest('tr').find('.nombreTipoproducto').text();
    $('#idMensajeEliminarTipoProducto').html('¿Está seguro que desea eliminar el tipo de producto '+nombre.toString()+'?');
    $('#modal-confirmaEliminarTipoProducto').modal('show');
}

function PrepararModalEditarUsuario(id_usuario){
    $('#modal-editarUsuario').modal('show');
    var fd = new FormData();
    GL_ID_USUARIO = id_usuario;
    fd.append("IdUsuario", id_usuario);
    $.ajax({
        type: "POST",
        url: "/AdminBuscarUsuarioEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var nombreCompleto = (response.datos.nombre).toString();
                var partes = nombreCompleto.split(" ");
                var nombre = partes[0];
                var apellido = partes[1];
                $('#EditNombreUsuario').val(nombre.toString());
                $('#EditApellidoUsuario').val(apellido.toString());
                $('#EditCorreoUsuario').val((response.datos.correo).toString());
                $('#EditTelefonoUsuario').val((response.datos.telefono).toString());
                $('#EditDireccionUsuario').val((response.datos.direccion).toString());
                $('#EditContrasenaUsuario').val((response.datos.contrasena).toString());
                llenarCmbTipoUsuario('cmbUsuarioEditTipoUsuario').then(() => {
                    $('#cmbUsuarioEditTipoUsuario').val(response.datos.tipo_usuario);
                });
            } else {
                alert('Falló la recuperacion del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });






}

function EditarUsuario(){
    var fd = new FormData();
    var nombreCompleto = $('#EditNombreUsuario').val() + ' ' + $('#EditApellidoUsuario').val();
    fd.append("IdUsuario", GL_ID_USUARIO);
    fd.append("Nombre", nombreCompleto);
    fd.append("Correo", $('#EditCorreoUsuario').val());
    fd.append("Telefono", $('#EditTelefonoUsuario').val());
    fd.append("Direccion", $('#EditDireccionUsuario').val());
    fd.append("Contrasena", $('#EditContrasenaUsuario').val());
    fd.append("TipoUsuario", $('#cmbUsuarioEditTipoUsuario').val());
    fd.append("Suscrito", 0);
    $.ajax({
        type: "POST",
        url: "/AdminEditarUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario editado con éxito');
                buscarUsuarios();
                $('#modal-editarUsuario').modal('hide');
            } else {
                alert('Falló la edicion del usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EliminarUsuario(){
    var fd = new FormData();
    fd.append("IdUsuario", GL_ID_USUARIO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario eliminado con éxito');
                buscarUsuarios();
            } else {
                alert('Falló la eliminación del usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EliminarTipoProducto(){
    var fd = new FormData();
    fd.append("IdTipoProducto", GL_ID_TIPO_PRODUCTO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarTipoProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de producto eliminado con éxito');
                buscarTipoProducto();
            } else {
                alert('Falló la eliminación del tipo de producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function PrepararModalAgregarUsuario(){
    $('#AddNombreUsuario').val('');
    $('#AddApellidoUsuario').val('');
    $('#AddCorreoUsuario').val('');
    $('#AddTelefonoUsuario').val('');
    $('#AddDireccionUsuario').val('');
    $('#AddContrasenaUsuario').val('');
    llenarCmbTipoUsuario('cmbUsuarioAddTipoUsuario');
}

function llenarCmbTipoUsuario(cmb){
    return new Promise((resolve, reject) => {

     var fd = new FormData();
        $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposUsuarioCMB/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    reject();
                    return;
                }
                if(response.estado === 'completado') {
                    $('#'+cmb.toString()+'').empty();
                    $('#'+cmb.toString()+'').append('<option value="0">Seleccione un tipo de usuario</option>');
                    $.each(response.datos, function(i, tipo) {
                        $('#'+cmb.toString()+'').append('<option value="'+tipo.id_tipo_usuario+'">'+tipo.nombre+'</option>');
                    });
                    resolve();
            
                } else {
                    alert('Falló la recuperacion del tipo de usuario');
                    reject();
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText);
                reject();
             },
            failure: function (response) { alert(response); 
                reject();

            }
        });
    });

}


function llenarCmbTipoProducto(cmb){
    return new Promise((resolve, reject) => {

        var fd = new FormData();
        $.ajax({
            type: "POST",
            url: "/AdminBuscarTiposProductoCMB/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    reject();
                    return;
                }
                if(response.estado === 'completado') {
                    $('#'+cmb.toString()+'').empty();
                    $('#'+cmb.toString()+'').append('<option value="0">Seleccione un tipo de producto</option>');
                    $.each(response.datos, function(i, tipo) {
                        $('#'+cmb.toString()+'').append('<option value="'+tipo.id_tipo_producto+'">'+tipo.nombre+'</option>');
                    });
                    resolve();
            
                }
                else {
                    alert('Falló la recuperacion del tipo de producto');
                    reject();
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText);
                reject();
                },
            failure: function (response) { alert(response);
                reject();
            }
        });
    });

}


function PrepararModalEditarProducto(id_producto){
    $('#modal-editarProducto').modal('show');

    $('#EditImagenProducto').replaceWith($('#EditImagenProducto').val('').clone(true));    GL_ID_PRODUCTO = id_producto;
    var fd = new FormData();
    $('#divFotoEditProducto').empty();
    fd.append("IdProducto", id_producto);

    $.ajax({
        type: "POST",
        url: "/AdminBuscarProductoEditar/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {

                var precioFormateado = response.datos.precio_unitario.split('.')[0]
                $('#EditNombreProducto').val((response.datos.nombre).toString());
                $('#EditPrecioProducto').val(precioFormateado.toString());
                $('#EditStockProducto').val((response.datos.stock).toString());
                $('#EditDescripcionProducto').val((response.datos.descripcion).toString());
                llenarCmbTipoProducto('cmbProductoEditTipoProducto').then(() => {
                    $('#cmbProductoEditTipoProducto').val(response.datos.tipo_producto);
                });
                $('#divFotoEditProducto').html('<label for="imagenProductoVer" class="control-label">Imagen actual:</label><img id="imagenProductoVer" src="../../static/img/'+response.datos.imagen_nombre+'" alt="Imagen del producto" class="img-fluid">');  
            } else {
                alert('Falló la recuperacion del producto');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function EditarProducto(){
    var fd = new FormData();
    var msg = '';
    var nombre = $('#EditNombreProducto').val();
    var precio = $('#EditPrecioProducto').val();
    var stock = $('#EditStockProducto').val();
    var descripcion = $('#EditDescripcionProducto').val();
    var tipo = $('#cmbProductoEditTipoProducto').val();
    var archivo = $('#EditImagenProducto').prop('files')[0];
    if (archivo == null) {
        archivo = '';
    }
    else if ((archivo.name.split('.').pop().toLowerCase() != 'jpg' && archivo.name.split('.').pop().toLowerCase() != 'jpeg' && archivo.name.split('.').pop().toLowerCase() != 'png') && archivo != null) {
        msg = msg + '\nPor favor, seleccione una imagen con formato jpg, jpeg o png.';
    }
    if (nombre.toString() === '' || precio.toString() === '' || stock.toString() === '' || descripcion.toString() === '' || tipo.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (tipo.toString() === '0') {
        msg = msg + '\nPor favor, seleccione un tipo de producto.';
    }
    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
        msg = msg + '\nPor favor, introduzca un precio valido.';
    }
    if (isNaN(parseInt(stock)) || parseInt(stock) <= 0) {
        msg = msg + '\nPor favor, introduzca un stock valido.';
    }

    if (msg != '') {
        alert(msg);
        return;
    }

    fd.append("IdProducto", GL_ID_PRODUCTO);
    fd.append("Nombre", nombre);
    fd.append("PrecioUnitario", precio);
    fd.append("Stock", stock);
    fd.append("Descripcion", descripcion);
    fd.append("TipoProducto", tipo);
    fd.append("Imagen", archivo);
    $.ajax({
        type: "POST",
        url: "/AdminEditarProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Producto editado con éxito');
                buscarProductos();
                $('#modal-editarProducto').modal('hide');
            } else {
                alert('Falló la edicion del producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function buscarProductos(){
    var fd = new FormData();
    var nombre = $('#NombreProductoBus').val();
    if  (nombre.toString() === '') {
        nombre = '';
    }
    var tipoProducto = $('#cboProductoTipoProductoBus').val();
    var precio = $('#PrecioProductoBus').val();
    if (precio.toString() === '') {
        precio = '';
    }
    else if (isNaN(parseFloat(precio)) || parseFloat(precio) < 0) {
        precio = '';
    }
    fd.append("Precio", precio);
    fd.append("TipoProducto", tipoProducto);
    fd.append("Nombre", nombre);
    $('#tablaProductos tbody').empty();
    $('#divMensajeNoEncontradoProductos').hide();
    $.ajax({
        type: "POST",
        url: "/AdminBuscarProductos/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {

                var tabla = $('#tablaProductos');
                if (response.datos.length == 0) {
                    $('#tablaProductos').parent().parent().parent().parent().hide();
                    $('#divMensajeNoEncontradoProductos').show();
                    return;
                }
                $('#tablaProductos').parent().parent().parent().parent().show();
                $.each(response.datos, function(i, producto) {
                    var FilaDatos = document.createElement("tr");

                    var cellId = document.createElement("td");
                    var cellNombre = document.createElement("td");
                    var cellPrecio = document.createElement("td");
                    var cellStock = document.createElement("td");
                    var cellDescripcion = document.createElement("td");
                    var cellTipoProducto = document.createElement("td");
                    var cellAcciones = document.createElement("td");

                    cellNombre.className = 'nombreProducto';

                    cellId.innerHTML = producto.id_producto;
                    cellNombre.innerHTML = producto.nombre;
                    cellPrecio.innerHTML = producto.precio_unitario;
                    cellStock.innerHTML = producto.stock;
                    cellDescripcion.innerHTML = producto.descripcion;
                    cellTipoProducto.innerHTML = producto.tipo_producto_nombre;
                    cellAcciones.innerHTML = '<button class="btn" onclick="PrepararModalEditarProducto('+producto.id_producto+');"><i class="mdi mdi-pencil"></i></button> <button class="btn" onclick="EliminaProducto('+producto.id_producto+',this);"><i class="mdi mdi-trash-can-outline"></i></button>';

                    FilaDatos.appendChild(cellId);
                    FilaDatos.appendChild(cellNombre);
                    FilaDatos.appendChild(cellPrecio);
                    FilaDatos.appendChild(cellStock);
                    FilaDatos.appendChild(cellDescripcion);
                    FilaDatos.appendChild(cellTipoProducto);
                    FilaDatos.appendChild(cellAcciones);

                    tabla.append(FilaDatos);
                });

            } else {
                alert('Falló la busqueda de productos');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function GrabarProducto(){
    var msg = '';
    var nombre = $('#AddNombreProducto').val();
    var precio = $('#AddPrecioProducto').val();
    var stock = $('#AddStockProducto').val();
    var descripcion = $('#AddDescripcionProducto').val();
    var tipo = $('#cmbProductoAddTipoProducto').val();
    var archivo = $('#AddImagenProducto').prop('files')[0];

    if (nombre.toString() === '' || precio.toString() === '' || stock.toString() === '' || descripcion.toString() === '' || tipo.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (tipo.toString() === '0') {
        msg = msg + '\nPor favor, seleccione un tipo de producto.';
    }
    if (isNaN(parseFloat(precio)) || parseFloat(precio) <= 0) {
        msg = msg + '\nPor favor, introduzca un precio valido.';
    }
    if (isNaN(parseInt(stock)) || parseInt(stock) <= 0) {
        msg = msg + '\nPor favor, introduzca un stock valido.';
    }
    if (archivo == null) {
        msg = msg + '\nPor favor, seleccione una imagen.';
    }
    else if (archivo.name.split('.').pop().toLowerCase() != 'jpg' && archivo.name.split('.').pop().toLowerCase() != 'jpeg' && archivo.name.split('.').pop().toLowerCase() != 'png') {
        msg = msg + '\nPor favor, seleccione una imagen con formato jpg, jpeg o png.';
    }

    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();
    fd.append("Nombre", nombre);
    fd.append("PrecioUnitario", precio);
    fd.append("Stock", stock);
    fd.append("Descripcion", descripcion);
    fd.append("TipoProducto", tipo);
    fd.append("Imagen", archivo);
    $.ajax({
        type: "POST",
        url: "/AdminCrearProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                $('#modal-agregarProductos').modal('hide');
                alert('Producto creado con éxito');
                buscarProductos();
            } else {
                alert('Falló la creación del producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function PrepararModalAgregarProducto(){
    $('#AddNombreProducto').val('');
    $('#AddPrecioProducto').val('');
    $('#AddStockProducto').val('');
    $('#AddDescripcionProducto').val('');
    llenarCmbTipoProducto('cmbProductoAddTipoProducto');
    $('#AddImagenProducto').replaceWith($('#AddImagenProducto').val('').clone(true));
}


function buscarProductosCarrito(){
    var fd = new FormData();
    $('#tablaProductosCarrito tbody').empty();
    $('#divMensajeNoEncontradoProductosCarrito').hide();
    $.ajax({
        type: "POST",
        url: "/BuscarProductosCarrito/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.estado == 'sin carro' || response.estado == 'sin productos') {
                $('#divTablaCarrito').hide();
                $('#divMensajeNoEncontradoProductosCarrito').show();
                return;
            }
            if(response.estado === 'completado') {
                    
                    var tabla = $('#tablaProductosCarrito');
                    $('#tablaProductosCarrito').parent().parent().show();
                    $.each(response.datos, function(i, producto) {
                        var FilaDatos = document.createElement("tr");
    
                        var cellImagen = document.createElement("td");
                        var cellNombre = document.createElement("td");
                        var cellPrecio = document.createElement("td");
                        var cellDescripcion = document.createElement("td");
                        var cellCantidad = document.createElement("td");
                        var cellAcciones = document.createElement("td");
                        var cellStock = document.createElement("td");

                        
                        cellNombre.className = 'nombreProducto';
                        cellNombre.value = producto.id_producto;
                        cellImagen.innerHTML = '<img src="../../static/img/'+producto.imagen_nombre+'" alt="Imagen del producto" class="img-fluid imagen-carrito">';
                        cellNombre.innerHTML = '<h4 class="idProducto" value="'+producto.id_producto+'">'+producto.nombre+'</h4>';
                        cellPrecio.className = 'precioProducto';
                        if (producto.descuentoPromocion == 0) {
                            cellPrecio.innerHTML = producto.precio_unitario.split('.')[0];
                            cellPrecio.setAttribute('data-precioUnitario', producto.precio_unitario.split('.')[0]);
                        }
                        else if (producto.descuentoPromocion != 0) {
                            cellPrecio.innerHTML = ''+(producto.precio_unitario.split('.')[0])*(producto.descuentoPromocion/100)+'';
                            cellPrecio.setAttribute('data-precioUnitario', producto.precio_unitario.split('.')[0]);
                        }
                        cellDescripcion.innerHTML = producto.descripcion;
                        cellCantidad.innerHTML = '<input type="number" class="form-control cantidadProducto" value="'+producto.cantidad+'" min="1" max="'+producto.stock+'" onblur="actualizarPrecioCarrito();" id="CantidadProducto'+producto.id_producto+'">';
                        cellAcciones.innerHTML = '<button class="btn custom-button" onclick="EliminaProductoCarrito('+producto.id_producto+');"><i class="mdi mdi-trash-can-outline"></i></button>';
                        cellStock.innerHTML = producto.stock;
                        cellStock.className = 'stockProducto';

                        FilaDatos.appendChild(cellImagen);
                        FilaDatos.appendChild(cellNombre);
                        FilaDatos.appendChild(cellDescripcion);
                        FilaDatos.appendChild(cellPrecio);
                        FilaDatos.appendChild(cellCantidad);
                        FilaDatos.appendChild(cellStock);
                        FilaDatos.appendChild(cellAcciones);

    
                        tabla.append(FilaDatos);
                    });
                    var filaFinal = document.createElement("tr");
                    var cellRelleno = document.createElement("td");
                    var cellRelleno2 = document.createElement("td");
                    var cellRelleno3 = document.createElement("td");
                    var cellRelleno4 = document.createElement("td");
                    var cellTotal = document.createElement("td");
                    var cellComprar = document.createElement("td");

                    cellTotal.innerHTML = '<h4>Total: <span id="totalCarrito"></span></h4>';
                    cellComprar.innerHTML = '<button class="btn custom-button" onclick="ComprarCarrito();">Comprar</button>';
                    cellTotal.className = 'totalCarrito';
                    filaFinal.className = 'filaComprarCarrito';

                    filaFinal.appendChild(cellRelleno);
                    filaFinal.appendChild(cellRelleno2);
                    filaFinal.appendChild(cellRelleno3);
                    filaFinal.appendChild(cellRelleno4);
                    filaFinal.appendChild(cellTotal);
                    filaFinal.appendChild(cellComprar);
                    
                    var filaFinal2 = document.createElement("tr");
                    var cellDescuento = document.createElement("td");
                    var cellRelleno5 = document.createElement("td");
                    var cellRelleno6 = document.createElement("td");
                    var cellRelleno7 = document.createElement("td");
                    var cellRelleno8 = document.createElement("td");
                    var cellRellenoInvisible = document.createElement("td");

                    filaFinal2.className = 'filaDescuentoCarrito';

                    cellRellenoInvisible.style.display = 'none';


                    cellDescuento.innerHTML = '<h4>Descuento: <span id="DescuentoCarrito"></span></h4>';
                    cellDescuento.className = 'descuentoCarrito';
                    filaFinal2.appendChild(cellRelleno5);
                    filaFinal2.appendChild(cellRelleno6);
                    filaFinal2.appendChild(cellRelleno7);
                    filaFinal2.appendChild(cellRelleno8);
                    filaFinal2.appendChild(cellDescuento);
                    filaFinal2.appendChild(cellRellenoInvisible);
                    


                    var filaFinal3 = document.createElement("tr");
                    var cellSuscrito = document.createElement("td");
                    var cellRelleno9 = document.createElement("td");
                    var cellRelleno10 = document.createElement("td");
                    var cellRelleno11 = document.createElement("td");
                    var cellRelleno12 = document.createElement("td");
                    var cellRellenoInvisible2 = document.createElement("td");

                    filaFinal3.className = 'filaSuscritoCarrito';

                    cellRellenoInvisible2.style.display = 'none';
                    cellSuscrito.innerHTML = '<h4>Suscrito: <span id="Suscrito"></span></h4>';
                    cellSuscrito.className = 'suscritoCarrito';
                    filaFinal3.appendChild(cellRelleno9);
                    filaFinal3.appendChild(cellRelleno10);
                    filaFinal3.appendChild(cellRelleno11);
                    filaFinal3.appendChild(cellRelleno12);
                    filaFinal3.appendChild(cellSuscrito);
                    filaFinal3.appendChild(cellRellenoInvisible2);
                    

                    tabla.append(filaFinal3);
                    tabla.append(filaFinal2);
                    tabla.append(filaFinal);
                    actualizarPrecioCarrito();
                }
                else {
                    alert('Falló la busqueda de productos');
                }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}



function ComprarCarrito(){
    console.log('entre comprar');
    var msg = '';
    var fd = new FormData();
    var total = 0;
    var arrayProductos = [];
    $("#tablaProductosCarrito tbody tr").each(function() {
        
        if ($(this).hasClass('filaComprarCarrito')) 
        {
            console.log('entre fila compra');
            fd.append('Total', $(this).find('.totalCarrito').find('h4').find('span').text().substring(1));
        }
        else if ($(this).hasClass('filaDescuentoCarrito')) 
        {
            console.log('entre fila descuento');
           fd.append('Descontado', $(this).find('.descuentoCarrito').find('h4').find('span').text().substring(1));
        }
        else if ($(this).hasClass('filaSuscritoCarrito')) 
        {
            console.log('entre fila suscrito');
            $(this).find('.suscritoCarrito').find('h4').find('span').text() == 'Suscrito' ? fd.append('Suscrito','si') : fd.append('Suscrito','no');
        }
        else
        {
            if ($(this).find('.cantidadProducto').val() <= 0) {
                msg = msg + '\nPor favor, introduzca una cantidad valida para el producto '+ $(this).find('.idProducto').text() +'.';
            }
            else if (parseInt($(this).find('.cantidadProducto').val()) > parseInt($(this).find('.stockProducto').text())) {
                msg = msg + '\nLa cantidad del producto '+ $(this).find('.idProducto').text() +' no puede ser mayor al stock.';
            }
        console.log('entre fila producto');
        var id_producto = $(this).find('.idProducto').attr('value');
        var cantidad = $(this).find('.cantidadProducto').val();
        var precio = $(this).find('.precioProducto').text();       
        precio = parseInt(precio) * parseInt(cantidad); 
        arrayProductos.push({id_producto: id_producto, cantidad: cantidad, precio: precio});
        }
    });
    console.log(arrayProductos);
    console.log(JSON.stringify(arrayProductos));
    fd.append('Productos', JSON.stringify(arrayProductos));
    fd.append('EstadoDespacho', 'Preparando envío');
    if (msg != '') {
        alert(msg);
        return;
    }


    $.ajax({
        type: "POST",
        url: "/ComprarCarrito/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.estado == 'completado') {
                alert('Compra realizada con éxito');
                window.location.href = '/MiPerfil/';
            } else {
                alert('Falló la compra');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function CancelarSuscripcion(){
    var fd = new FormData();
    $.ajax({
        type: "POST",
        url: "/CancelarSuscripcion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.estado == 'completado') {
                alert('Suscripción cancelada con éxito');
                GL_SUSCRITO = false;
                PrepararBotonSuscripcion();
                buscarProductosCarrito();
            } else {
                alert('Falló la cancelación de la suscripción');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}

function BuscarInformacionUsuario(){
    var fd = new FormData();
    $.ajax({
        type: "POST",
        url: "/BuscarInformacionUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.estado == 'completado') {
                $('#nombre').val(response.datos.nombre.split(' ')[0]);
                $('#apellido').val(response.datos.nombre.split(' ')[1]);
                $('#email').val(response.datos.correo);
                $('#telefono').val(response.datos.telefono);
                $('#direccion').val(response.datos.direccion);
                PrepararBotonSuscripcion();
            } else {
                alert('Falló la busqueda de la información del usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function BuscarMisCompras(){
    var fd = new FormData();
    $('#tablaMisCompras tbody').empty();
    $('#divMensajeNoEncontradoMisCompras').hide();
    $.ajax({
        type: "POST",
        url: "/BuscarMisCompras/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.estado == 'sin compras') {
                $('#divMisCompras').hide();
                $('#divSinCompras').show();
                return;
            }
            if(response.estado === 'completado') {
                var tabla = $('#tablaMisCompras');
                $('#divMisCompras').show();
                $.each(response.datos, function(i, compra) {
                    var FilaDatos = document.createElement("tr");

                    var cellNumero = document.createElement("td");
                    var cellFecha = document.createElement("td");
                    var cellDescuento = document.createElement("td");
                    var cellTotal = document.createElement("td");
                    var cellEstado = document.createElement("td");
                    var cellAcciones = document.createElement("td");

                    cellNumero.innerHTML = compra.id_compra;
                    cellDescuento.innerHTML = compra.descontado;
                    cellFecha.innerHTML = compra.fecha_compra;
                    cellTotal.innerHTML = compra.total;
                    cellEstado.innerHTML = compra.estado_despacho;
                    cellAcciones.innerHTML = '<button class="btn custom-button" onclick="ImprimirDetalleCompra('+compra.id_compra+');">Imprimir detalle</button>';

                    FilaDatos.appendChild(cellNumero);
                    FilaDatos.appendChild(cellFecha);
                    FilaDatos.appendChild(cellDescuento);
                    FilaDatos.appendChild(cellTotal);
                    FilaDatos.appendChild(cellEstado);
                    FilaDatos.appendChild(cellAcciones);

                    tabla.append(FilaDatos);
                });
            }
            else {
                alert('Falló la busqueda de las compras');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}



function ImprimirDetalleCompra(id_compra) {
    var fd = new FormData();
    fd.append("IdCompra", id_compra);
    $.ajax({
        type: "POST",
        url: "/ImprimirDetalleCompra/",
        data: fd,
        contentType: false,
        processData: false,
        xhrFields: {
            responseType: 'blob'  // Añade esta línea para manejar la respuesta como un blob
        },
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.Excepciones != null) {
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                alert('No se encontró el detalle de la compra');
                return;
            }
            var fileURL = URL.createObjectURL(response);
            var a = document.createElement('a');
            a.href = fileURL;
            a.download = 'detalle_compra.pdf';
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a); 
        },
        error: function (XMLHttpRequest, text, error) { 
            alert(XMLHttpRequest.responseText); 
        },
        failure: function (response) { 
            alert(response); 
        }
    });
}



function Suscribirse(){
    var fd = new FormData();
    $.ajax({
        type: "POST",
        url: "/Suscribirse/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.estado == 'completado') {
                alert('Suscripción realizada con éxito');
                GL_SUSCRITO = true;
                PrepararBotonSuscripcion();
                buscarProductosCarrito();
            } else {
                alert('Falló la suscripción');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function PrepararBotonSuscripcion(){

    if (GL_SUSCRITO == true) {
        $('#labelbtnCambiarSuscripcion').text('Cancelar suscripción');
        $('#btnCambiarSuscripcion').text('Cancelar suscripción');
        $('#btnCambiarSuscripcion').attr('onclick','CancelarSuscripcion();');
    } else {
        $('#labelbtnCambiarSuscripcion').text('Suscribirse');
        $('#btnCambiarSuscripcion').text('Suscribirse');
        $('#btnCambiarSuscripcion').attr('onclick','Suscribirse();');
    }

}


function EliminaProductoCarrito(id_producto){
    GL_ID_PRODUCTO = id_producto;
    $('#modal-confirmaEliminarProducto').modal('show');
    $('#idMensajeEliminarProducto').html('¿Está seguro que desea eliminar el producto del carrito?');
}

function EliminarProductoCarrito(){
    var fd = new FormData();
    fd.append("IdProducto", GL_ID_PRODUCTO);
    $.ajax({
        type: "POST",
        url: "/EliminarProductoCarrito/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.estado == 'completado') {
                alert('Producto eliminado del carrito con éxito');
                buscarProductosCarrito();
                ObtenerCantidadProductosCarro();
            } else {
                alert('Falló la eliminación del producto del carrito');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}

function actualizarPrecioCarrito(){
    var total = 0;
    var descuentoInicial = 0;
    $('.precioProducto').each(function() {
        var precio = parseInt($(this).text());
        var precioReal = parseInt($(this).attr('data-precioUnitario'));
        var cantidad = parseInt($(this).parent().find('.cantidadProducto').val());
        descuentoInicial = descuentoInicial + (precioReal * cantidad);
        total = total + (precio * cantidad);
    });
    var descuentoReal = descuentoInicial - total;
    $('#totalCarrito').text("$"+total);
    $('#Suscrito').text("No Suscrito");
    if (descuentoReal == 0) {
    $('#DescuentoCarrito').text("Sin descuento");
    }
    else {
        $('#DescuentoCarrito').text("$"+descuentoReal);
    }
    if (GL_SUSCRITO == true) {
        var descuento = total * 0.1;
        total = total * 0.9;
        $('#totalCarrito').text("$"+total);
        $('#Suscrito').text("Suscrito");
        $('#DescuentoCarrito').text("$"+(parseInt(descuento + descuentoReal)).toString());
    }

}


function CerrarSesion(){
    $.ajax({
        type: "POST",
        url: "/cerrarSesion/",
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            window.location.href = '/';
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}



function EliminarTipoUsuario(){
    var fd = new FormData();
    fd.append("IdTipoUsuario", GL_ID_TIPO_USUARIO);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de usuario eliminado con éxito');
                buscarTiposUsuario();
            } else {
                alert('Falló la eliminación del tipo de usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function EditarTipoUsuario(){
    var fd = new FormData();
    fd.append("IdTipoUsuario", GL_ID_TIPO_USUARIO);
    fd.append("Nombre", $('#NombreEditTipoUsuario').val());
    $.ajax({
        type: "POST",
        url: "/AdminEditarTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de usuario editado con éxito');
                buscarTiposUsuario();
                $('#modal-editarTipoUsuario').modal('hide');
            } else {
                alert('Falló la edicion del tipo de usuario');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}

function EditarTipoProducto(){
    var fd = new FormData();
    fd.append("IdTipoProducto", GL_ID_TIPO_PRODUCTO);
    fd.append("Nombre", $('#NombreEditTipoProducto').val());
    $.ajax({
        type: "POST",
        url: "/AdminEditarTipoProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                alert('Tipo de producto editado con éxito');
                buscarTipoProducto();
                $('#modal-editarTipoProducto').modal('hide');
            } else {
                alert('Falló la edicion del tipo de producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function  PrepararModalAgregarTipoUsuario(){
    $('#NombreAddTipoUsuario').val('');
}

function  PrepararModalAgregarTipoProducto(){
    $('#NombreAddTipoProducto').val('');
}

function GrabarTipoProducto(){
    var msg = '';
    var nombre = $('#NombreAddTipoProducto').val();
    if (nombre.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();
    fd.append("Nombre", nombre);
    $.ajax({
        type: "POST",
        url: "/AdminCrearTipoProducto/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                $('#modal-agregarTipoProducto').modal('hide');
                alert('Tipo de producto creado con éxito');
                buscarTipoProducto();
            } else {
                alert('Falló la creación del tipo de producto');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}

function GrabarTipoUsuario(){
    var msg = '';
    var nombre = $('#NombreAddTipoUsuario').val();
   

    if (nombre.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }

  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();

    fd.append("Nombre", nombre);


    $.ajax({
        type: "POST",
        url: "/AdminCrearTipoUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                $('#modal-agregarTipoUsuario').modal('hide');
                alert('Tipo de usuario creado con éxito');
                buscarTiposUsuario();

            } else {
                alert('Falló la creación del tipo de usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}

function RellenarUsuario(mail,contrasena){
    $('#email').val(mail);
    $('#password').val(contrasena);

    IniciarSesion();


}

function IniciarSesion() {
    var msg = '';
    var contrasena = $('#password').val();
    var email = $('#email').val();
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (email === '' || contrasena === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (!regex.test(email)) {
        msg = msg + '\nPor favor, introduzca un correo electronico valido.';
    }
    
    if (msg != '') {
        alert(msg);
        return;
    }

    var fd = new FormData();
    fd.append("Email", email);
    fd.append("Contrasena", contrasena);

    $.ajax({
        type: "POST",
        url: "/abrirSesion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado' && response.tipo_usuario == 1) {
                alert('Inicio de sesión exitoso');
                window.location.href = '/administrar/';
            }
            if(response.estado === 'completado' && response.tipo_usuario != 1) {
                alert('Inicio de sesión exitoso');
                window.location.href = '/';
                
            }
            if (response.estado === 'fallido') {
                alert('Inicio de sesión fallido');
                window.location.href = '/';
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function RegistrarUsuario() {
    var msg = '';
    var nombre = $('#AddNombreUsuario').val();
    var apellido = $('#AddApellidoUsuario').val();
    var email = $('#AddCorreoUsuario').val();
    var telefono = $('#AddTelefonoUsuario').val();
    var direccion = $('#AddDireccionUsuario').val();
    var contrasena = $('#AddContrasenaUsuario').val();
    var tipoUsuario = $('#cmbUsuarioAddTipoUsuario').val();
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (email.toString() === '' || contrasena.toString() === '' || nombre.toString() === '' || apellido.toString() === '' || parseInt(telefono)=== '' || direccion.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (!regex.test(email)) {
        msg = msg + '\nPor favor, introduzca un correo electronico valido.';
    }
    if (parseInt(tipoUsuario) === 0) {
        msg = msg + '\nPor favor, seleccione un tipo de usuario.';
    }
  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();
    var nombreCompleto = nombre.toString() + ' ' + apellido.toString();

    fd.append("Nombre", nombreCompleto);
    fd.append("Email", email);
    fd.append("Telefono", telefono);
    fd.append("Direccion", direccion);
    fd.append("Contrasena", contrasena);
    fd.append("TipoUsuario", parseInt(tipoUsuario));
    fd.append("Suscrito", 0);


    $.ajax({
        type: "POST",
        url: "/AdminCrearUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario creado con éxito');
                $('#modal-agregarUsuario').modal('hide');
                buscarUsuarios();
                
            } else {
                alert('Falló la creación del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}

function PrepararModalAgregarSuscripcion(){
    $('#AddFechaInicioSuscripcion').val('');
    $('#AddFechaFinSuscripcion').val('');
    llenarCmbUsuario('cboAddUsuariosSuscripcion');
}

function AgregarSuscripcion(){
    var msg = '';
    var fechaInicio = $('#AddFechaInicioSuscripcion').val();
    var fechaFin = $('#AddFechaFinSuscripcion').val();
    var usuario = $('#cboAddUsuariosSuscripcion').val();
    if (fechaInicio.toString() === '' || fechaFin.toString() === '' || usuario.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (parseInt(usuario) === 0) {
        msg = msg + '\nPor favor, seleccione un usuario.';
    }
    var inicio = new Date(fechaInicio);
    var fin = new Date(fechaFin);

    if (inicio > fin) {
        msg = msg + '\nLa fecha de inicio no puede ser mayor a la fecha de fin.';
    }

    if (msg != '') {
        alert(msg);
        return;
    }

    var fd = new FormData();
    fd.append("FechaInicio", fechaInicio);
    fd.append("FechaFin", fechaFin);
    fd.append("Usuario", usuario);

    $.ajax({
        type: "POST",
        url: "/AdminCrearSuscripcion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                alert('Suscripcion creada con éxito');
                $('#modal-agregarSuscripcion').modal('hide');
                BuscarSuscripciones();
            } else {
                alert('Falló la creación de la suscripcion');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function BuscarSuscripciones(){
    var fd = new FormData();
    var fechaInicio = $('#BusFechaInicioSuscripcion').val();
    var fechaFin = $('#BusFechaFinSuscripcion').val();
    var usuario = $('#cmbSuscripcionBusUsuario').val();
    if (fechaInicio.toString() === '') {
        fechaInicio = '1900-01-01';
    }
    if (fechaFin.toString() === '') {
        fechaFin = '9999-12-31';
    }
    if (usuario == 0 || usuario == null) {
        usuario = '0';
    }
    fd.append("FechaInicio", fechaInicio);
    fd.append("FechaFin", fechaFin);
    fd.append("Usuario", usuario);
    $('#tablaSuscripciones tbody').empty();
    $('#divMensajeNoEncontradoSuscripciones').hide();

    $.ajax({
        type: "POST",
        url: "/AdminBuscarSuscripciones/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if(response.estado === 'completado') {
                var tabla = $('#tablaSuscripciones');
                if (response.datos.length == 0) {
                    $('#tablaSuscripciones').parent().parent().parent().parent().hide();
                    $('#divMensajeNoEncontradoSuscripciones').show();
                    return;
                }
                $('#tablaSuscripciones').parent().parent().parent().parent().show();
                $.each(response.datos, function(i, suscripcion) {
                    var FilaDatos = document.createElement("tr");

                    var cellId = document.createElement("td");
                    var cellFechaInicio = document.createElement("td");
                    var cellFechaFin = document.createElement("td");
                    var cellUsuario = document.createElement("td");
                    var cellAcciones = document.createElement("td");
                    let fechaIsoInicio = suscripcion.fecha_inicio_suscripcion;
                    fechaIsoInicio = fechaIsoInicio.split('T')[0];

                    let diaInicio = fechaIsoInicio.split('-')[2];
                    let mesInicio = fechaIsoInicio.split('-')[1];
                    let añoInicio = fechaIsoInicio.split('-')[0];

                    let fechaFormateadaInicio = `${diaInicio}/${mesInicio}/${añoInicio}`;
                    
                    let fechaIsoFin = suscripcion.fecha_fin_suscripcion;
                    fechaIsoFin = fechaIsoFin.split('T')[0];

                    let diaFin = fechaIsoFin.split('-')[2];
                    let mesFin = fechaIsoFin.split('-')[1];
                    let añoFin = fechaIsoFin.split('-')[0];


                    let fechaFormateadaFin = `${diaFin}/${mesFin}/${añoFin}`;


                    cellId.innerHTML = suscripcion.id_suscripcion;
                    cellFechaInicio.innerHTML = fechaFormateadaInicio;
                    cellFechaFin.innerHTML = fechaFormateadaFin;
                    cellUsuario.innerHTML = suscripcion.usuario_nombre;
                    cellAcciones.innerHTML = '<button class="btn" onclick="EliminarSuscripcion('+suscripcion.id_suscripcion+');"><i class="mdi mdi-trash-can-outline"></i></button>';

                    FilaDatos.appendChild(cellUsuario);
                    FilaDatos.appendChild(cellFechaInicio);
                    FilaDatos.appendChild(cellFechaFin);
                    FilaDatos.appendChild(cellAcciones);

                    tabla.append(FilaDatos);
                });

            } else {
                alert('Falló la busqueda de suscripciones');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });
}


function UsuarioSuscrito(){
    return new Promise((resolve, reject) => {

        var fd = new FormData();
     $.ajax({
        type: "POST",
        url: "/UsuarioSuscrito/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                reject();
                return;

            }
            if (response.error != null) {
                alert(response.error);
                reject();
                return;
            }
            if (response.estado == 'completado' && response.datos == 'existe') {
                resolve();
                GL_SUSCRITO = true;
            } else if (response.estado == 'completado' && response.datos == 'no existe')
            {
                GL_SUSCRITO = false;
                resolve();
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); 
            reject();
        },
        failure: function (response) { alert(response);
            reject();
         }
      });

    });
}


function EliminarSuscripcion(id_suscripcion){
    GL_ID_SUSCRIPCION = id_suscripcion;
    $('#modal-confirmaEliminarSuscripcion').modal('show');
    $('#idMensajeEliminarSuscripcion').html('¿Está seguro que desea eliminar la suscripcion?');
}

function EliminaSuscripcion(){
    var fd = new FormData();
    fd.append("IdSuscripcion", GL_ID_SUSCRIPCION);
    $.ajax({
        type: "POST",
        url: "/AdminEliminarSuscripcion/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.estado == 'completado') {
                alert('Suscripcion eliminada con éxito');
                BuscarSuscripciones();
            } else {
                alert('Falló la eliminación de la suscripcion');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}


function llenarCmbUsuario(cmb){
    return new Promise((resolve, reject) => {

        var fd = new FormData();
        $.ajax({
            type: "POST",
            url: "/AdminBuscarUsuariosCMB/",
            data: fd,
            contentType: false,
            processData: false,
            headers: { "X-CSRFToken": getCookie("csrftoken") },
            success: function (response) {
                console.log(response);
                if (response.Excepciones != null) {
                    alert('Ha ocurrido un error inesperado');
                    console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                    reject();
                    return;
                }
                if(response.estado === 'completado') {
                    $('#'+cmb.toString()+'').empty();
                    $('#'+cmb.toString()+'').append('<option value="0">Seleccione un usuario</option>');
                    $.each(response.datos, function(i, usuario) {
                        $('#'+cmb.toString()+'').append('<option value="'+usuario.id_usuario+'">'+usuario.nombre+'</option>');
                    });
                    resolve();
            
                }
                else {
                    alert('Falló la recuperacion del usuario');
                    reject();
                }

            },
            error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText);
                reject();
                },
            failure: function (response) { alert(response);
                reject();
            }
        });
    });

}

function Registrarse() {
    var msg = '';
    var nombre = $('#nombre').val();
    var apellido = $('#apellido').val();
    var email = $('#email').val();
    var telefono = $('#telefono').val();
    var direccion = $('#direccion').val();
    var contrasena = $('#password').val();
    var contrasena2= $('#passwordConfirm').val();
    var email = $('#email').val();
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (email.toString() === '' || contrasena.toString() === '' || contrasena2.toString() === '' || nombre.toString() === '' || apellido.toString() === '' || parseInt(telefono)=== '' || direccion.toString() === '') {
        msg = msg + '\nPor favor, rellene todos los campos.';
    }
    if (!regex.test(email)) {
        msg = msg + '\nPor favor, introduzca un correo electronico valido.';
    }
    if (contrasena != contrasena2) {
        msg = msg + '\nLas contraseñas deben coincidir';
    }
    if ( $('#terms').is(':checked') == false) {
        msg = msg + '\nDebe aceptar los terminos y condiciones';
    }
  
    if (msg != '') {
        alert(msg);
        return;
    }
    var fd = new FormData();
    var nombreCompleto = nombre.toString() + ' ' + apellido.toString();

    fd.append("Nombre", nombreCompleto);
    fd.append("Email", email);
    fd.append("Telefono", telefono);
    fd.append("Direccion", direccion);
    fd.append("Contrasena", contrasena);
    fd.append("TipoUsuario", 2);
    fd.append("Suscrito", 0);


    $.ajax({
        type: "POST",
        url: "/crearUsuario/",
        data: fd,
        contentType: false,
        processData: false,
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        success: function (response) {
            console.log(response);
            if (response.Excepciones != null) {
                alert('Ha ocurrido un error inesperado');
                console.log(response.Excepciones.message + '\n' + response.Excepciones.type + '\n' + response.Excepciones.details);
                return;
            }
            if (response.error != null) {
                alert(response.error);
                return;
            }
            if(response.estado === 'completado') {
                alert('Usuario creado con éxito');
                window.location.href = '/iniciarSesion/';
            } else {
                alert('Falló la creación del usuario');
            }

        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });


}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}




function OcultarDivs() {
    $('#DivUsuario').hide();
    $('#DivTipoUsuario').hide();
    $('#DivProducto').hide();
    $('#DivTipoProducto').hide();
    $('#DivSuscripcionVigente').hide();
    return true;
}

function mostrarDiv(div,tabla){
    if (OcultarDivs()) {
        $('#'+div.toString()+'').show();
    }
        $('#'+div.toString()+'').show();

    if (div.toString() === 'DivTipoUsuario') {
        buscarTiposUsuario();
    }
    if (div.toString() === 'DivUsuario') {
        buscarUsuarios();
        llenarCmbTipoUsuario('cmbDivUsuarioTipoUsuario');
    }
    if (div.toString() === 'DivProducto') {
        llenarCmbTipoProducto('cboProductoTipoProductoBus');
        buscarProductos();
    }
    if (div.toString() === 'DivTipoProducto') {
        buscarTipoProducto();
    }
    if (div.toString() === 'DivSuscripcionVigente') {
        llenarCmbUsuario('cmbSuscripcionBusUsuario');
        BuscarSuscripciones();
    }
    if (div.toString() === 'DivPromociones') {
        llenarCmbProducto('cboProductoPromocionoBus');
        buscarPromociones();
    }
    
}


