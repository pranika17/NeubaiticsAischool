from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0034_chapter_video_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="coursegroupmessage",
            name="meeting_link",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="coursegroupmessage",
            name="message_type",
            field=models.CharField(
                choices=[
                    ("message", "Message"),
                    ("instruction", "Instruction"),
                    ("meeting", "Meeting Link"),
                ],
                default="message",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="coursegroupmessage",
            name="title",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
