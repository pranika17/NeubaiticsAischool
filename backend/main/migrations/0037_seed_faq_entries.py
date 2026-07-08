from django.db import migrations


FAQ_ITEMS = [
    {
        "question": "How do I register as a student?",
        "answer": "Open the Student Register page, fill in your details, and submit the form. After admin approval, you can login and access your dashboard.",
    },
    {
        "question": "How do I register as a teacher?",
        "answer": "Open the Teacher Register page, submit your profile details, and wait for admin approval. Once approved, you can login and manage courses.",
    },
    {
        "question": "Why is my course enrollment still pending?",
        "answer": "Your enrollment stays pending until the admin verifies your request or payment proof. After approval, the course will appear as approved in your account.",
    },
    {
        "question": "How do I access study materials?",
        "answer": "Login as a student, open My Courses, choose your enrolled course, and then open the study materials or chapter section for that course.",
    },
    {
        "question": "How do I submit assignments?",
        "answer": "Go to My Assignments, open the assignment you want to complete, upload your answer or file, and submit it before the deadline if one is given.",
    },
    {
        "question": "How do quizzes work in this LMS?",
        "answer": "Teachers assign quizzes to courses. Students can open the quiz page, answer the questions, submit the attempt, and then view their result if the feature is enabled.",
    },
    {
        "question": "When will I get my certificate?",
        "answer": "Certificates become available only after you complete the required course progress and the certificate is approved in the system.",
    },
    {
        "question": "How can teachers add a new course?",
        "answer": "Login as a teacher, open the dashboard, go to Add Course, fill in the course details, and save the course. You can then add chapters, study materials, and quizzes.",
    },
    {
        "question": "How can I contact my teacher?",
        "answer": "Use the chat section from the student side to open your teacher conversation and send your message. Group chat may also be available for enrolled courses.",
    },
    {
        "question": "What should I do if I cannot login?",
        "answer": "First check your email and password. If your account is waiting for approval, you must wait for admin approval. If the problem continues, contact the admin or support team.",
    },
]


def seed_faqs(apps, schema_editor):
    Faq = apps.get_model("main", "Faq")
    for item in FAQ_ITEMS:
        Faq.objects.update_or_create(
            question=item["question"],
            defaults={"answer": item["answer"]},
        )


def remove_seeded_faqs(apps, schema_editor):
    Faq = apps.get_model("main", "Faq")
    questions = [item["question"] for item in FAQ_ITEMS]
    Faq.objects.filter(question__in=questions).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("main", "0036_groupchatreadstate"),
    ]

    operations = [
        migrations.RunPython(seed_faqs, remove_seeded_faqs),
    ]
