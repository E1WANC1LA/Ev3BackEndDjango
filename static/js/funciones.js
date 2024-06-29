var GL_ID_TIPO_USUARIO=0;
var GL_ID_TIPO_PRODUCTO=0;
var GL_ID_USUARIO=0;
var GL_ID_PRODUCTO=0;

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
                    $('#productList').append(`
                        <div class="producto col-md-3" data-IdProducto="${producto.id_producto}" data-nombre="${producto.nombre}" data-tipo="${producto.tipo_producto}" data-precio="${producto.precio_unitario}">
                                <img src="../../static/img/${producto.imagen_nombre}" class="card-img-top img" alt="Imagen del producto">
                                <p class="card-text">Nombre: ${producto.nombre}</p>
                                <p class="card-text">Precio: ${producto.precio_unitario}</p>
                                <p class="card-text">Tipo: ${producto.tipo_producto_nombre}</p>
                                <input type="number" class="quantity-input cantidad">
                                <button  class="add-to-cart custom-button" onclick="anadirAlCarro(this);">Añadir al carro</button>
                        </div>
                    `);
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

                        cellNombre.className = 'nombreProducto';
                        cellNombre.value = producto.id_producto;
                        cellImagen.innerHTML = '<img src="../../static/img/'+producto.imagen_nombre+'" alt="Imagen del producto" class="img-fluid imagen-carrito">';
                        cellNombre.innerHTML = producto.nombre;
                        cellPrecio.className = 'precioProducto';
                        cellPrecio.innerHTML = producto.precio_unitario.split('.')[0];
                        cellDescripcion.innerHTML = producto.descripcion;
                        cellCantidad.innerHTML = '<input type="number" class="form-control cantidadProducto" value="'+producto.cantidad+'" min="1" max="'+producto.stock+'" onblur="actualizarPrecioCarrito();" id="CantidadProducto'+producto.id_producto+'">';
                        cellAcciones.innerHTML = '<button class="btn custom-button" onclick="EliminaProductoCarrito('+producto.id_producto+');"><i class="mdi mdi-trash-can-outline"></i></button>';
                        
                        FilaDatos.appendChild(cellImagen);
                        FilaDatos.appendChild(cellNombre);
                        FilaDatos.appendChild(cellPrecio);
                        FilaDatos.appendChild(cellDescripcion);
                        FilaDatos.appendChild(cellCantidad);
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

                    filaFinal.appendChild(cellRelleno);
                    filaFinal.appendChild(cellRelleno2);
                    filaFinal.appendChild(cellRelleno3);
                    filaFinal.appendChild(cellRelleno4);
                    filaFinal.appendChild(cellTotal);
                    filaFinal.appendChild(cellComprar);

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
    $('.precioProducto').each(function() {
        var precio = parseInt($(this).text());
        var cantidad = parseInt($(this).parent().find('.cantidadProducto').val());
        total = total + (precio * cantidad);
    });
    $('#totalCarrito').text("$"+total);

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
        alert('Este Mantenedor no esta terminado, por favor cambiar de mantenedor');
        $('#DivSuscripcionVigente').hide();
        // buscarSuscripciones();
    }
    
}


function ComprarCarrito(){
    var fd = new FormData();
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
                window.location.href = '/';
            } else {
                alert('Falló la compra');
            }
        },
        error: function (XMLHttpRequest, text, error) { ; alert(XMLHttpRequest.responseText); },
        failure: function (response) { alert(response); }
    });

}
