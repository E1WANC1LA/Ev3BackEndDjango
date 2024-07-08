from django.shortcuts import render,get_object_or_404
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle , Image,Spacer,PageBreak
from reportlab.lib import colors
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Usuario, TipoUsuario, TipoProducto, Producto, Promocion, Compra,Suscripcion,DetalleCompra
import traceback
from django.forms.models import model_to_dict
from django.core.files.storage import FileSystemStorage
from uuid import uuid4
import os,json
from datetime import datetime, timedelta
from django.conf import settings



def index(request):
    if 'tipo_usuario' in request.session and request.session['tipo_usuario'] == 1:
        return render(request, 'AppParaisoVerde/administrar.html')
    return render(request, 'AppParaisoVerde/index.html')

def iniciarSesion(request):
    return render(request, 'AppParaisoVerde/iniciarSesion.html')

def MiPerfil(request):
    return render(request, 'AppParaisoVerde/MiPerfil.html')

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
                promociones = Promocion.objects.filter(id_producto__in=carro['productos'].keys())
                productos_dict = []
                for producto in productos:
                    producto_dict = model_to_dict(producto)
                    producto_dict['cantidad'] = carro['productos'][str(producto.id_producto)]['cantidad']
                    producto_dict['descuentoPromocion'] = promociones.filter(id_producto=producto.id_producto)[0].descuento if promociones.filter(id_producto=producto.id_producto) else 0
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





def AdminBuscarSuscripciones(request):
    if request.method == 'POST':
        try:
            fecha_inicio = request.POST.get('FechaInicio', '1900-01-01')
            fecha_fin = request.POST.get('FechaFin', '9999-12-31')
            id_usuario = request.POST.get('Usuario', '0')
            suscripciones = Suscripcion.objects.raw('''
                SELECT s.*, u.nombre as usuario_nombre
                FROM AppParaisoVerde_suscripcion s
                LEFT JOIN AppParaisoVerde_usuario u ON s.usuario_id = u.id_usuario
                WHERE s.fecha_inicio_suscripcion >= %s AND s.fecha_fin_suscripcion <= %s AND (s.usuario_id = %s OR %s = '0')
            ''', [fecha_inicio, fecha_fin, id_usuario, id_usuario])
            suscripciones_dict = []
            for suscripcion in suscripciones:
                suscripcion_dict = model_to_dict(suscripcion)
                suscripcion_dict['usuario_nombre'] = suscripcion.usuario_nombre
    
                suscripciones_dict.append(suscripcion_dict)
            return JsonResponse({'estado': 'completado', 'datos': suscripciones_dict}, safe=False)
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


