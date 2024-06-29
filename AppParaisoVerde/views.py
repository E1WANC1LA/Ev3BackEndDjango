from django.shortcuts import render,get_object_or_404
from django.http import JsonResponse
from .models import Usuario, TipoUsuario, TipoProducto, Producto, Promocion, Compra,Suscripcion,DetalleCompra
import traceback
from django.forms.models import model_to_dict
from django.core.files.storage import FileSystemStorage
from uuid import uuid4
import os


def index(request):
    return render(request, 'AppParaisoVerde/index.html')

def iniciarSesion(request):
    return render(request, 'AppParaisoVerde/iniciarSesion.html')

def nosotros(request):
    return render(request, 'AppParaisoVerde/nosotros.html')

def registro(request):
    return render(request, 'AppParaisoVerde/registro.html')

def productos(request):
    return render(request, 'AppParaisoVerde/productos.html')

def administrar(request):
    return render(request, 'AppParaisoVerde/administrar.html')
def carrito(request):
    return render(request, 'AppParaisoVerde/carrito.html')


def BuscarProductosCarrito(request):
    if request.method == 'POST':
        try:
            if 'carro' in request.session:
                carro = request.session['carro']
                productos = Producto.objects.filter(id_producto__in=carro['productos'].keys())
                productos_dict = []
                for producto in productos:
                    producto_dict = model_to_dict(producto)
                    producto_dict['cantidad'] = carro['productos'][str(producto.id_producto)]['cantidad']
                    productos_dict.append(producto_dict)
                if productos_dict.__len__() > 0:
                    return JsonResponse({'estado': 'completado', 'datos': productos_dict})
                else:
                    return JsonResponse({'estado': 'sin productos'})
            else:
                return JsonResponse({'estado': 'sin carro'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})




def ComprarCarrito(request):
    if request.method == 'POST':
        try:
            del request.session['carro']
            return JsonResponse({'estado': 'completado'})
            # if 'carro' in request.session:
            #     carro = request.session['carro']
            #     id_usuario = request.session['idUsuario']
            #     usuario = get_object_or_404(Usuario, pk=id_usuario)
            #     total = 0
            #     for producto in carro['productos'].values():
            #         producto_obj = get_object_or_404(Producto, pk=producto['idProducto'])
            #         total += producto_obj.precio_unitario * producto['cantidad']
            #     compra = Compra(usuario=usuario, total=total, estado_despacho='Pendiente')
            #     compra.save()
            #     for producto in carro['productos'].values():
            #         producto_obj = get_object_or_404(Producto, pk=producto['idProducto'])
            #         detalle_compra = DetalleCompra(compra=compra, producto=producto_obj, cantidad=producto['cantidad'], total_producto=producto_obj.precio_unitario*producto['cantidad'])
            #         detalle_compra.save()
            #     del request.session['carro']
            #     return JsonResponse({'estado': 'completado'})
            # else:
            #     return JsonResponse({'estado': 'sin carro'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})



def EliminarProductoCarrito(request):
    if request.method == 'POST':
        try:
            if 'carro' in request.session:
                id_producto = request.POST.get('IdProducto')
                carro = request.session['carro']
                if id_producto in carro['productos']:
                    del carro['productos'][id_producto]
                    request.session['carro'] = carro
                    return JsonResponse({'estado': 'completado', 'carro': carro})
                else:
                    return JsonResponse({'estado': 'sin producto'})
            else:
                return JsonResponse({'estado': 'sin carro'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})



def AdminCrearUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')
            direccion = request.POST.get('Direccion')
            telefono = request.POST.get('Telefono')
            suscrito = request.POST.get('Suscrito')
            tipo_usuario_id = request.POST.get('TipoUsuario')
            correo = request.POST.get('Email')
            contrasena = request.POST.get('Contrasena')

            # Obtén la instancia de TipoUsuario que corresponde al ID
            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
        
            # Inicializa un diccionario para los mensajes de error
            msg = {}

            # Comprueba si ya existe un usuario con el mismo correo
            if Usuario.objects.filter(correo=correo).exists():
                msg['correo'] = '<br>Este correo ya está en uso.'

            # Comprueba si ya existe un usuario con el mismo teléfono
            if Usuario.objects.filter(telefono=telefono).exists():
                msg['telefono'] = '<br>Este teléfono ya está en uso.'

            # Si hay errores, devuelve el diccionario de mensajes como JSON
            if msg:
                error_message = ""
                for key, value in msg.items():
                    error_message += f"{value}\n"
                return JsonResponse({'error': error_message})

            usuario = Usuario(nombre=nombre, direccion=direccion, telefono=telefono, suscrito=suscrito, tipo_usuario=tipo_usuario , correo=correo, contrasena=contrasena)
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    
def AdminCrearTipoProducto(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')

            tipo_producto = TipoProducto(nombre=nombre)
            tipo_producto.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def AdminBuscarTipoProductoEditar(request):
    if request.method == 'POST':
        try:
            id_tipo_producto = request.POST.get('IdTipoProducto')
            tipo_producto = get_object_or_404(TipoProducto, pk=id_tipo_producto)
            tipo_producto_dict = model_to_dict(tipo_producto)
            return JsonResponse({'estado': 'completado', 'datos': tipo_producto_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminEliminarUsuario(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario.delete()
            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def AdminCrearProducto(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')
            tipo_producto_id = request.POST.get('TipoProducto')
            descripcion = request.POST.get('Descripcion')
            precio_unitario = request.POST.get('PrecioUnitario')
            stock = request.POST.get('Stock')
            imagen_archivo = request.FILES.get('Imagen')  

            imagen_nombre = f"{precio_unitario}-{nombre}-{imagen_archivo.name}"

            fs = FileSystemStorage(location='static/img/')
            if fs.exists(imagen_nombre):
                return JsonResponse({'error': 'Ya existe un archivo con este nombre, por favor cambielo.'})


            filename = fs.save(imagen_nombre, imagen_archivo)
            
            ruta_completa = fs.url(filename)


            

            # Obtén la instancia de TipoProducto que corresponde al ID
            tipo_producto = get_object_or_404(TipoProducto, pk=tipo_producto_id)

            producto = Producto(nombre=nombre, tipo_producto=tipo_producto, descripcion=descripcion, precio_unitario=precio_unitario, stock=stock, imagen_nombre=imagen_nombre, id_promocion=None)
            producto.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def AdminBuscarProductoEditar(request):
    if request.method == 'POST':
        try:
            id_producto = request.POST.get('IdProducto')
            producto = get_object_or_404(Producto, pk=id_producto)
            producto_dict = model_to_dict(producto)
            return JsonResponse({'estado': 'completado', 'datos': producto_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

def AdminEditarProducto(request):
    if request.method == 'POST':
        try:
            id_producto = request.POST.get('IdProducto')
            nombre = request.POST.get('Nombre')
            tipo_producto_id = request.POST.get('TipoProducto')
            descripcion = request.POST.get('Descripcion')
            precio_unitario = request.POST.get('PrecioUnitario')
            stock = request.POST.get('Stock')
            imagen_archivo = request.FILES.get('Imagen')

            tipo_producto = get_object_or_404(TipoProducto, pk=tipo_producto_id)
            producto = get_object_or_404(Producto, pk=id_producto)
            producto.nombre = nombre
            producto.tipo_producto = tipo_producto
            producto.descripcion = descripcion
            producto.precio_unitario = precio_unitario
            producto.stock = stock
            if imagen_archivo:
                imagen_nombre = f"{precio_unitario}-{nombre}-{imagen_archivo.name}"
                fs = FileSystemStorage(location='static/img/')
                iamgenActual = producto.imagen_nombre
                if fs.exists(iamgenActual):
                    fs.delete(iamgenActual)
                if fs.exists(imagen_nombre):
                    return JsonResponse({'error': 'Ya existe un archivo con este nombre, por favor cambielo.'})
                filename = fs.save(imagen_nombre, imagen_archivo)
                ruta_completa = fs.url(filename)
                producto.imagen_nombre = imagen_nombre

            producto.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def AdminEliminarProducto(request):
    if request.method == 'POST':
        try:
            id_producto = request.POST.get('IdProducto')
            producto = get_object_or_404(Producto, pk=id_producto)
            fs = FileSystemStorage(location='static/img/')
            if fs.exists(producto.imagen_nombre):
                fs.delete(producto.imagen_nombre)
            producto.delete()
            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

def FiltrarProductos(request):
    if request.method == 'POST':
        try:
            tipo_producto_id = request.POST.get('Tipo', '0')
            precio_max = request.POST.get('Precio', '9999999999')
            Nombre = request.POST.get('Nombre', None)

            productos = Producto.objects.raw('''
                SELECT p.*, t.nombre as tipo_producto_nombre
                FROM AppParaisoVerde_producto p
                LEFT JOIN AppParaisoVerde_tipoproducto t ON p.tipo_producto_id = t.id_tipo_producto
                WHERE (p.nombre LIKE %s OR %s IS NULL) AND (p.tipo_producto_id = %s OR %s = '0') AND (p.precio_unitario <= %s OR %s = '9999999999')
            ''', [f"%{Nombre}%", f"%{Nombre}%", tipo_producto_id, tipo_producto_id, precio_max, precio_max])

            productos_dict = []
            for producto in productos:
                usuario_dict = model_to_dict(producto)
                usuario_dict['tipo_producto_nombre'] = producto.tipo_producto_nombre
                productos_dict.append(usuario_dict)
            if productos_dict.__len__() == 0:
                return JsonResponse({'estado': 'completado', 'datos': 'sin resultados'}, safe=False)
            return JsonResponse({'estado': 'completado', 'datos': productos_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def ObtenerCantidadProductosCarro(request):
    cantidad_productos = 0
    if 'carro' in request.session:
        carro = request.session['carro']
        for producto in carro['productos'].values():
            cantidad_productos = cantidad_productos+1
    if 'idUsuario' in request.session:
        return JsonResponse({'estado': 'completado', 'datos': cantidad_productos})
    if 'idUsuario' not in request.session:
        return JsonResponse({'estado': 'sin sesion', 'datos': cantidad_productos})
    else:
        return JsonResponse({'estado': 'fallido'})
        

def AgregarProductoCarro(request):
    if request.method == 'POST':
        try:
            if 'idUsuario' in request.session:
                id_producto = request.POST.get('IdProducto')
                cantidad = int(request.POST.get('Cantidad')) 
                # del request.session['carro']
                carro = request.session.get('carro', {})

                if 'productos' not in carro:
                    carro['productos'] = {}

                if id_producto in carro['productos']:
                    # Si el producto ya está en el carro, actualiza la cantidad
                    carro['productos'][id_producto]['cantidad'] += cantidad
                else:
                    # Si el producto no está en el carro, lo agrega con su id y cantidad
                    carro['productos'][id_producto] = {'idProducto': id_producto, 'cantidad': cantidad}

                # Guarda el carro actualizado en la sesión
                request.session['carro'] = carro

                return JsonResponse({'estado': 'completado', 'carro': carro})
            else:
                return JsonResponse({'estado': 'sin sesion', 'datos': 0})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def buscarProductosComprar(request):
    if request.method == 'POST':
        try:
            
            productos = Producto.objects.raw('''
                SELECT p.*, t.nombre as tipo_producto_nombre
                FROM AppParaisoVerde_producto p
                LEFT JOIN AppParaisoVerde_tipoproducto t ON p.tipo_producto_id = t.id_tipo_producto
            ''')
            productos_dict = []
            for producto in productos:
                usuario_dict = model_to_dict(producto)
                usuario_dict['tipo_producto_nombre'] = producto.tipo_producto_nombre
                productos_dict.append(usuario_dict)
            if productos_dict.__len__() == 0:
                return JsonResponse({'estado': 'completado', 'datos': 'sin resultados'}, safe=False)
            return JsonResponse({'estado': 'completado', 'datos': productos_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def AdminBuscarProductos(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre',None)
            tipo = request.POST.get('TipoProducto',None)
            precio = request.POST.get('Precio',None)
            nombre_param = '%' + nombre + '%' if nombre and nombre != 'null' else '%'
            tipo_param = tipo if tipo and tipo not in ['null', '0'] else '%'
            precio_param = precio if precio and precio != 'null' else '%'

            # Ajustar la consulta para usar LIKE en lugar de igualdad para los parámetros que pueden ser '%'
            productos = Producto.objects.raw('''
                SELECT p.*, t.nombre as tipo_producto_nombre
                FROM AppParaisoVerde_producto p
                LEFT JOIN AppParaisoVerde_tipoproducto t ON p.tipo_producto_id = t.id_tipo_producto
                WHERE (p.nombre LIKE %s OR %s = '%%') AND (CAST(p.tipo_producto_id AS CHAR) LIKE %s OR %s = '%%') AND (CAST(p.precio_unitario AS CHAR) LIKE %s OR %s = '%%')
            ''', [nombre_param, nombre_param, tipo_param, tipo_param, precio_param, precio_param])


            productos_dict = []
            for producto in productos:
                usuario_dict = model_to_dict(producto)
                usuario_dict['tipo_producto_nombre'] = producto.tipo_producto_nombre
                productos_dict.append(usuario_dict)
            return JsonResponse({'estado': 'completado', 'datos': productos_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def ObtenerSesion(request):
    if 'idUsuario' in request.session:
        idUsuario = request.session['idUsuario']
        return JsonResponse({'estado': 'completado', 'datos': idUsuario})
    else:
        return JsonResponse({'estado': 'fallido', 'datos': 0})

def AdminBuscarTiposProductoCMB(request):
    if request.method == 'POST':
        try:
            tipos_producto = TipoProducto.objects.all()
            tipos_producto_dict = [model_to_dict(tipo) for tipo in tipos_producto]
            return JsonResponse({'estado': 'completado', 'datos': tipos_producto_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def cerrarSesion(request):
    try:
        del request.session['tipo_usuario']
        del request.session['idUsuario']
        del request.session['carro']
        return JsonResponse({'estado': 'completado'})
    except Exception as e:
        return JsonResponse({
            'Excepciones': {
                'message': str(e),  # Mensaje de la excepción
                'type': type(e).__name__,  # Tipo de la excepción
                'details': traceback.format_exc()  # Detalles de la excepción
                  }
        })

def AdminEditarUsuario(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            nombre = request.POST.get('Nombre')
            direccion = request.POST.get('Direccion')
            telefono = request.POST.get('Telefono')
            suscrito = request.POST.get('Suscrito')
            tipo_usuario_id = request.POST.get('TipoUsuario')
            correo = request.POST.get('Correo')
            contrasena = request.POST.get('Contrasena')

            # Obtén la instancia de TipoUsuario que corresponde al ID
            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)

            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario.nombre = nombre
            usuario.direccion = direccion
            usuario.telefono = telefono
            usuario.suscrito = suscrito
            usuario.tipo_usuario = tipo_usuario
            usuario.correo = correo
            usuario.contrasena = contrasena
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminBuscarUsuarioEditar(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('IdUsuario')
            usuario = get_object_or_404(Usuario, pk=id_usuario)
            usuario_dict = model_to_dict(usuario)
            return JsonResponse({'estado': 'completado', 'datos': usuario_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })

def AdminBuscarUsuarios(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre', '')
            tipo_usuario = request.POST.get('TipoUsuario', '0')
            usuarios = Usuario.objects.raw('''
                SELECT u.*, t.nombre as tipo_usuario_nombre 
                FROM AppParaisoVerde_usuario u
                LEFT JOIN AppParaisoVerde_tipousuario t ON u.tipo_usuario_id = t.id_tipo_usuario
                WHERE (u.nombre LIKE %s OR %s = '') AND (u.tipo_usuario_id = %s OR %s = '0')
            ''', ['%' + nombre + '%', nombre, tipo_usuario, tipo_usuario])


            usuarios_dict = []
            for usuario in usuarios:
                usuario_dict = model_to_dict(usuario)
                usuario_dict['tipo_usuario_nombre'] = usuario.tipo_usuario_nombre
                usuarios_dict.append(usuario_dict)

            return JsonResponse({'estado': 'completado', 'datos': usuarios_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminBuscarTiposUsuarioCMB(request):
    if request.method == 'POST':
        try:
            tipos_usuario = TipoUsuario.objects.all()
            tipos_usuario_dict = [model_to_dict(tipo) for tipo in tipos_usuario]
            return JsonResponse({'estado': 'completado', 'datos': tipos_usuario_dict}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

def AdminEditarTipoProducto(request):
    if request.method == 'POST':
        try:
            id_tipo_producto = request.POST.get('IdTipoProducto')
            nombre = request.POST.get('Nombre')

            tipo_producto = get_object_or_404(TipoProducto, pk=id_tipo_producto)
            tipo_producto.nombre = nombre
            tipo_producto.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminEliminarTipoProducto(request):
    if request.method == 'POST':
        try:
            id_tipo_producto = request.POST.get('IdTipoProducto')
            tipo_producto = get_object_or_404(TipoProducto, pk=id_tipo_producto)
            tipo_producto.delete()
            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminBuscarTiposProducto(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre',None)
            if nombre:
                tipos_producto = TipoProducto.objects.filter(nombre__icontains=nombre)
            else:
                tipos_producto = TipoProducto.objects.all()

            tipos_producto_conteo = []
            for tipo in tipos_producto:
                conteo = Producto.objects.filter(tipo_producto=tipo).count()
                tipo_dict = model_to_dict(tipo)
                tipo_dict['conteo_productos'] = conteo
                tipos_producto_conteo.append(tipo_dict)
            return JsonResponse({'estado': 'completado', 'datos': tipos_producto_conteo}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminBuscarTiposUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre',None)
            if nombre:
                tipos_usuario = TipoUsuario.objects.filter(nombre__icontains=nombre)
            else:
                tipos_usuario = TipoUsuario.objects.all()

            tipos_usuario_conteo = []

            for tipo in tipos_usuario:
                conteo = Usuario.objects.filter(tipo_usuario=tipo).count()
                tipo_dict = model_to_dict(tipo)
                tipo_dict['conteo_usuarios'] = conteo
                tipos_usuario_conteo.append(tipo_dict)
            return JsonResponse({'estado': 'completado', 'datos': tipos_usuario_conteo}, safe=False)
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    

def AdminEditarTipoUsuario(request):
    if request.method == 'POST':
        try:
            id_tipo_usuario = request.POST.get('IdTipoUsuario')
            nombre = request.POST.get('Nombre')

            tipo_usuario = get_object_or_404(TipoUsuario, pk=id_tipo_usuario)
            tipo_usuario.nombre = nombre
            tipo_usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminBuscarTipoUsuarioEditar(request):
    if request.method == 'POST':
        try:
            id_tipo_usuario = request.POST.get('IdTipoUsuario')
            tipo_usuario = get_object_or_404(TipoUsuario, pk=id_tipo_usuario)
            tipo_usuario_dict = model_to_dict(tipo_usuario)
            return JsonResponse({'estado': 'completado', 'datos': tipo_usuario_dict})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
    
def AdminEliminarTipoUsuario(request):
    if request.method == 'POST':
        try:
            id_tipo_usuario = request.POST.get('IdTipoUsuario')
            tipo_usuario = get_object_or_404(TipoUsuario, pk=id_tipo_usuario)
            tipo_usuario.delete()
            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def AdminCrearTipoUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')

            tipo_usuario = TipoUsuario(nombre=nombre)
            tipo_usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})


def crearUsuario(request):
    if request.method == 'POST':
        try:
            nombre = request.POST.get('Nombre')
            direccion = request.POST.get('Direccion')
            telefono = request.POST.get('Telefono')
            suscrito = request.POST.get('Suscrito')
            tipo_usuario_id = request.POST.get('TipoUsuario')
            correo = request.POST.get('Email')
            contrasena = request.POST.get('Contrasena')

            # Obtén la instancia de TipoUsuario que corresponde al ID
            tipo_usuario = get_object_or_404(TipoUsuario, pk=tipo_usuario_id)
        
            # Inicializa un diccionario para los mensajes de error
            msg = {}

            # Comprueba si ya existe un usuario con el mismo correo
            if Usuario.objects.filter(correo=correo).exists():
                msg['correo'] = '<br>Este correo ya está en uso.'

            # Comprueba si ya existe un usuario con el mismo teléfono
            if Usuario.objects.filter(telefono=telefono).exists():
                msg['telefono'] = '<br>Este teléfono ya está en uso.'

            # Si hay errores, devuelve el diccionario de mensajes como JSON
            if msg:
                error_message = ""
                for key, value in msg.items():
                    error_message += f"{value}\n"
                return JsonResponse({'error': error_message})

            usuario = Usuario(nombre=nombre, direccion=direccion, telefono=telefono, suscrito=suscrito, tipo_usuario=tipo_usuario , correo=correo, contrasena=contrasena)
            usuario.save()

            return JsonResponse({'estado': 'completado'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})

def abrirSesion(request):
    if request.method == 'POST':
        try:
            correo = request.POST.get('Email')
            contrasena = request.POST.get('Contrasena')

            # Comprueba si existe un usuario con el correo y contraseña proporcionados
            usuario = Usuario.objects.filter(correo=correo, contrasena=contrasena).first()
            if usuario: 
                request.session['tipo_usuario'] = usuario.tipo_usuario.id_tipo_usuario
                request.session['idUsuario'] = usuario.id_usuario
                return JsonResponse({'estado': 'completado', 'tipo_usuario': usuario.tipo_usuario.id_tipo_usuario})
            else:
                return JsonResponse({'error': 'Correo o contraseña incorrectos.'})
        except Exception as e:
            return JsonResponse({
                'Excepciones': {
                    'message': str(e),  # Mensaje de la excepción
                    'type': type(e).__name__,  # Tipo de la excepción
                    'details': traceback.format_exc()  # Detalles de la excepción
                      }
            })
    else:
        return JsonResponse({'estado': 'fallido'})
