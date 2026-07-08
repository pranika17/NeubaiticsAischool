from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0038_mockinterview_mockinterviewanswer_mockinterviewquestion"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="groupchatreadstate",
            name="unique_group_teacher_read_state",
        ),
        migrations.RemoveConstraint(
            model_name="groupchatreadstate",
            name="unique_group_student_read_state",
        ),
    ]
