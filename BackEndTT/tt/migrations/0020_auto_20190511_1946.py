# Generated by Django 2.1.7 on 2019-05-12 00:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0019_empleado_observaciones'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleado',
            name='adminstate',
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='equipo',
            name='mac',
            field=models.CharField(blank=True, max_length=17, null=True),
        ),
    ]
