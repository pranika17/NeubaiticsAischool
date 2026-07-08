from django.core.management.base import BaseCommand

from main.models import Chapter, Course


AI_COURSE_TITLE = "Artificial Intelligence Fundamentals with Python"

AI_CHAPTERS = [
    {
        "title": "Introduction to AI Fundamentals",
        "description": "Understand what artificial intelligence is, where it is used, and how AI systems solve real-world problems.",
        "remarks": "External AI video URL",
        "video_url": "https://www.youtube.com/embed/2ePf9rue1Ao",
    },
    {
        "title": "Machine Learning Basics",
        "description": "Learn how machine learning models use data, features, labels, and training to make predictions.",
        "remarks": "External AI video URL",
        "video_url": "https://www.youtube.com/embed/RBSUwFGa6Fk",
    },
    {
        "title": "Neural Networks Explained",
        "description": "A visual introduction to neural networks, neurons, layers, weights, and model learning.",
        "remarks": "External AI video URL",
        "video_url": "https://www.youtube.com/embed/aircAruvnKk",
    },
    {
        "title": "Deep Learning Concepts",
        "description": "Explore deep learning, hidden layers, activations, and how neural networks learn complex patterns.",
        "remarks": "External AI video URL",
        "video_url": "https://www.youtube.com/embed/6M5VXKLf4D4",
    },
    {
        "title": "Generative AI and Large Language Models",
        "description": "Learn the basics of generative AI, language models, prompts, tokens, and modern AI applications.",
        "remarks": "External AI video URL",
        "video_url": "https://www.youtube.com/embed/kCc8FmEb1nY",
    },
]


class Command(BaseCommand):
    help = "Seed five external-video chapters for the Artificial Intelligence course."

    def handle(self, *args, **options):
        course = Course.objects.filter(title=AI_COURSE_TITLE).first()
        if not course:
            self.stdout.write(self.style.ERROR(f"Course not found: {AI_COURSE_TITLE}"))
            return

        created_count = 0
        updated_count = 0

        for chapter_data in AI_CHAPTERS:
            chapter, created = Chapter.objects.get_or_create(
                course=course,
                title=chapter_data["title"],
                defaults={
                    "description": chapter_data["description"],
                    "remarks": chapter_data["remarks"],
                    "video_url": chapter_data["video_url"],
                },
            )

            if created:
                created_count += 1
                continue

            changed_fields = []
            for field in ("description", "remarks", "video_url"):
                if getattr(chapter, field) != chapter_data[field]:
                    setattr(chapter, field, chapter_data[field])
                    changed_fields.append(field)

            if chapter.video:
                chapter.video = None
                changed_fields.append("video")

            if changed_fields:
                chapter.save(update_fields=changed_fields)
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"AI chapter seed complete: {created_count} chapters created, {updated_count} chapters updated."
            )
        )
