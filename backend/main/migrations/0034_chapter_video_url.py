from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0033_teacherstudentchat_audio_and_transcript"),
    ]

    operations = [
        migrations.AddField(
            model_name="chapter",
            name="video_url",
            field=models.URLField(blank=True, null=True),
        ),
    ]
