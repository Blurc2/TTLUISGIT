# Generated by Django 2.1.7 on 2019-05-15 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tt', '0021_auto_20190511_1948'),
    ]

    operations = [
        migrations.AddField(
            model_name='orden',
            name='result',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]