def BuscarMisCompras(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
            compras = Compra.objects.filter(usuario_id=id_usuario)
            compras_dict = []
            for compra in compras:
                compra_dict = model_to_dict(compra)
                compra_dict['fecha_compra'] = compra.fecha_compra.strftime('%Y-%m-%d %H:%M:%S')  
                compras_dict.append(compra_dict)

            if compras_dict.__len__() == 0:
                return JsonResponse({'estado': 'sin compras', 'datos': 'sin resultados'})    
            return JsonResponse({'estado': 'completado', 'datos': compras_dict}, safe=False)
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

def UsuarioSuscrito(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
            fecha_actual = datetime.now()
            fecha_actual = fecha_actual + timedelta(days=30)
            fecha_actual = fecha_actual - timedelta(days=30)
            query = '''
            SELECT * FROM AppParaisoVerde_suscripcion
            WHERE usuario_id = %s
            AND fecha_fin_suscripcion >= %s
            AND fecha_inicio_suscripcion <= %s
            '''
            params = [id_usuario, fecha_actual, fecha_actual]
            suscripcion = Suscripcion.objects.raw(query, params)

            # Verificar si hay resultados
            suscripcion_list = list(suscripcion)

            if suscripcion_list:
                return JsonResponse({'estado': 'completado', 'datos': 'existe'})
            else:
                return JsonResponse({'estado': 'completado', 'datos': 'no existe'})  
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



def AdminCrearSuscripcion(request):
    if request.method == 'POST':
        try:
            id_usuario = request.POST.get('Usuario')
            fecha_inicio_suscripcion = request.POST.get('FechaInicio')
            fecha_fin_suscripcion = request.POST.get('FechaFin')

            fecha_inicio_nueva = datetime.strptime(fecha_inicio_suscripcion, "%Y-%m-%d").date()
            fecha_fin_nueva = datetime.strptime(fecha_fin_suscripcion, "%Y-%m-%d").date()


            usuario = get_object_or_404(Usuario, pk=id_usuario)

            raw_query = """
            SELECT * FROM AppParaisoVerde_suscripcion
            WHERE usuario_id = %s
            AND (
                (fecha_inicio_suscripcion <= %s AND fecha_fin_suscripcion >= %s)
                OR
                (fecha_inicio_suscripcion <= %s AND fecha_fin_suscripcion >= %s)
                OR
                (%s between fecha_inicio_suscripcion AND fecha_fin_suscripcion)
                OR
                (%s between fecha_inicio_suscripcion AND fecha_fin_suscripcion)
                OR
                (fecha_inicio_suscripcion = %s)
            )
            """
            suscripciones_existentes = Suscripcion.objects.raw(raw_query, [id_usuario, fecha_fin_nueva, fecha_inicio_nueva, fecha_fin_nueva, fecha_inicio_nueva, fecha_inicio_nueva, fecha_fin_nueva,fecha_fin_nueva])

            # Verificar si hay resultados
            if len(list(suscripciones_existentes)) > 0:
                return JsonResponse({'estado': 'fallido', 'error': 'Ya existe una suscripción activa en ese rango de fechas para este usuario.'})


            suscripcion = Suscripcion(usuario=usuario, fecha_inicio_suscripcion=fecha_inicio_nueva, fecha_fin_suscripcion=fecha_fin_nueva)
            suscripcion.save()

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

def AdminBuscarUsuariosCMB(request):
    if request.method == 'POST':
        try:
            usuarios = Usuario.objects.filter(tipo_usuario_id=2)
            usuarios_dict = [model_to_dict(usuario) for usuario in usuarios]
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



def AdminEliminarSuscripcion(request):
    if request.method == 'POST':
        try:
            id_suscripcion = request.POST.get('IdSuscripcion')
            suscripcion = get_object_or_404(Suscripcion, pk=id_suscripcion)
            suscripcion.delete()
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

def BuscarInformacionUsuario(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
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
    else:
        return JsonResponse({'estado': 'fallido'})

def Suscribirse(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
            fecha_actual = datetime.now()
            fecha_fin = fecha_actual + timedelta(days=30)
            suscripcion = Suscripcion(usuario_id=id_usuario, fecha_inicio_suscripcion=fecha_actual, fecha_fin_suscripcion=fecha_fin)
            suscripcion.save()
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

def CancelarSuscripcion(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
            suscripcion = Suscripcion.objects.filter(usuario_id=id_usuario)
            suscripcion.delete()
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

def ComprarCarrito(request):
    if request.method == 'POST':
        try:
            id_usuario = request.session['idUsuario']
            fecha_actual = datetime.now()
            total = request.POST.get('Total')
            descontado = request.POST.get('Descontado')
            if descontado == 'in descuento':
                descontado = 0
            estado_despacho = request.POST.get('EstadoDespacho')
            productos_json = request.POST.get('Productos')
            productos = json.loads(productos_json)

            for producto in productos:
                id_producto = producto['id_producto']
                cantidad = producto['cantidad']
                precio = producto['precio']
                productoValidar = Producto.objects.get(id_producto=id_producto)
                if productoValidar.stock < int(cantidad):
                    producto_nombre = Producto.objects.get(id_producto=id_producto).nombre
                    return JsonResponse({'estado': 'fallido', 'error': 'No hay suficiente stock de '+ producto_nombre +'.'})

            compra = Compra(usuario_id=id_usuario, fecha_compra=fecha_actual, total=total, descontado=descontado, estado_despacho=estado_despacho)
            compra.save()

            max_id_compra = Compra.objects.raw('SELECT MAX(id_compra) as id_compra FROM AppParaisoVerde_compra where usuario_id = %s', [id_usuario])

            for producto in productos:
                id_producto = producto['id_producto']
                cantidad = producto['cantidad']
                precio = producto['precio']
                Producto.objects.filter(id_producto=int(id_producto)).update(stock=Producto.objects.get(id_producto=int(id_producto)).stock - int(cantidad))
                detalle_compra = DetalleCompra(compra_id=max_id_compra[0].id_compra, producto_id=id_producto, cantidad=cantidad, total_producto=precio)
                detalle_compra.save()
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
    else:
        return JsonResponse({'estado': 'fallido'})


def ImprimirDetalleCompra(request):
    if request.method == 'POST':
        try:
            id_compra = request.POST.get('IdCompra')
            compra = Compra.objects.get(id_compra=id_compra)  
            detalle_compra = compra.detallecompra_set.all()  

            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="compra_{id_compra}.pdf"'

            doc = SimpleDocTemplate(response, pagesize=letter)
            elements = []

            id_usuario = request.session['idUsuario']
            usuario = Usuario.objects.get(id_usuario=id_usuario)

            
            ruta_imagen_absoluta = os.path.join(settings.BASE_DIR, 'static\img\logoJardineria.png')

            imagen = Image(ruta_imagen_absoluta, width=100, height=50 ,  hAlign='LEFT')
            elements.append(imagen)

            elements.append(Spacer(1, 50))

            usuario_info = [["Datos del Cliente", ''],["Nombre:", usuario.nombre], ["Correo:", usuario.correo], ["Teléfono:", usuario.telefono]]
            t_usuario = Table(usuario_info, colWidths=[200, 150],hAlign='LEFT')
            t_usuario.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                                        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                                        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                                        ('TOPPADDING', (0, 0), (-1, -1), 12),
                                        ('BOX', (0, 0), (-1, -1), 1, colors.black),  
                                        ('GRID', (0, 1), (-1, -1), 1, colors.black) 
                                        ]))
            elements.append(t_usuario)
            
            elements.append(Spacer(1, 50))

            if compra:
                compra_info = [["Datos de Compra:", ''],
                            ["Numero de Compra:", compra.id_compra],
                            ["Fecha:", compra.fecha_compra.strftime("%Y-%m-%d")],
                            ["Estado Despacho:", compra.estado_despacho],
                            ["Descuento:", compra.descontado],
                            ["Total:", compra.total]]
                t = Table(compra_info, colWidths=[200, 150],hAlign='LEFT')
                t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                                        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                                        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                                        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                                        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                                        ('TOPPADDING', (0, 0), (-1, -1), 12),
                                        ('BOX', (0, 0), (-1, -1), 1, colors.black),  
                                        ('GRID', (0, 1), (-1, -1), 1, colors.black) 
                                        ]))
                elements.append(t)
                elements.append(PageBreak())

            # Cabeceras de la tabla de detalles
            detalle_headers = [['Imagen','Producto', 'Cantidad', 'Precio']]
            detalle_data1 = detalle_headers

            detalle_data = []
            for detalle in detalle_compra:
                producto = Producto.objects.get(id_producto=detalle.producto_id)
                ruta_imagen = os.path.join(settings.BASE_DIR, 'static\img\\' + producto.imagen_nombre)
                imagen_producto = Image(ruta_imagen, width=50, height=50)  # Ajusta el tamaño según sea necesario
                detalle_data.append([imagen_producto, producto.nombre, detalle.cantidad, detalle.total_producto])

            t = Table(detalle_data1 + detalle_data, colWidths=[50, 200, 100, 100])  # Ajusta según sea necesario
            t.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('TOPPADDING', (0, 0), (-1, -1), 12),
                ('BOX', (0, 0), (-1, -1), 1, colors.black),  
                ('GRID', (0, 1), (-1, -1), 1, colors.black) 
                ]))

            # Suponiendo que 'elements' es una lista donde estás agregando todos los elementos para luego generar un PDF
            elements.append(t)

            # Construir el PDF
            doc.build(elements)
            return response
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

