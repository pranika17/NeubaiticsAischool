from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0032_alter_quizquestions_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="teacherstudentchat",
            name="audio",
            field=models.FileField(blank=True, null=True, upload_to="chat_audio/"),
        ),
        migrations.AddField(
            model_name="teacherstudentchat",
            name="audio_transcript",
            field=models.TextField(blank=True, null=True),
        ),
    ]
