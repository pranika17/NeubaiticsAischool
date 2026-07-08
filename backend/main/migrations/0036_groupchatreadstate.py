from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import now


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0035_coursegroupmessage_type_title_meeting_link"),
    ]

    operations = [
        migrations.CreateModel(
            name="GroupChatReadState",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("last_seen_at", models.DateTimeField(default=now)),
                ("group", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="read_states", to="main.coursechatgroup")),
                ("student", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to="main.student")),
                ("teacher", models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to="main.teacher")),
            ],
            options={
                "verbose_name_plural": "Group Chat Read States",
            },
        ),
        migrations.AddConstraint(
            model_name="groupchatreadstate",
            constraint=models.UniqueConstraint(condition=models.Q(("teacher__isnull", False)), fields=("group", "teacher"), name="unique_group_teacher_read_state"),
        ),
        migrations.AddConstraint(
            model_name="groupchatreadstate",
            constraint=models.UniqueConstraint(condition=models.Q(("student__isnull", False)), fields=("group", "student"), name="unique_group_student_read_state"),
        ),
    ]
