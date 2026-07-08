from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0039_remove_groupchatreadstate_constraints"),
    ]

    operations = [
        migrations.AddField(
            model_name="mockinterviewanswer",
            name="answer_summary",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="mockinterviewanswer",
            name="missing_points",
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="mockinterviewanswer",
            name="sample_answer",
            field=models.TextField(blank=True, null=True),
        ),
    ]
