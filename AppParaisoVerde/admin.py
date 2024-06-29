from django.contrib import admin
from .models import Usuario, TipoUsuario, TipoProducto, Producto, Promocion, Compra,Suscripcion,DetalleCompra

# Register your models here.
admin.site.register(Usuario)
admin.site.register(TipoUsuario)
admin.site.register(TipoProducto)
admin.site.register(Producto)
admin.site.register(Promocion)
admin.site.register(Compra)
admin.site.register(Suscripcion)
admin.site.register(DetalleCompra)