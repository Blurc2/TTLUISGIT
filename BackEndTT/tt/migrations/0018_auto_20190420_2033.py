# Generated by Django 2.1.7 on 2019-04-21 01:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0017_auto_20190420_2032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='empleado',
            name='numero',
            field=models.CharField(max_length=10),
        ),
    ]