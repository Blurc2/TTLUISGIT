# Generated by Django 2.1.7 on 2019-03-10 22:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0006_auto_20190309_2059'),
    ]

    operations = [
        migrations.AlterField(
            model_name='departamento',
            name='grupoTrabajo',
            field=models.ManyToManyField(blank=True, null=True, to='tt.GruposTrabajo'),
        ),
        migrations.AlterField(
            model_name='subdepartamento',
            name='ubicacion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tt.Ubicacion'),
        ),
    ]