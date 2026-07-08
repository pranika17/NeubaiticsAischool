from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0041_teacher_teacher_code_student_student_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="mockinterview",
            name="difficulty_level",
            field=models.CharField(
                choices=[("easy", "Easy"), ("moderate", "Moderate"), ("difficult", "Difficult")],
                default="moderate",
                max_length=20,
            ),
        ),
        migrations.AddField(
            model_name="mockinterviewquestion",
            name="question_signature",
            field=models.CharField(blank=True, db_index=True, max_length=180, null=True),
        ),
    ]
