# Generated by Django 5.0.6 on 2024-06-13 22:01

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Compra',
            fields=[
                ('id_compra', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_compra', models.DateTimeField(default=django.utils.timezone.now)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('estado_despacho', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id_producto', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.TextField()),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('stock', models.IntegerField()),
                ('imagen_nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Promocion',
            fields=[
                ('id_promocion', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('descripcion', models.TextField()),
                ('descuento', models.DecimalField(decimal_places=2, help_text='Descuento en porcentaje', max_digits=5)),
            ],
        ),
        migrations.CreateModel(
            name='TipoProducto',
            fields=[
                ('id_tipo_producto', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='TipoUsuario',
            fields=[
                ('id_tipo_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='DetalleCompra',
            fields=[
                ('id_detalle_compra', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.PositiveIntegerField()),
                ('total_producto', models.DecimalField(decimal_places=2, max_digits=10)),
                ('compra', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.compra')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.producto')),
            ],
        ),
        migrations.AddField(
            model_name='producto',
            name='id_promocion',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='AppParaisoVerde.promocion'),
        ),
        migrations.AddField(
            model_name='producto',
            name='tipo_producto',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.tipoproducto'),
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id_usuario', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('direccion', models.CharField(max_length=255)),
                ('telefono', models.CharField(max_length=15)),
                ('suscrito', models.IntegerField()),
                ('tipo_usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.tipousuario')),
            ],
        ),
        migrations.CreateModel(
            name='Suscripcion',
            fields=[
                ('id_suscripcion', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_fin_suscripcion', models.DateTimeField(default=django.utils.timezone.now)),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.usuario')),
            ],
        ),
        migrations.AddField(
            model_name='compra',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.usuario'),
        ),
    ]
