# Generated by Django 2.1.7 on 2019-05-16 18:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0025_auto_20190516_0057'),
    ]

    operations = [
        migrations.AlterField(
            model_name='instalacionsoft',
            name='descripcion',
            field=models.TextField(max_length=200),
        ),
    ]
