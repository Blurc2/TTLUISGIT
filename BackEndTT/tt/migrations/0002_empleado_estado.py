# Generated by Django 2.1.7 on 2019-03-10 01:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleado',
            name='estado',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]
