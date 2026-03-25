from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0037_seed_faq_entries"),
    ]

    operations = [
        migrations.CreateModel(
            name="MockInterview",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("interview_type", models.CharField(choices=[("intro", "Self Introduction"), ("technical", "Technical"), ("coding", "Coding"), ("hr", "HR"), ("full", "Full Interview")], default="full", max_length=20)),
                ("status", models.CharField(choices=[("not_started", "Not Started"), ("in_progress", "In Progress"), ("completed", "Completed")], default="not_started", max_length=20)),
                ("total_questions", models.PositiveIntegerField(default=0)),
                ("asked_questions", models.PositiveIntegerField(default=0)),
                ("overall_score", models.PositiveIntegerField(default=0)),
                ("score_intro", models.PositiveIntegerField(default=0)),
                ("score_technical", models.PositiveIntegerField(default=0)),
                ("score_coding", models.PositiveIntegerField(default=0)),
                ("score_communication", models.PositiveIntegerField(default=0)),
                ("strengths", models.TextField(blank=True, null=True)),
                ("weaknesses", models.TextField(blank=True, null=True)),
                ("improvement_plan", models.TextField(blank=True, null=True)),
                ("recommended_topics", models.TextField(blank=True, null=True)),
                ("ai_summary", models.TextField(blank=True, null=True)),
                ("started_at", models.DateTimeField(auto_now_add=True)),
                ("completed_at", models.DateTimeField(blank=True, null=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="mock_interviews", to="main.course")),
                ("student", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="mock_interviews", to="main.student")),
            ],
            options={
                "verbose_name_plural": "Mock Interviews",
                "ordering": ["-started_at"],
            },
        ),
        migrations.CreateModel(
            name="MockInterviewQuestion",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("round_type", models.CharField(choices=[("intro", "Self Introduction"), ("technical", "Technical"), ("coding", "Coding"), ("hr", "HR")], max_length=20)),
                ("question_text", models.TextField()),
                ("ideal_points", models.TextField(blank=True, null=True)),
                ("coding_prompt", models.TextField(blank=True, null=True)),
                ("expected_answer", models.TextField(blank=True, null=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("is_answered", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("interview", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="questions", to="main.mockinterview")),
            ],
            options={
                "verbose_name_plural": "Mock Interview Questions",
                "ordering": ["order", "id"],
            },
        ),
        migrations.CreateModel(
            name="MockInterviewAnswer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("answer_text", models.TextField(blank=True, null=True)),
                ("score", models.PositiveIntegerField(default=0)),
                ("communication_score", models.PositiveIntegerField(default=0)),
                ("technical_score", models.PositiveIntegerField(default=0)),
                ("confidence_score", models.PositiveIntegerField(default=0)),
                ("feedback", models.TextField(blank=True, null=True)),
                ("improvement_tip", models.TextField(blank=True, null=True)),
                ("suggested_followup", models.TextField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("interview", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="answers", to="main.mockinterview")),
                ("question", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="answers", to="main.mockinterviewquestion")),
            ],
            options={
                "verbose_name_plural": "Mock Interview Answers",
                "ordering": ["question__order", "id"],
                "unique_together": {("interview", "question")},
            },
        ),
    ]