def AdminBuscarPromociones(request):
    if request.method == 'POST':
        try:
            descuento = request.POST.get('Descuento', '0')
            descripcion = request.POST.get('Descripcion', '')
            producto = request.POST.get('Producto', '0')
            promociones = Promocion.objects.raw('''
                SELECT p.*, pr.nombre as producto_nombre
                FROM AppParaisoVerde_promocion p
                LEFT JOIN AppParaisoVerde_producto pr ON p.id_producto_id = pr.id_producto
                WHERE (p.descuento = %s OR %s = '0') AND p.descripcion LIKE %s AND (p.id_producto_id = %s OR %s = '0')
            '''
            , [descuento, descuento, f'%{descripcion}%', producto, producto])

            promociones_dict = []
            for promocion in promociones:
                promocion_dict = model_to_dict(promocion)
                promocion_dict['producto_nombre'] = promocion.producto_nombre
                promociones_dict.append(promocion_dict)

            return JsonResponse({'estado': 'completado', 'datos': promociones_dict}, safe=False)
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



def AdminEditarPromocion(request):
    if request.method == 'POST':
        try:
            id_promocion = request.POST.get('IdPromocion')
            descripcion = request.POST.get('Descripcion')
            descuento = request.POST.get('Descuento')

            promocion = get_object_or_404(Promocion, pk=id_promocion)
            promocion.descripcion = descripcion
            promocion.descuento = descuento
            promocion.save()

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

