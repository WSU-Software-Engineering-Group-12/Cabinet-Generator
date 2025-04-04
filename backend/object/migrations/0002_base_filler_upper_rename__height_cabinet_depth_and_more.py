# Generated by Django 5.1.6 on 2025-03-25 14:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('object', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Base',
            fields=[
                ('cabinet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='object.cabinet')),
            ],
            options={
                'abstract': False,
            },
            bases=('object.cabinet',),
        ),
        migrations.CreateModel(
            name='Filler',
            fields=[
                ('cabinet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='object.cabinet')),
            ],
            options={
                'abstract': False,
            },
            bases=('object.cabinet',),
        ),
        migrations.CreateModel(
            name='Upper',
            fields=[
                ('cabinet_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='object.cabinet')),
            ],
            options={
                'abstract': False,
            },
            bases=('object.cabinet',),
        ),
        migrations.RenameField(
            model_name='cabinet',
            old_name='_height',
            new_name='depth',
        ),
        migrations.RenameField(
            model_name='cabinet',
            old_name='_position_x',
            new_name='height',
        ),
        migrations.RenameField(
            model_name='cabinet',
            old_name='_name',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='cabinet',
            old_name='_position_y',
            new_name='position_x',
        ),
        migrations.RenameField(
            model_name='cabinet',
            old_name='_width',
            new_name='position_y',
        ),
        migrations.AddField(
            model_name='cabinet',
            name='width',
            field=models.FloatField(default=0.0),
        ),
        migrations.CreateModel(
            name='BaseCorner',
            fields=[
                ('base_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='object.base')),
            ],
            options={
                'abstract': False,
            },
            bases=('object.base',),
        ),
        migrations.CreateModel(
            name='UpperCorner',
            fields=[
                ('upper_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='object.upper')),
            ],
            options={
                'abstract': False,
            },
            bases=('object.upper',),
        ),
    ]
