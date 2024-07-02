# Generated by Django 2.0.3 on 2018-12-04 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nodeodm', '0003_auto_20180625_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='processingnode',
            name='max_images',
            field=models.PositiveIntegerField(blank=True, help_text='Maximum number of images accepted by this node.', null=True),
        ),
    ]
