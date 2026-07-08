from django.db import migrations, models


def populate_public_codes(apps, schema_editor):
    Teacher = apps.get_model("main", "Teacher")
    Student = apps.get_model("main", "Student")

    for teacher in Teacher.objects.all().only("id", "teacher_code"):
        if not teacher.teacher_code:
            teacher.teacher_code = f"TCH{teacher.id:05d}"
            teacher.save(update_fields=["teacher_code"])

    for student in Student.objects.all().only("id", "student_code"):
        if not student.student_code:
            student.student_code = f"STD{student.id:05d}"
            student.save(update_fields=["student_code"])


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0040_mockinterviewanswer_feedback_fields"),
    ]

    operations = [
        migrations.AddField(
            model_name="teacher",
            name="teacher_code",
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="student",
            name="student_code",
            field=models.CharField(blank=True, max_length=20, null=True, unique=True),
        ),
        migrations.RunPython(populate_public_codes, migrations.RunPython.noop),
    ]
