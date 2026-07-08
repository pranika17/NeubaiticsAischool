from django.utils.timezone import now

from ..models import (
    Chapter, StudentChapterProgress,
    StudentAssignment, CourseQuiz, QuizQuestions, AttemptQuiz,
    StudentCourseEnrollment, StudentCertificate
)

PASS_MARK = 60

def calculate_course_progress(student, course):
    # ✅ Videos
    total_videos = Chapter.objects.filter(course=course).count()
    completed_videos = StudentChapterProgress.objects.filter(
        student=student,
        chapter__course=course,
        is_completed=True
    ).count()

    videos_done = (total_videos > 0 and completed_videos == total_videos)

    # ✅ Assignments (course wise)
    total_assignments = StudentAssignment.objects.filter(student=student, course=course).count()
    completed_assignments = StudentAssignment.objects.filter(
        student=student, course=course, student_status=True
    ).count()

    assignments_done = (total_assignments > 0 and total_assignments == completed_assignments)

    # ✅ Quiz
    quiz_passed = False
    quiz_score = 0

    quiz_ids = CourseQuiz.objects.filter(course=course).values_list("quiz_id", flat=True)
    total_questions = QuizQuestions.objects.filter(quiz_id__in=quiz_ids).count()
    attempted_questions = AttemptQuiz.objects.filter(
        student=student,
        quiz_id__in=quiz_ids
    ).values("question_id").distinct().count()

    if total_questions > 0:
        correct = AttemptQuiz.objects.filter(
            student=student,
            quiz_id__in=quiz_ids,
            is_correct=True
        ).count()
        quiz_score = round((correct / total_questions) * 100)
        quiz_passed = attempted_questions >= total_questions and quiz_score >= PASS_MARK

    # ✅ Overall progress percentage
    # Each component weight = 33%
    percent_videos = (completed_videos / total_videos * 100) if total_videos else 0
    percent_assign = (completed_assignments / total_assignments * 100) if total_assignments else 100
    percent_quiz = 100 if quiz_passed else quiz_score

    overall = round((percent_videos + percent_assign + percent_quiz) / 3)

    return {
        "overall": overall,
        "videos": {"done": completed_videos, "total": total_videos, "ok": videos_done},
        "assignments": {"done": completed_assignments, "total": total_assignments, "ok": assignments_done},
        "quiz": {
            "score": quiz_score,
            "ok": quiz_passed,
            "attempted": attempted_questions,
            "total": total_questions,
            "pass_mark": PASS_MARK
        },
        "eligible": videos_done and assignments_done and quiz_passed
    }


def mark_course_completed(student, course):
    enroll = StudentCourseEnrollment.objects.filter(student=student, course=course).first()
    if enroll and not enroll.is_completed:
        enroll.is_completed = True
        enroll.completed_at = now()
        enroll.save()


def generate_certificate_if_approved(student, course):
    """
    ✅ Only generate certificate after:
    - eligible (video+assignment+quiz)
    - teacher approved (certificate_approved=True)
    """
    progress = calculate_course_progress(student, course)

    if not progress["eligible"]:
        return False, None, progress

    # mark course completed
    mark_course_completed(student, course)

    enroll = StudentCourseEnrollment.objects.filter(student=student, course=course).first()
    if not enroll or not enroll.certificate_approved:
        # waiting for teacher approval
        return False, None, {**progress, "waiting_teacher_approval": True}

    cert, _ = StudentCertificate.objects.get_or_create(student=student, course=course)
    return True, cert, {**progress, "waiting_teacher_approval": False}