def AdminBuscarPromocionEditar(request):
    if request.method == 'POST':
        try:
            id_promocion = request.POST.get('IdPromocion')
            promocion = get_object_or_404(Promocion, pk=id_promocion)
            promocion_dict = model_to_dict(promocion)
            return JsonResponse({'estado': 'completado', 'datos': promocion_dict})
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



def AdminEliminarPromocion(request):
    if request.method == 'POST':
        try:
            id_promocion = request.POST.get('IdPromocion')
            promocion = get_object_or_404(Promocion, pk=id_promocion)
            promocion.delete()
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


def AdminAgregarPromocion(request):
    if request.method == 'POST':
        try:
            id_producto = request.POST.get('Producto')
            descripcion = request.POST.get('Descripcion')
            descuento = request.POST.get('Descuento')

            producto = get_object_or_404(Producto, pk=id_producto)
            existe_promocion = Promocion.objects.filter(id_producto=producto).exists()
            if existe_promocion:
                return JsonResponse({'estado': 'fallido', 'error': 'Ya existe una promoción para este producto.'})
            promocion = Promocion(id_producto=producto, descripcion=descripcion, descuento=descuento)
            promocion.save()

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



def AdminBuscarProductosCMB(request):
    if request.method == 'POST':
        try:
            productos = Producto.objects.all()
            productos_dict = [model_to_dict(producto) for producto in productos]
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
                SELECT p.*, t.nombre as tipo_producto_nombre, pr.descuento as descuento, pr.id_promocion as promocion_id
                FROM AppParaisoVerde_producto p
                LEFT JOIN AppParaisoVerde_tipoproducto t ON p.tipo_producto_id = t.id_tipo_producto
                LEFT JOIN AppParaisoVerde_promocion pr ON p.id_producto = pr.id_producto_id
            ''')
            productos_dict = []
            for producto in productos:
                producto_dict = model_to_dict(producto)
                producto_dict['tipo_producto_nombre'] = producto.tipo_producto_nombre
                # Usar el alias 'promocion_id' para evitar el mapeo automático
                producto_dict['id_promocion'] = producto.promocion_id if producto.promocion_id else None
                producto_dict['descuento'] = producto.descuento if producto.descuento else 0
                productos_dict.append(producto_dict)
            if len(productos_dict) == 0:
                return JsonResponse({'estado': 'completado', 'datos': 'sin resultados'}, safe=False)
            return JsonResponse({'estado': 'completado', 'datos': productos_dict}, safe=False)
        except Exception as e:
    # Manejo de excepciones
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
