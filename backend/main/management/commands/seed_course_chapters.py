from django.core.management.base import BaseCommand

from main.models import Chapter, Course


COURSE_CHAPTERS = {
    "Artificial Intelligence Fundamentals with Python": {
        "title": "Introduction to AI Fundamentals",
        "description": "A starter chapter for AI concepts, model thinking, and Python-based learning workflow.",
        "remarks": "External video URL chapter",
        "video_url": "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    "Full Stack Web Development with React & Django": {
        "title": "Full Stack Project Overview",
        "description": "A starter chapter for understanding frontend, backend, API flow, and full stack application structure.",
        "remarks": "External video URL chapter",
        "video_url": "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    "Ethical Hacking and Cybersecurity Essentials": {
        "title": "Cybersecurity Essentials Introduction",
        "description": "A starter chapter for security basics, safe practice, and ethical hacking workflow.",
        "remarks": "External video URL chapter",
        "video_url": "https://media.w3.org/2010/05/sintel/trailer.mp4",
    },
}


class Command(BaseCommand):
    help = "Seed one external-video chapter for each main course."

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for course_title, chapter_data in COURSE_CHAPTERS.items():
            course = Course.objects.filter(title=course_title).first()
            if not course:
                self.stdout.write(self.style.WARNING(f"Course not found: {course_title}"))
                continue

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

            if changed_fields:
                chapter.video = None
                changed_fields.append("video")
                chapter.save(update_fields=changed_fields)
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {created_count} chapters created, {updated_count} chapters updated."
            )
        )
