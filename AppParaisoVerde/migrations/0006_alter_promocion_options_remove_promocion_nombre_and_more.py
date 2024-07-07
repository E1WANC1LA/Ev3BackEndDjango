# Generated by Django 5.0.6 on 2024-07-07 01:22

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AppParaisoVerde', '0005_compra_descontado'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='promocion',
            options={'ordering': ['id_promocion']},
        ),
        migrations.RemoveField(
            model_name='promocion',
            name='nombre',
        ),
        migrations.AddField(
            model_name='promocion',
            name='id_producto',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='AppParaisoVerde.producto'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='promocion',
            name='descuento',
            field=models.IntegerField(),
        ),
    ]
