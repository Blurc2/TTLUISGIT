# Generated by Django 2.1.7 on 2019-05-15 03:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0022_orden_result'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='orden',
            name='result',
        ),
    ]
