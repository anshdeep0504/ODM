# Generated by Django 2.2.27 on 2023-10-02 10:21

import rasterio
import os
import django.contrib.postgres.fields.jsonb
from django.db import migrations
from webodm import settings

def update_orthophoto_bands_fields(apps, schema_editor):
    Task = apps.get_model('app', 'Task')

    for t in Task.objects.all():

        bands = []
        orthophoto_path = os.path.join(settings.MEDIA_ROOT, "project", str(t.project.id), "task", str(t.id), "assets", "odm_orthophoto", "odm_orthophoto.tif")

        if os.path.isfile(orthophoto_path):
            try:
                with rasterio.open(orthophoto_path) as f:
                    names = [c.name for c in f.colorinterp]
                    for i, n in enumerate(names):
                        bands.append({
                            'name': n,
                            'description': f.descriptions[i]
                        })
            except Exception as e:
                print(e)

        print("Updating {} (with orthophoto bands: {})".format(t, str(bands)))

        t.orthophoto_bands = bands
        t.save()


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0038_remove_task_console_output'),
    ]

    operations = [
        migrations.RunPython(update_orthophoto_bands_fields),
    ]
