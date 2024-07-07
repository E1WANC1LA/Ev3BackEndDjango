from django.db import models
from django.utils import timezone

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255)
    telefono = models.CharField(max_length=15)
    suscrito = models.IntegerField()
    tipo_usuario = models.ForeignKey('TipoUsuario', on_delete=models.CASCADE)
    correo = models.CharField(max_length=100 , unique=True , null=True)
    contrasena = models.CharField(max_length=100 , null=True)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']

class TipoUsuario(models.Model):
    id_tipo_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']

class TipoProducto(models.Model):
    id_tipo_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']

class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    tipo_producto = models.ForeignKey('TipoProducto', on_delete=models.CASCADE)
    descripcion = models.TextField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    imagen_nombre = models.CharField(max_length=255)
    id_promocion = models.ForeignKey('Promocion', on_delete=models.SET_NULL , null=True, blank=True)

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['nombre']

class Promocion(models.Model):
    id_promocion = models.AutoField(primary_key=True)
    id_producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    descripcion = models.TextField()
    descuento = models.IntegerField()

    def __str__(self):
        return self.nombre
    class Meta:
        ordering = ['id_promocion']

class Compra(models.Model):
    id_compra = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    fecha_compra = models.DateTimeField(default=timezone.now)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    descontado = models.DecimalField(max_digits=10, decimal_places=2)
    estado_despacho = models.CharField(max_length=50,)

    def __str__(self):
        return f"Compra #{self.id_compra} - {self.usuario.nombre}"
    class Meta:
        ordering = ['usuario']

class DetalleCompra(models.Model):
    id_detalle_compra = models.AutoField(primary_key=True)
    compra = models.ForeignKey('Compra', on_delete=models.CASCADE)
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    total_producto = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Detalle {self.id_detalle_compra} de Compra #{self.compra.id_compra}"
    class Meta:
        ordering = ['compra']

class Suscripcion(models.Model):
    id_suscripcion = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', on_delete=models.CASCADE)
    fecha_inicio_suscripcion = models.DateTimeField(default=timezone.now)
    fecha_fin_suscripcion = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Suscripción de {self.usuario.nombre}"
    class Meta:
        ordering = ['usuario']
