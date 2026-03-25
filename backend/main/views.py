from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.contrib.flatpages.models import FlatPage
from . serializers import TeacherSerializer,WorkshopSerializer,StudentCourseEnrollSerializer,ChapterSerializer,TeacherStudentChatSerializer,FlatPageSerializer,FaqSerializer,StudyMaterialSerializer,AttempQuizSerializer,QuestionSerializer,CourseQuizSerializer,QuizSerializer,StudentDashboardSerializer,StudentFavoriteCourseSerializer,StudentAssignmentSerializer,CategorySerializer,CourseSerializer,ChapterSerializer,StudentSerializer,StudentCourseEnrollSerializer,CourseRatingSerializer,TeacherDashboardSerializer,MockInterviewSerializer,MockInterviewQuestionSerializer,MockInterviewAnswerSerializer
from rest_framework import permissions
from django.db.models import Q, Count
from . import models
from rest_framework.pagination import PageNumberPagination
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from . import models
from rest_framework import generics
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from . import models
from .serializers import TeacherSerializer
from . import models

from .models import TeacherStudentChat, Teacher, StudentCourseEnrollment, CourseChatGroup, CourseGroupMessage, Course, GroupChatReadState


from rest_framework.decorators import api_view
from rest_framework.response import Response

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now
from django.core.signing import TimestampSigner, BadSignature, SignatureExpired
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError

from .models import (
    Student, Course, StudentCourseEnrollment,
    StudentCertificate
)

from .certificate.certificate import (
    calculate_course_progress,
    generate_certificate_if_approved
)

CHAT_TOKEN_SIGNER = TimestampSigner(salt="lms-chat-auth")
CHAT_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7


def issue_chat_token(role, user_id):
    payload = f"{role}:{int(user_id)}"
    return CHAT_TOKEN_SIGNER.sign(payload)


def parse_chat_token(token):
    try:
        raw = CHAT_TOKEN_SIGNER.unsign(token, max_age=CHAT_TOKEN_MAX_AGE_SECONDS)
    except (BadSignature, SignatureExpired):
        return None

    if ":" not in raw:
        return None

    role, user_id = raw.split(":", 1)
    if role not in {"teacher", "student"}:
        return None

    try:
        return {"role": role, "user_id": int(user_id)}
    except ValueError:
        return None







from django.shortcuts import render

def home(request):
    return render(request, "index.html")



class StandardResultSetPagination(PageNumberPagination):
    page_size=8
    page_size_query_param='page_size'
    max_page_size=1



class TeacherList(generics.ListCreateAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        # Pass request to serializer so image_url is a full URL
        return {'request': self.request}

    def get_queryset(self):
        if 'popular' in self.request.GET:
            sql = """
            SELECT t.*, COUNT(c.id) as total_course
            FROM main_teacher as t
            INNER JOIN main_course as c ON c.teacher_id = t.id
            GROUP BY t.id
            ORDER BY total_course DESC
            """
            return models.Teacher.objects.raw(sql)
        return super().get_queryset()

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

    def get_serializer_context(self):
        return {'request': self.request}






@csrf_exempt
def teacher_login(request):
    if request.method != "POST":
        return JsonResponse({"bool": False, "msg": "Invalid request method"})

    try:
        data = json.loads(request.body)
        email = str(data.get("email", "")).strip().lower()
        password = data.get("password")
    except:
        return JsonResponse({"bool": False, "msg": "Invalid request"})

    try:
        validate_email(email)
    except DjangoValidationError:
        return JsonResponse({"bool": False, "msg": "Please provide a valid email address."})

    try:
        teacher = Teacher.objects.get(email=email)
    except Teacher.DoesNotExist:
        return JsonResponse({"bool": False, "msg": "Invalid credentials"})

    # Approval check
    if not teacher.is_approved:
        return JsonResponse({
            "bool": False,
            "msg": "waiting_approval",
            "detail": "Your teacher account is waiting for admin approval. After approval, please login."
        })

    # Password check (if hashed)
    if check_password(password, teacher.password):
        return JsonResponse({
            "bool": True,
            "teacher_id": teacher.id,
            "chat_token": issue_chat_token("teacher", teacher.id),
        })

    return JsonResponse({"bool": False, "msg": "Invalid credentials"})






class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Student.objects.all()
    serializer_class=StudentSerializer


class TeacherDashboard(generics.RetrieveAPIView):
    queryset=models.Teacher.objects.all()
    serializer_class=TeacherDashboardSerializer

    
class CategoryList(generics.ListCreateAPIView):
    queryset=models.CourseCategory.objects.all()
    serializer_class=CategorySerializer
class CourseList(generics.ListCreateAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        qs = super().get_queryset()

        # --- Filter by category ---
        category_id = self.request.GET.get('category')
        if category_id:
            try:
                qs = qs.filter(category_id=int(category_id))
            except (ValueError, TypeError):
                qs = models.Course.objects.none()

        # --- Limit number of results ---
        if 'result' in self.request.GET:
            limit = int(self.request.GET['result'])
            qs = qs.order_by('-id')[:limit]

        # --- Popular filter ---
        if 'popular' in self.request.GET:
            qs = qs.order_by('-id')[:limit]

        # --- Filter by skill and teacher ---
        if 'skill_name' in self.request.GET and 'teacher' in self.request.GET:
            skill_name = self.request.GET['skill_name']
            teacher_id = self.request.GET['teacher']
            teacher = models.Teacher.objects.filter(id=teacher_id).first()
            qs = qs.filter(techs__icontains=skill_name, teacher=teacher)

        # --- Search functionality ---
        if 'searchstring' in self.kwargs:
            search = self.kwargs['searchstring']
            qs = qs.filter(Q(title__icontains=search))

        return qs

class TeacherCourseList(generics.ListAPIView):
    serializer_class=CourseSerializer

    def get_queryset(self):
        teacher_id=self.kwargs['teacher_id']
        teacher=models.Teacher.objects.get(pk=teacher_id)
        return models.Course.objects.filter(teacher=teacher)

class CourseDetailView(generics.RetrieveAPIView):
    queryset=models.Course.objects.all()
    serializer_class=CourseSerializer

class TeacherCourseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Course.objects.all()
    serializer_class=CourseSerializer
# views.py
from rest_framework import generics
from .models import Chapter, Course
from .serializers import ChapterSerializer

class ChapterList(generics.ListCreateAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}


class CourseChapterList(generics.ListCreateAPIView):
    serializer_class = ChapterSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = Course.objects.get(pk=course_id)
        return Chapter.objects.filter(course=course)

    def get_serializer_context(self):
        return {'request': self.request}


class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Chapter.objects.all()
    serializer_class = ChapterSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_serializer_context(self):
        return {'request': self.request}




class StudentDashboard(generics.RetrieveAPIView):
    queryset=models.Student.objects.all()
    serializer_class=StudentDashboardSerializer


import json
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.db.models import Q
from django.contrib.auth.hashers import check_password

from rest_framework import generics, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Student
from .serializers import StudentSerializer



class StudentRegisterView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(is_approved=False)

        return Response({
            "bool": True,
            "msg": "Registered successfully! Waiting for admin approval"
        }, status=status.HTTP_201_CREATED)

@csrf_exempt
def student_login(request):
    if request.method != "POST":
        return JsonResponse({"bool": False, "msg": "Invalid request method"})

    try:
        data = json.loads(request.body)
        email = data.get("email", "").strip().lower()
        password = data.get("password", "").strip()
    except:
        email = request.POST.get("email", "").strip().lower()
        password = request.POST.get("password", "").strip()

    try:
        validate_email(email)
    except DjangoValidationError:
        return JsonResponse({"bool": False, "msg": "Please provide a valid email address."})

    student = Student.objects.filter(
        Q(email__iexact=email)
    ).first()

    if not student:
        return JsonResponse({"bool": False, "msg": "Invalid credentials"})

    if not check_password(password, student.password):
        return JsonResponse({"bool": False, "msg": "Invalid credentials"})

    if not student.is_approved:
        return JsonResponse({
            "bool": False,
            "msg": "waiting_approval",
            "detail": "Your student account is waiting for admin approval. After approval, please login."
        })

    return JsonResponse({
        "bool": True,
        "student_id": student.id,
        "chat_token": issue_chat_token("student", student.id),
    })






from rest_framework.parsers import MultiPartParser, FormParser

class StudentEnrollCourseList(generics.ListCreateAPIView):
    queryset = models.StudentCourseEnrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        student_id = request.data.get("student_id")
        course_id = request.data.get("course_id")
        payment_proof = request.FILES.get("payment_proof")

        enrollment, created = models.StudentCourseEnrollment.objects.get_or_create(
            student_id=student_id,
            course_id=course_id,
            defaults={
                "status": "pending",
                "payment_proof": payment_proof
            }
        )

        if not created:
            return Response({
                "message": "Already applied",
                "status": enrollment.status
            })

        return Response({
            "message": "Payment submitted. Waiting for admin approval.",
            "status": "pending"
        })


from django.http import JsonResponse

def fetch_enroll_status(request, student_id, course_id):
    enrollment = models.StudentCourseEnrollment.objects.filter(
        student_id=student_id,
        course_id=course_id
    ).first()

    if not enrollment:
        return JsonResponse({"status": "not_enrolled"})

    return JsonResponse({
        "status": enrollment.status   # pending / approved / rejected
    })


# views.py
from rest_framework import generics
from . import models, serializers

class EnrolledStudentsByTeacher(generics.ListAPIView):
    serializer_class = serializers.EnrolledCourseStudentSerializer

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        return models.StudentCourseEnrollment.objects.filter(
            course__teacher__id=teacher_id
        ).select_related('student', 'course').distinct()



class EnrolledCoursesByStudent(generics.ListAPIView):
    serializer_class = StudentCourseEnrollSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return models.StudentCourseEnrollment.objects.filter(student__id=student_id).distinct()


class CourseRatingList(generics.ListCreateAPIView):
    queryset=models.CourseRating.objects.all()
    serializer_class=CourseRatingSerializer
    pagination_class=StandardResultSetPagination

    def get_queryset(self):
        student_id = self.request.GET.get("student_id")
        if student_id:
            return models.CourseRating.objects.filter(
                student_id=student_id,
                course__isnull=False
            ).order_by("-review_time")
        if 'popular' in self.request.GET:
            sql="SELECT *, AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id ORDER BY avg_rating desc LIMIT 3"
            return models.CourseRating.objects.raw(sql)
        if 'all' in self.request.GET:
            sql="SELECT *, AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id ORDER BY avg_rating desc"
            return models.CourseRating.objects.raw(sql)
        if 'testimonials' in self.request.GET or 'student-test' in self.request.path:
            return models.CourseRating.objects.filter(
                course__isnull=False,
                reviews__isnull=False
            ).exclude(reviews__exact="").order_by('-review_time')
        return models.CourseRating.objects.filter(course__isnull=False).order_by('-rating')


    def get_serializer_context(self):
        return {"request": self.request}

    def create(self, request, *args, **kwargs):
        course_id = request.data.get("course")
        student_id = request.data.get("student")
        rating = request.data.get("rating")
        reviews = request.data.get("reviews")

        if not course_id or not student_id:
            return Response({"error": "course and student are required"}, status=400)

        existing = models.CourseRating.objects.filter(
            course_id=course_id,
            student_id=student_id
        ).first()

        payload = request.data.copy()
        serializer_context = self.get_serializer_context()

        if existing:
            serializer = self.get_serializer(
                existing,
                data={
                    "course": course_id,
                    "student": student_id,
                    "rating": rating,
                    "reviews": reviews,
                },
                partial=True,
                context=serializer_context,
            )
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=200)

        serializer = self.get_serializer(data=payload, context=serializer_context)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

def fetch_rating_status(request,student_id,course_id):
    student=models.Student.objects.filter(id=student_id).first()
    course=models.Course.objects.filter(id=course_id).first()
    ratingStatus=models.CourseRating.objects.filter(course=course,student=student).count()
    if ratingStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from . import models

@csrf_exempt
def teacher_change_password(request, teacher_id):
    if request.method != "POST":
        return JsonResponse({"bool": False, "msg": "Invalid request"})

    password = request.POST.get("password")

    if not password:
        return JsonResponse({"bool": False, "msg": "Password required"})

    try:
        teacher = models.Teacher.objects.get(id=teacher_id)
    except models.Teacher.DoesNotExist:
        return JsonResponse({"bool": False})

    # ✅ HASH PASSWORD BEFORE SAVE
    teacher.password = make_password(password)
    teacher.save()

    return JsonResponse({"bool": True})


# class StudentFavoriteCourseList(generics.ListCreateAPIView):
#     queryset=models.StudentFavoriteCourse.objects.all()
#     serializer_class=StudentFavoriteCourseSerializer

#     def get_queryset(self):
#         if 'student_id' in self.kwargs:
#             student_id=self.kwargs['student_id']
#             student=models.Student.objects.get(pk=student_id)
#             return models.StudentFavoriteCourse.objects.filter(student=student).distinct()

# def remove_favorite_course(request,course_id,student_id):
#     student=models.Student.objects.filter(id=student_id).first()
#     course=models.Course.objects.filter(id=course_id).first()
#     favoriteStatus=models.StudentFavoriteCourse.objects.filter(course=course,student=student).delete()
#     if favoriteStatus:
#         return JsonResponse({'bool':True})
#     else:
#         return JsonResponse({'bool':False})





from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

from . import models
from .serializers import StudentFavoriteCourseSerializer


class StudentFavoriteCourseList(generics.ListCreateAPIView):
    serializer_class = StudentFavoriteCourseSerializer

    def get_queryset(self):
        student_id = self.kwargs.get("student_id")
        if student_id:
            return models.StudentFavoriteCourse.objects.filter(
                student_id=student_id
            ).select_related("course", "student").order_by("-id")

        return models.StudentFavoriteCourse.objects.all().order_by("-id")

    def create(self, request, *args, **kwargs):
        # Prevent duplicates using get_or_create
        course_id = request.data.get("course")
        student_id = request.data.get("student")

        if not course_id or not student_id:
            return Response(
                {"bool": False, "msg": "course and student are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        fav, created = models.StudentFavoriteCourse.objects.get_or_create(
            course_id=course_id,
            student_id=student_id,
            defaults={"status": True},
        )

        if not created:
            # already exists => update status true
            if fav.status is False:
                fav.status = True
                fav.save()

            return Response(
                {"bool": False, "msg": "Already in favorites"},
                status=status.HTTP_200_OK,
            )

        serializer = self.get_serializer(fav)
        return Response(
            {"bool": True, "msg": "Added to favorites", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )


@api_view(["GET", "DELETE"])
def remove_favorite_course(request, course_id, student_id):
    deleted_count, _ = models.StudentFavoriteCourse.objects.filter(
        course_id=course_id, student_id=student_id
    ).delete()

    if deleted_count > 0:
        return JsonResponse({"bool": True})
    return JsonResponse({"bool": False})


@api_view(["GET"])
def fetch_favorite_status(request, student_id, course_id):
    exists = models.StudentFavoriteCourse.objects.filter(
        student_id=student_id, course_id=course_id
    ).exists()

    return JsonResponse({"bool": exists})


    
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from . import models
from .serializers import StudentAssignmentSerializer


class AssignmentList(generics.ListCreateAPIView):
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        teacher_id = self.kwargs['teacher_id']
        return models.StudentAssignment.objects.filter(
            student_id=student_id,
            teacher_id=teacher_id
        )

    def perform_create(self, serializer):
        teacher_id = self.kwargs['teacher_id']
        student_id = self.kwargs['student_id']
        teacher = get_object_or_404(models.Teacher, id=teacher_id)
        student = get_object_or_404(models.Student, id=student_id)
        serializer.save(teacher=teacher, student=student)


class MyAssignmentList(generics.ListAPIView):
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return models.StudentAssignment.objects.filter(student_id=student_id)


class UpdateAssignmentList(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer
    parser_classes = [MultiPartParser, FormParser]   # ✅ important for file upload


# ✅ New API: student submits assignment (upload file + img + text)
class SubmitAssignment(generics.UpdateAPIView):
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, *args, **kwargs):
        assignment = self.get_object()

        # mark as submitted
        assignment.student_status = True
        assignment.submitted_time = timezone.now()

        # save fields
        assignment.answer_text = request.data.get("answer_text", assignment.answer_text)

        if request.FILES.get("upload_file"):
            assignment.upload_file = request.FILES["upload_file"]

        if request.FILES.get("upload_image"):
            assignment.upload_image = request.FILES["upload_image"]

        assignment.save()

        return Response(
            StudentAssignmentSerializer(assignment, context={"request": request}).data,
            status=status.HTTP_200_OK
        )

class Quizlist(generics.ListCreateAPIView):
    queryset=models.Quiz.objects.all()
    serializer_class=QuizSerializer

class TeacherQuizList(generics.ListCreateAPIView):
    serializer_class=QuizSerializer

    def get_queryset(self):
        teacher_id=self.kwargs['teacher_id']
        teacher=models.Teacher.objects.get(pk=teacher_id)
        return models.Quiz.objects.filter(teacher=teacher)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from . import models

@csrf_exempt
def student_change_password(request, student_id):
    if request.method != "POST":
        return JsonResponse({"bool": False, "msg": "Invalid request"})

    password = request.POST.get("password")

    try:
        student = models.Student.objects.get(id=student_id)
    except models.Student.DoesNotExist:
        return JsonResponse({"bool": False})

    # ✅ HASH PASSWORD BEFORE SAVE
    student.password = make_password(password)
    student.save()

    return JsonResponse({"bool": True})



class TeacherCourseQuizList(generics.ListAPIView):
    """
    Returns teacher quizzes with assigned status for a particular course.
    """
    def list(self, request, *args, **kwargs):
        teacher_id = self.kwargs["teacher_id"]
        course_id = self.kwargs["course_id"]

        # All quizzes created by teacher
        quizzes = models.Quiz.objects.filter(teacher_id=teacher_id).order_by("-add_time")

        # Already assigned quiz ids for this course
        assigned_ids = set(
            models.CourseQuiz.objects.filter(course_id=course_id)
            .values_list("quiz_id", flat=True)
        )

        data = []
        for q in quizzes:
            data.append({
                "id": q.id,
                "title": q.title,
                "detail": q.detail,
                "add_time": q.add_time,
                "assigned": q.id in assigned_ids
            })

        return Response(data)

# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CourseQuiz, StudentCourseEnrollment
from .serializers import QuizSerializer

class StudentQuizzes(APIView):
    def get(self, request, student_id):
        # Step 1: Get courses student is enrolled in
        enrolled_courses = StudentCourseEnrollment.objects.filter(
            student_id=student_id,
            status="approved"
        ).values_list('course_id', flat=True)

        # Step 2: Get quizzes assigned to these courses
        course_quizzes = CourseQuiz.objects.filter(course_id__in=enrolled_courses).select_related('quiz')

        # Step 3: Extract unique quiz objects
        quiz_list = list({cq.quiz.id: cq.quiz for cq in course_quizzes}.values())

        # Step 4: Serialize quizzes
        serializer = QuizSerializer(quiz_list, many=True)
        return Response(serializer.data)



class TeacherQuizDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Quiz.objects.all()
    serializer_class=QuizSerializer

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.Quiz.objects.all()
    serializer_class=QuizSerializer
 
class CourseQuizList(generics.ListCreateAPIView):
    queryset=models.CourseQuiz.objects.all()
    serializer_class=CourseQuizSerializer

    def get_queryset(self):
        if 'course_id' in self.kwargs:
            course_id=self.kwargs['course_id']
            course=models.Course.objects.get(pk=course_id)
            return models.CourseQuiz.objects.filter(course=course)

def fetch_quiz_assign_status(request,quiz_id,course_id):
    quiz=models.Quiz.objects.filter(id=quiz_id).first()
    course=models.Course.objects.filter(id=course_id).first()
    assignStatus=models.CourseQuiz.objects.filter(course=course,quiz=quiz).count()
    if assignStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})






from rest_framework import generics
from rest_framework.response import Response
from .models import QuizQuestions
from .serializers import QuestionSerializer

class QuizQuestionList(generics.GenericAPIView):
    serializer_class = QuestionSerializer

    def get(self, request, quiz_id, question_id=None, limit=None):
        student_id = request.query_params.get("student_id")
        if student_id:
            try:
                student_id_int = int(student_id)
            except (TypeError, ValueError):
                return Response({"error": "Invalid student_id"}, status=400)

            if not _student_has_quiz_access(student_id_int, quiz_id):
                return Response(
                    {"error": "You are not enrolled in the course for this quiz."},
                    status=403
                )

        # Get all questions of the quiz ordered by ID
        questions_list = list(QuizQuestions.objects.filter(quiz_id=quiz_id).order_by('id'))

        # If question_id is provided, return the next question
        if question_id is not None:
            # find index of current question in list
            current_index = next((i for i, q in enumerate(questions_list) if q.id == question_id), -1)
            next_index = current_index + 1
            if next_index < len(questions_list):
                serializer = QuestionSerializer([questions_list[next_index]], many=True)
                return Response({"finished": False, "questions": serializer.data})
            else:
                return Response({"finished": True, "questions": []})

        # If limit is provided, return limited questions
        if limit is not None:
            questions_limited = questions_list[:limit]
            serializer = QuestionSerializer(questions_limited, many=True)
            return Response({"finished": False, "questions": serializer.data})

        # Default: return all questions
        serializer = QuestionSerializer(questions_list, many=True)
        return Response({"finished": False, "questions": serializer.data})




class QuizQuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.QuizQuestions.objects.all()
    serializer_class = QuestionSerializer
    lookup_field = 'id'


from rest_framework import generics
from .models import QuizQuestions
from .serializers import QuestionSerializer

class QuizQuestionCreate(generics.CreateAPIView):
    queryset = QuizQuestions.objects.all()
    serializer_class = QuestionSerializer





    # views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import CourseQuiz, QuizQuestions
from .serializers import QuestionSerializer

class CourseQuizQuestions(APIView):
    def get(self, request, course_id, student_id):
        # check enrollment
        enrolled = StudentCourseEnrollment.objects.filter(
            student_id=student_id,
            course_id=course_id,
            status="approved"
        ).exists()

        if not enrolled:
            return Response({"error": "Not enrolled"}, status=403)

        # get quiz linked to course
        course_quiz = CourseQuiz.objects.filter(course_id=course_id).first()
        if not course_quiz:
            return Response({"questions": []})

        questions = QuizQuestions.objects.filter(
            quiz=course_quiz.quiz
        )

        serializer = QuestionSerializer(questions, many=True)
        return Response({
            "quiz_id": course_quiz.quiz.id,
            "questions": serializer.data
        })



from django.http import JsonResponse
from rest_framework import generics
from . import models, serializers

from rest_framework import generics
from django.http import JsonResponse
from django.db.models import Max
from . import models, serializers




class AttempQuizList(generics.ListCreateAPIView):
    serializer_class = serializers.AttempQuizSerializer

    def list(self, request, *args, **kwargs):
        quiz_id = self.kwargs.get('quiz_id')
        teacher_id = request.query_params.get("teacher_id")

        if quiz_id and teacher_id:
            try:
                teacher_id_int = int(teacher_id)
            except (TypeError, ValueError):
                return JsonResponse({"error": "Invalid teacher_id"}, status=400)

            if not _teacher_owns_quiz(teacher_id_int, quiz_id):
                return JsonResponse(
                    {"error": "You are not allowed to view this quiz attempts."},
                    status=403
                )

        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        if quiz_id:
            teacher_id = self.request.query_params.get("teacher_id")
            if teacher_id:
                try:
                    teacher_id_int = int(teacher_id)
                except (TypeError, ValueError):
                    return models.AttemptQuiz.objects.none()

                if not _teacher_owns_quiz(teacher_id_int, quiz_id):
                    return models.AttemptQuiz.objects.none()

            # MySQL-compatible way: get latest attempt per student
            latest_attempts = (
                models.AttemptQuiz.objects
                .filter(quiz_id=quiz_id)
                .values('student_id')
                .annotate(latest_id=Max('id'))
            )
            latest_ids = [x['latest_id'] for x in latest_attempts]
            return models.AttemptQuiz.objects.filter(id__in=latest_ids)
        return models.AttemptQuiz.objects.all()

    def create(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        quiz_id = request.data.get('quiz')
        question_id = request.data.get('question')
        selected_answer = request.data.get('right_ans')

        if not student_id or not quiz_id or not question_id:
            return JsonResponse(
                {"error": "student, quiz and question are required"},
                status=400
            )

        try:
            student_id = int(student_id)
            quiz_id = int(quiz_id)
            question_id = int(question_id)
        except (TypeError, ValueError):
            return JsonResponse({"error": "Invalid ids provided"}, status=400)

        if not _student_has_quiz_access(student_id, quiz_id):
            return JsonResponse(
                {"error": "You are not enrolled in the course for this quiz."},
                status=403
            )

        question = models.QuizQuestions.objects.filter(id=question_id, quiz_id=quiz_id).first()
        if not question:
            return JsonResponse({"error": "Question not found for this quiz"}, status=404)

        if question.question_type == "coding":
            return JsonResponse(
                {"error": "Use coding submission endpoint for coding questions"},
                status=400
            )

        if selected_answer is None:
            return JsonResponse({"error": "Answer is required"}, status=400)

        correct_answer = question.right_ans
        is_correct = (selected_answer == correct_answer)

        attempt, created = models.AttemptQuiz.objects.update_or_create(
        student_id=student_id,
        quiz_id=quiz_id,
        question_id=question_id,
        defaults={
            "selected_answer": selected_answer,   # 👈 FIXED
            "is_correct": is_correct
        }
        )

        return JsonResponse({
        "correct": is_correct,
        "correct_answer": correct_answer,
        "selected_answer": selected_answer,
        "attempt_id": attempt.id
        })


def fetch_quiz_attempt_status(request,quiz_id,student_id):
    if not _student_has_quiz_access(student_id, quiz_id):
        return JsonResponse(
            {"error": "You are not enrolled in the course for this quiz."},
            status=403
        )

    quiz=models.Quiz.objects.filter(id=quiz_id).first()
    student=models.Student.objects.filter(id=student_id).first()
    attemptStatus=models.AttemptQuiz.objects.filter(student=student,question__quiz=quiz).count()
    print(models.AttemptQuiz.objects.filter(student=student,question__quiz=quiz).query)
    if attemptStatus > 0:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})


def fetch_quiz_result(request,quiz_id,student_id):
    teacher_id = request.GET.get("teacher_id")
    teacher_authorized = False
    if teacher_id:
        try:
            teacher_id_int = int(teacher_id)
        except (TypeError, ValueError):
            return JsonResponse({"error": "Invalid teacher_id"}, status=400)

        if not _teacher_owns_quiz(teacher_id_int, quiz_id):
            return JsonResponse(
                {"error": "You are not allowed to view this quiz result."},
                status=403
            )
        teacher_authorized = True

    if not teacher_authorized and not _student_has_quiz_access(student_id, quiz_id):
        return JsonResponse(
            {"error": "You are not enrolled in the course for this quiz."},
            status=403
        )

    quiz = models.Quiz.objects.get(id=quiz_id)
    student = models.Student.objects.get(id=student_id)

    total_questions = models.QuizQuestions.objects.filter(quiz=quiz).count()
    attempts = models.AttemptQuiz.objects.filter(quiz=quiz, student=student)

    total_attempted = attempts.count()
    total_correct = attempts.filter(is_correct=True).count()
    total_wrong = total_attempted - total_correct
    total_unattempted = total_questions - total_attempted

    # Breakdown list
    details = []
    for a in attempts:
        details.append({
            "question": a.question.questions,
            "correct_answer": a.question.right_ans,
            "your_answer": a.selected_answer,
            "is_correct": a.is_correct
        })

    return JsonResponse({
        "total_questions": total_questions,
        "total_attempted_questions": total_attempted,
        "total_correct_questions": total_correct,
        "total_wrong_questions": total_wrong,
        "total_unattempted": total_unattempted,
        "details": details
    })


class StudyMaterialList(generics.ListCreateAPIView):
    serializer_class=StudyMaterialSerializer

    def get_queryset(self):
        course_id=self.kwargs['course_id']
        course=models.Course.objects.get(pk=course_id)
        return models.StudyMaterial.objects.filter(course=course)

class StudyMaterialView(generics.RetrieveUpdateDestroyAPIView):
    queryset=models.StudyMaterial.objects.all()
    serializer_class=StudyMaterialSerializer

def update_view(request,course_id):
    queryset=models.Course.objects.filter(pk=course_id).first()
    queryset.course_views+=1
    queryset.save()
    return JsonResponse({'views':queryset.course_views})

class FaqList(generics.ListAPIView):
    queryset=models.Faq.objects.all()
    serializer_class=FaqSerializer

class FlatPagesList(generics.ListAPIView):
    queryset=FlatPage.objects.all()
    serializer_class=FlatPageSerializer

class FlatPagesDetail(generics.ListAPIView):
    queryset=FlatPage.objects.all()
    serializer_class=FlatPageSerializer

# @csrf_exempt
# def ChatBot(request,teacher_id,student_id):
#     teacher=models.Teacher.objects.get(id=teacher_id)
#     student=models.Student.objects.get(id=student_id)
#     msg_to=request.POST.get('msg_to')
#     msg_from=request.POST.get('msg_from')
#     msgRes=models.TeacherStudentChat.objects.create(
#         teacher=teacher,
#         student=student,
#         msg_to=msg_to,
#         msg_from=msg_from
#     )

#     if msgRes:
#         return JsonResponse({'bool':True,'msg':'Message sended'})
#     else:
#         return JsonResponse({'bool':False,'msg':'Message failed'})
@csrf_exempt

def ChatBot(request, teacher_id, student_id):
    teacher = Teacher.objects.get(id=teacher_id)
    student = Student.objects.get(id=student_id)

    msg_to = request.POST.get('msg_to')
    msg_from = request.POST.get('msg_from')

    TeacherStudentChat.objects.create(
        teacher=teacher,
        student=student,
        msg_to=msg_to,
        msg_from=msg_from,
        is_group=False,
        msg_type="individual"
    )

    return JsonResponse({'bool': True, 'msg': 'Message sent'})




from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TeacherStudentChat, Teacher

# @csrf_exempt
# def unread_message_count(request, teacher_id):
#     try:
#         count = TeacherStudentChat.objects.filter(teacher_id=teacher_id, is_read=False).count()
#         return JsonResponse({'count': count})
#     except Teacher.DoesNotExist:
#         return JsonResponse({'count': 0})

@csrf_exempt
def unread_message_count(request, teacher_id):
    count = TeacherStudentChat.objects.filter(
        teacher_id=teacher_id,
        is_read=False,
        sender="student"
    ).count()
    return JsonResponse({'count': count})




# class MessageList(generics.ListAPIView):
#     queryset=models.TeacherStudentChat.objects.all()
#     serializer_class=TeacherStudentChatSerializer

#     def get_queryset(self):
#         teacher_id=self.kwargs['teacher_id']
#         student_id=self.kwargs['student_id']
#         teacher=models.Teacher.objects.get(pk=teacher_id)
#         student=models.Student.objects.get(pk=student_id)
#         return models.TeacherStudentChat.objects.filter(teacher=teacher,student=student).exclude(msg_to='')





class MessageList(generics.ListAPIView):
    serializer_class = TeacherStudentChatSerializer

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        student_id = self.kwargs['student_id']
        return TeacherStudentChat.objects.filter(
            teacher_id=teacher_id,
            student_id=student_id,
            is_group=False
        ).order_by('msg_time')

@csrf_exempt
def GroupChatBot(request, teacher_id):
    teacher = Teacher.objects.get(id=teacher_id)
    msg_to = request.POST.get('msg_to')
    msg_from = request.POST.get('msg_from')

    parent_msg = TeacherStudentChat.objects.create(
        teacher=teacher,
        msg_to=msg_to,
        msg_from=msg_from,
        is_group=True,
        msg_type="group",
        parent_group=None
    )

    return JsonResponse({'bool': True, 'msg': 'Group message sent', 'group_id': parent_msg.id})




    
class MyTeacherList(generics.ListAPIView):
    queryset=models.Course.objects.all()
    serializer_class=CourseSerializer

    def get_queryset(self):
        if 'student_id' in self.kwargs:
            student_id=self.kwargs['student_id']
            sql=f"SELECT * FROM main_course as c,main_studentcourseenrollment as e,main_teacher as t WHERE c.teacher_id=t.id AND e.course_id=c.id AND e.student_id={student_id} GROUP BY c.teacher_id"
            qs=models.Course.objects.raw(sql)
            print(qs)
            return qs
        




from rest_framework import generics
from . import models
from .serializers import CategorySerializer

class CategoryDetailView(generics.RetrieveAPIView):  # ✅ new
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer


# views.py
class EnrolledStudentsByCourse(generics.ListAPIView):
    serializer_class = StudentCourseEnrollSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        return models.StudentCourseEnrollment.objects.filter(course__id=course_id)




def StudentChatList(request, student_id):
    student = models.Student.objects.get(id=student_id)
    chats = models.TeacherStudentChat.objects.filter(student=student).order_by('-id')

    data = []

    for chat in chats:
        data.append({
            "id": chat.id,
            "msg_from": chat.msg_from,
            "msg_to": chat.msg_to,
            "teacher": chat.teacher.full_name,    # teacher full_name
            "student": chat.student.fullname,     # student fullname
            "time": chat.msg_time.strftime("%Y-%m-%d %H:%M")
        })

    return JsonResponse({"data": data})








from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TeacherStudentChat, Student


def _get_group_unread_details_for_student(student_id):
    enrolled_course_ids = StudentCourseEnrollment.objects.filter(
        student_id=student_id
    ).values_list("course_id", flat=True)

    details = []
    total_unread = 0

    for course_id in enrolled_course_ids:
        group = CourseChatGroup.objects.filter(course_id=course_id).select_related("course").first()
        if not group:
            continue

        state = GroupChatReadState.objects.filter(group=group, student_id=student_id).first()
        unread_qs = CourseGroupMessage.objects.filter(group=group).exclude(sender_type="student")
        if state:
            unread_qs = unread_qs.filter(timestamp__gt=state.last_seen_at)

        unread_count = unread_qs.count()
        total_unread += unread_count
        first_unread = unread_qs.order_by("timestamp").first()

        details.append({
            "course_id": group.course_id,
            "course_title": group.course.title,
            "unread_count": unread_count,
            "first_unread_message_id": getattr(first_unread, "id", None),
            "first_unread_at": first_unread.timestamp.strftime("%Y-%m-%d %H:%M") if first_unread else None,
        })

    return {"count": total_unread, "courses": details}


def _get_group_unread_details_for_teacher(teacher_id):
    groups = CourseChatGroup.objects.filter(teacher_id=teacher_id).select_related("course")

    details = []
    total_unread = 0

    for group in groups:
        state = GroupChatReadState.objects.filter(group=group, teacher_id=teacher_id).first()
        unread_qs = CourseGroupMessage.objects.filter(group=group).exclude(sender_type="teacher")
        if state:
            unread_qs = unread_qs.filter(timestamp__gt=state.last_seen_at)

        unread_count = unread_qs.count()
        total_unread += unread_count
        first_unread = unread_qs.order_by("timestamp").first()

        details.append({
            "course_id": group.course_id,
            "course_title": group.course.title,
            "unread_count": unread_count,
            "first_unread_message_id": getattr(first_unread, "id", None),
            "first_unread_at": first_unread.timestamp.strftime("%Y-%m-%d %H:%M") if first_unread else None,
        })

    return {"count": total_unread, "courses": details}
from .serializers import TeacherStudentChatSerializer, CourseGroupMessageSerializer


@csrf_exempt
def StudentGroupMessages(request, student_id):
    # Get all parent group messages (teacher message)
    parent_msgs = TeacherStudentChat.objects.filter(
        is_group=True,
        parent_group__isnull=True
    ).order_by('-msg_time')

    data = []

    for msg in parent_msgs:
        replies = TeacherStudentChat.objects.filter(
            parent_group=msg
        ).order_by('msg_time')

        reply_data = [
            {
                "id": r.id,
                "msg_from": r.msg_from,
                "student_name": r.student.fullname if r.student else None,
                "msg_to": r.msg_to,
                "msg_time": r.msg_time.strftime("%Y-%m-%d %H:%M")
            }
            for r in replies
        ]

        data.append({
            "id": msg.id,
            "msg_from": msg.msg_from,
            "teacher_name": msg.teacher.full_name,
            "msg_to": msg.msg_to,
            "msg_time": msg.msg_time.strftime("%Y-%m-%d %H:%M"),
            "replies": reply_data
        })

    return JsonResponse({"data": data})




@csrf_exempt
def student_all_messages(request, student_id):
    enrolled_teachers = StudentCourseEnrollment.objects.filter(student_id=student_id).values_list('course__teacher', flat=True).distinct()

    # Individual messages
    individual_msgs = TeacherStudentChat.objects.filter(
        student_id=student_id,
        is_group=False
    )

    # Group messages from enrolled teachers
    group_msgs = TeacherStudentChat.objects.filter(
        teacher_id__in=enrolled_teachers,
        is_group=True
    )

    # Merge and sort by time
    all_msgs = individual_msgs.union(group_msgs).order_by('msg_time')

    data = [
        {
            "id": msg.id,
            "msg_from": msg.msg_from,
            "msg_to": msg.msg_to,
            "msg_time": msg.msg_time.strftime("%Y-%m-%d %H:%M"),
            "is_group": msg.is_group,
            "teacher_id": msg.teacher.id
        }
        for msg in all_msgs
    ]

    return JsonResponse({"messages": data}, safe=False)



@csrf_exempt
def send_individual_message_reply(request, student_id, teacher_id):
    teacher = Teacher.objects.get(id=teacher_id)
    student = Student.objects.get(id=student_id)
    msg_to = request.POST.get("msg_to")

    TeacherStudentChat.objects.create(
        teacher=teacher,
        student=student,
        msg_to=msg_to,
        msg_from="student",
        is_group=False,
        msg_type="individual"
    )
    return JsonResponse({"success": True})






from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TeacherStudentChat, Student

@csrf_exempt
def unread_individual_count(request, student_id):
    count = TeacherStudentChat.objects.filter(
        student_id=student_id,
        sender="teacher",
        is_read=False
    ).count()
    return JsonResponse({"count": count})

@csrf_exempt
def unread_group_count(request, student_id):
    return JsonResponse(_get_group_unread_details_for_student(student_id))


@csrf_exempt
def teacher_group_unread_count(request, teacher_id):
    return JsonResponse(_get_group_unread_details_for_teacher(teacher_id))




@csrf_exempt
def TeacherGroupMessages(request, teacher_id):
    group_msgs = TeacherStudentChat.objects.filter(
        teacher_id=teacher_id,
        is_group=True,
        parent_group__isnull=True
    ).order_by('-msg_time')

    data = []

    for msg in group_msgs:
        replies = TeacherStudentChat.objects.filter(
            parent_group=msg
        ).order_by('msg_time')

        reply_data = [
            {
                "id": r.id,
                "student_name": r.student.fullname,
                "msg_to": r.msg_to,
                "msg_time": r.msg_time.strftime("%Y-%m-%d %H:%M")
            }
            for r in replies
        ]

        data.append({
            "id": msg.id,
            "msg_to": msg.msg_to,
            "msg_from": msg.msg_from,
            "msg_time": msg.msg_time.strftime("%Y-%m-%d %H:%M"),
            "replies": reply_data
        })

    return JsonResponse({"data": data})



@csrf_exempt
def send_group_reply(request, student_id, group_id):
    student = Student.objects.get(id=student_id)
    parent_msg = TeacherStudentChat.objects.get(id=group_id)

    msg_to = request.POST.get("msg_to")

    TeacherStudentChat.objects.create(
        teacher=parent_msg.teacher,
        student=student,
        msg_to=msg_to,
        msg_from="student",
        is_group=True,
        msg_type="group_reply",
        parent_group=parent_msg
    )

    return JsonResponse({"success": True, "msg": "Reply sent"})









# workshop

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.conf import settings
from io import BytesIO
from reportlab.pdfgen import canvas

from .models import Workshop, WorkshopRegistration
from .serializers import WorkshopRegistrationSerializer

# ------------------------------
# GET ALL ACTIVE WORKSHOPS
# ------------------------------
@api_view(['GET'])
def workshop_list(request):
    workshops = Workshop.objects.filter(is_active=True)
    serializer = WorkshopSerializer(workshops, many=True)
    return Response(serializer.data)


# ------------------------------
# REGISTER WORKSHOP WITH UNIQUE AMOUNT
# ------------------------------


from decimal import Decimal 


# @api_view(['POST'])
# def register_workshop(request):
#     workshop_id = request.data.get("workshop")

#     try:
#         workshop = Workshop.objects.get(id=workshop_id)
#     except Workshop.DoesNotExist:
#         return Response({"error": "Workshop not found"}, status=404)

#     # Seat limit check
#     registered_count = WorkshopRegistration.objects.filter(workshop=workshop).count()
#     if registered_count >= workshop.max_seats:
#         return Response({"error": "Seats are full"}, status=400)
#     serializer = WorkshopRegistrationSerializer(data=request.data)
#     if serializer.is_valid():
#     # Save base_amount only; payable_amount will be calculated
#         registration = serializer.save(base_amount=workshop.fee)

#     # Unique amount = last 2 digits of registration ID
#         unique_decimal = registration.id % 100
#         registration.payable_amount = workshop.fee + (Decimal(unique_decimal) / Decimal(100))
#         registration.save()

#         return Response({
#            "message": "Registration successful",
#            "registration_id": registration.id,
#            "payable_amount": registration.payable_amount
#         })

#     return Response(serializer.errors, status=400)

from decimal import Decimal
from .models import Institution, Workshop, WorkshopRegistration

@api_view(['POST'])
def register_workshop(request):
    workshop_id = request.data.get("workshop")
    institution_name = request.data.get("institution_name")
    institution_type = request.data.get("institution_type")

    try:
        workshop = Workshop.objects.get(id=workshop_id)
    except Workshop.DoesNotExist:
        return Response({"error": "Workshop not found"}, status=404)

    # Seat check
    if WorkshopRegistration.objects.filter(workshop=workshop).count() >= workshop.max_seats:
        return Response({"error": "Seats are full"}, status=400)

    institution = None

    # ✅ PROPER INSTITUTION HANDLING
    if institution_name and institution_type:
        # Remove extra spaces and normalize
        institution_name = " ".join(institution_name.split()).title()

        institution = Institution.objects.filter(
            name__iexact=institution_name,
            type=institution_type
        ).first()

        if not institution:
            institution = Institution.objects.create(
                name=institution_name,
                type=institution_type
            )

    serializer = WorkshopRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        registration = serializer.save(
            workshop=workshop,
            institution=institution,
            base_amount=workshop.fee
        )

        unique_decimal = registration.id % 100
        registration.payable_amount = workshop.fee + (Decimal(unique_decimal) / Decimal(100))
        registration.save()

        return Response({
            "message": "Registration successful",
            "registration_id": registration.id,
            "payable_amount": registration.payable_amount
        })

    return Response(serializer.errors, status=400)





# ------------------------------
# GET PAYMENT INFO (FOR FRONTEND POLLING)
# ------------------------------
@api_view(['GET'])
def payment_info(request, registration_id):
    try:
        registration = WorkshopRegistration.objects.get(id=registration_id)
    except WorkshopRegistration.DoesNotExist:
        return Response({"error": "Registration not found"}, status=404)

    return Response({
        "registration_id": registration.id,
        "payable_amount": registration.payable_amount,
        "status": registration.status
    })


# ------------------------------
# ADMIN MARK PAYMENT AS PAID
# ------------------------------
@api_view(['POST'])
def mark_paid(request, registration_id):
    try:
        registration = WorkshopRegistration.objects.get(id=registration_id)
    except WorkshopRegistration.DoesNotExist:
        return Response({"error": "Registration not found"}, status=404)

    registration.status = 'paid'
    registration.save()

    # Optional: send ticket email
    send_ticket_email(registration)

    return Response({"message": "Marked as PAID"})


# ------------------------------
# GENERATE PDF TICKET
# ------------------------------
def generate_ticket_pdf(registration):
    buffer = BytesIO()
    p = canvas.Canvas(buffer)

    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 800, "NeubAItics Workshop Ticket")

    p.setFont("Helvetica", 12)
    p.drawString(100, 760, f"Name: {registration.full_name}")
    p.drawString(100, 740, f"Workshop: {registration.workshop.title}")
    p.drawString(100, 720, f"Date: {registration.workshop.date}")
    p.drawString(100, 700, f"Status: {registration.status}")
    p.drawString(100, 680, f"Amount Paid: ₹{registration.payable_amount:.2f}")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer


# ------------------------------
# SEND PDF TICKET VIA EMAIL
# ------------------------------
def send_ticket_email(registration):
    pdf_buffer = generate_ticket_pdf(registration)

    email = EmailMessage(
        subject="Workshop Registration Confirmed",
        body=f"""
Hi {registration.full_name},

Your seat is confirmed for:
{registration.workshop.title}

Please find your ticket attached.

Regards,
NeubAItics Team
""",
        from_email=settings.EMAIL_HOST_USER,
        to=[registration.email]
    )

    email.attach(
        "Workshop_Ticket.pdf",
        pdf_buffer.read(),
        "application/pdf"
    )

    email.send(fail_silently=True)



# teacher chat
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StudentCourseEnrollment, TeacherStudentChat

@api_view(['GET'])
def teacher_chat_dashboard(request, teacher_id):
    """
    Return all unique students for a teacher along with unread counts and profile images.
    """
    individuals = []
    try:
        # Fetch enrollments for this teacher
        enrollments = StudentCourseEnrollment.objects.filter(
            course__teacher_id=teacher_id
        ).select_related('student')

        unique_students = {}
        for e in enrollments:
            if e.student:  # Skip if student is None
                unique_students[e.student.id] = e.student

        for sid, stu in unique_students.items():
            # Count unread messages from student to teacher
            unread = TeacherStudentChat.objects.filter(
                teacher_id=teacher_id,
                student_id=sid,
                sender='student',
                is_read=False
            ).count()

            individuals.append({
                "id": sid,
                "name": getattr(stu, 'fullname', getattr(stu, 'full_name', 'Unknown')),
                "unread": unread,
                "profile_img": getattr(stu.image, 'url', None),

                "type": "individual"
            })

        return Response({
            "individuals": individuals,
            "groups": _get_group_unread_details_for_teacher(teacher_id)["courses"]
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def payment_info(request, registration_id):
    reg = WorkshopRegistration.objects.get(id=registration_id)
    return Response({
        "payable_amount": reg.payable_amount,
        "status": reg.status
    })



@api_view(['GET'])
def student_chat_dashboard(request, student_id):
    """
    Return all teachers for a student along with unread counts, profile images, and groups.
    """
    teachers = {}
    group_map = {}

    try:
        enrollments = StudentCourseEnrollment.objects.filter(
            student_id=student_id
        ).select_related('course__teacher')

        for e in enrollments:
            course = e.course
            if not course or not course.teacher:
                continue  # skip if missing data

            t = course.teacher

            unread = TeacherStudentChat.objects.filter(
                teacher_id=t.id,
                student_id=student_id,
                sender='teacher',
                is_read=False
            ).count()

            teachers[t.id] = {
                "id": t.id,
                "name": getattr(t, 'full_name', getattr(t, 'fullname', 'Unknown')),
                "unread": unread,
                "profile_img": getattr(t.image, 'url', None),

                "type": "individual"
            }

            group_map[course.id] = {
                "id": course.id,
                "name": getattr(course, 'title', 'Untitled'),
                "type": "group"
            }

        group_unread = {
            item["course_id"]: item for item in _get_group_unread_details_for_student(student_id)["courses"]
        }

        groups = []
        for course_id, group in group_map.items():
            unread_info = group_unread.get(course_id, {})
            groups.append({
                **group,
                "unread": unread_info.get("unread_count", 0),
                "first_unread_message_id": unread_info.get("first_unread_message_id"),
                "first_unread_at": unread_info.get("first_unread_at"),
            })

        return Response({
            "individuals": list(teachers.values()),
            "groups": groups
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({"error": str(e)}, status=500)


@api_view(['GET'])
def fetch_individual_chat(request, teacher_id, student_id):

    chats = TeacherStudentChat.objects.filter(
        teacher_id=teacher_id,
        student_id=student_id
    )

    # 🔥 mark unread teacher messages as read
    viewer = str(request.GET.get("viewer", "")).strip().lower()
    if viewer == "teacher":
        chats.filter(sender='student', is_read=False).update(is_read=True)
    elif viewer == "student":
        chats.filter(sender='teacher', is_read=False).update(is_read=True)

    serializer = TeacherStudentChatSerializer(chats, many=True, context={"request": request})
    return Response(serializer.data)




@api_view(['POST'])
def send_individual_message(request):
    TeacherStudentChat.objects.create(
        teacher_id=request.data['teacher'],
        student_id=request.data['student'],
        message=request.data.get('message', ''),
        image=request.FILES.get('image', None),
        audio=request.FILES.get('audio', None),
        audio_transcript=request.data.get('audio_transcript', ''),
        sender=request.data['sender'],
        is_read=False
    )
    return Response({"status": "sent"})



@api_view(['GET'])
def fetch_group_chat(request, course_id):
    group, _ = CourseChatGroup.objects.get_or_create(
        course_id=course_id,
        defaults={"teacher_id": Course.objects.get(id=course_id).teacher_id},
    )
    viewer = str(request.GET.get("viewer", "")).strip().lower()
    teacher_id = request.GET.get("teacher_id")
    student_id = request.GET.get("student_id")

    last_seen_at = None
    unread_sender_type = None

    if viewer == "teacher" and teacher_id:
        unread_sender_type = "student"
        state = GroupChatReadState.objects.filter(group=group, teacher_id=teacher_id).first()
        last_seen_at = state.last_seen_at if state else None
    elif viewer == "student" and student_id:
        unread_sender_type = "teacher"
        state = GroupChatReadState.objects.filter(group=group, student_id=student_id).first()
        last_seen_at = state.last_seen_at if state else None

    msgs = CourseGroupMessage.objects.filter(group=group)

    serializer = CourseGroupMessageSerializer(msgs, many=True)
    payload = serializer.data
    first_unread_id = None

    if unread_sender_type:
        for item, msg in zip(payload, msgs):
            is_unread = msg.sender_type == unread_sender_type and (
                last_seen_at is None or msg.timestamp > last_seen_at
            )
            item["is_unread_for_viewer"] = is_unread
            if is_unread and first_unread_id is None:
                first_unread_id = msg.id

    if viewer == "teacher" and teacher_id:
        GroupChatReadState.objects.update_or_create(
            group=group,
            teacher_id=teacher_id,
            defaults={"last_seen_at": now()},
        )
    elif viewer == "student" and student_id:
        GroupChatReadState.objects.update_or_create(
            group=group,
            student_id=student_id,
            defaults={"last_seen_at": now()},
        )

    response = Response(payload)
    if first_unread_id is not None:
        response["X-First-Unread-Message-Id"] = str(first_unread_id)
    return response


@api_view(['POST'])
def send_group_message(request):
    course_id = request.data['course']
    course = Course.objects.get(id=course_id)
    group, _ = CourseChatGroup.objects.get_or_create(
        course_id=course_id,
        defaults={"teacher_id": course.teacher_id},
    )

    CourseGroupMessage.objects.create(
        group=group,
        sender_type=request.data['sender_type'],
        sender_student_id=request.data.get('student'),
        message=request.data.get('message', ''),
        message_type=request.data.get('message_type', 'message'),
        title=request.data.get('title', ''),
        meeting_link=request.data.get('meeting_link', '')
    )

    return Response({"status": "sent"})



@api_view(['DELETE'])
def delete_individual_message(request, msg_id):
    try:
        msg = TeacherStudentChat.objects.get(id=msg_id)
        msg.delete()
        return Response({"status": "deleted"})
    except TeacherStudentChat.DoesNotExist:
        return Response({"error": "Message not found"}, status=404)


from rest_framework.generics import ListAPIView
from .models import Blog
from .serializers import BlogSerializer

class BlogListAPIView(ListAPIView):
    queryset = Blog.objects.all().order_by('-created_at')
    serializer_class = BlogSerializer


# views.py
from rest_framework.generics import RetrieveAPIView
from .models import Blog
from .serializers import BlogSerializer

class BlogDetailAPIView(RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
   





from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import StudentCourseEnrollment, CourseQuiz, Quiz
from .serializers import QuizSerializer

def _get_student_approved_course_ids(student_id):
    return StudentCourseEnrollment.objects.filter(
        student_id=student_id,
        status="approved"
    ).values_list("course_id", flat=True)


def _student_has_quiz_access(student_id, quiz_id):
    if not student_id or not quiz_id:
        return False

    approved_course_ids = _get_student_approved_course_ids(student_id)
    return CourseQuiz.objects.filter(
        course_id__in=approved_course_ids,
        quiz_id=quiz_id
    ).exists()


def _teacher_owns_quiz(teacher_id, quiz_id):
    if not teacher_id or not quiz_id:
        return False
    return models.Quiz.objects.filter(id=quiz_id, teacher_id=teacher_id).exists()


def _split_tags(raw):
    if not raw:
        return []
    return [x.strip().lower() for x in str(raw).split(",") if x.strip()]


@api_view(['GET'])
def student_course_discovery(request, student_id):
    student = models.Student.objects.filter(id=student_id).first()
    if not student:
        return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

    enrolled_ids = list(
        models.StudentCourseEnrollment.objects.filter(
            student_id=student_id,
            status="approved"
        ).values_list("course_id", flat=True)
    )

    base_qs = models.Course.objects.exclude(id__in=enrolled_ids).select_related("teacher", "category")

    interest_tags = _split_tags(student.interseted_categories)
    enrolled_techs = []
    if enrolled_ids:
        for tech in models.Course.objects.filter(id__in=enrolled_ids).values_list("techs", flat=True):
            enrolled_techs.extend(_split_tags(tech))

    interest_q = Q()
    for tag in set(interest_tags):
        interest_q |= Q(techs__icontains=tag) | Q(category__title__icontains=tag)

    bridge_q = Q()
    for tag in set(enrolled_techs):
        bridge_q |= Q(techs__icontains=tag)

    interest_courses = base_qs.filter(interest_q).distinct().order_by("-id")[:8] if interest_tags else models.Course.objects.none()
    bridge_courses = base_qs.filter(bridge_q).distinct().order_by("-id")[:8] if enrolled_techs else models.Course.objects.none()
    popular_courses = (
        base_qs
        .annotate(approved_enroll_count=Count("enrolled_courses", filter=Q(enrolled_courses__status="approved")))
        .order_by("-approved_enroll_count", "-id")[:8]
    )
    new_courses = base_qs.order_by("-id")[:8]

    return Response(
        {
            "interest_matches": CourseSerializer(interest_courses, many=True, context={"request": request}).data,
            "bridge_courses": CourseSerializer(bridge_courses, many=True, context={"request": request}).data,
            "popular_courses": CourseSerializer(popular_courses, many=True, context={"request": request}).data,
            "new_courses": CourseSerializer(new_courses, many=True, context={"request": request}).data,
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
def student_assigned_quizzes(request, student_id):
    # ✅ get enrolled courses of student
    enrolled_course_ids = _get_student_approved_course_ids(student_id)

    # ✅ get quiz ids assigned to those courses
    quiz_ids = CourseQuiz.objects.filter(
        course_id__in=enrolled_course_ids
    ).values_list('quiz_id', flat=True)

    # ✅ final quizzes queryset
    quizzes = Quiz.objects.filter(id__in=quiz_ids).distinct().order_by('-add_time')

    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CourseQuiz

@api_view(['POST'])
def quiz_assign_course(request):
    teacher_id = request.data.get('teacher')
    course_id = request.data.get('course')
    quiz_id = request.data.get('quiz')

    # ✅ validation
    if not teacher_id or not course_id or not quiz_id:
        return Response(
            {"error": "teacher, course, quiz required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ prevent duplicate assign
    if CourseQuiz.objects.filter(teacher_id=teacher_id, course_id=course_id, quiz_id=quiz_id).exists():
        return Response(
            {"message": "Quiz already assigned!"},
            status=status.HTTP_200_OK
        )

    # ✅ create record in CourseQuiz
    CourseQuiz.objects.create(
        teacher_id=teacher_id,
        course_id=course_id,
        quiz_id=quiz_id
    )

    return Response(
        {"message": "Quiz assigned successfully!"},
        status=status.HTTP_201_CREATED
    )




from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CourseQuiz, Quiz
from .serializers import QuizSerializer

@api_view(['GET'])
def course_quizzes(request, course_id):
    student_id = request.query_params.get("student_id")
    if student_id:
        try:
            student_id_int = int(student_id)
        except (TypeError, ValueError):
            return Response({"error": "Invalid student_id"}, status=status.HTTP_400_BAD_REQUEST)

        enrolled = StudentCourseEnrollment.objects.filter(
            student_id=student_id_int,
            course_id=course_id,
            status="approved"
        ).exists()
        if not enrolled:
            return Response(
                {"error": "You are not enrolled in this course."},
                status=status.HTTP_403_FORBIDDEN
            )

    quiz_ids = CourseQuiz.objects.filter(course_id=course_id).values_list('quiz_id', flat=True)
    quizzes = Quiz.objects.filter(id__in=quiz_ids).distinct().order_by('-add_time')
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)



# for certification views


from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.utils.timezone import now

from .models import StudentChapterProgress, Student, Chapter

@api_view(["POST"])
def save_video_progress(request):
    student_id = request.data.get("student_id")
    chapter_id = request.data.get("chapter_id")
    watched_seconds = int(float(request.data.get("watched_seconds", 0)))
    duration_seconds = int(float(request.data.get("duration_seconds", 0)))

    if not student_id or not chapter_id:
        return Response({"status": "error", "message": "student_id and chapter_id required"}, status=400)

    student = Student.objects.get(id=student_id)
    chapter = Chapter.objects.get(id=chapter_id)

    obj, _ = StudentChapterProgress.objects.get_or_create(student=student, chapter=chapter)

    # ✅ Keep maximum watched seconds (avoid decreasing)
    obj.watched_seconds = max(obj.watched_seconds, watched_seconds)

    # ✅ 95% completion rule
    if duration_seconds > 0:
        percentage = (obj.watched_seconds / duration_seconds) * 100
        if percentage >= 95 and not obj.is_completed:
            obj.is_completed = True
            obj.completed_at = now()

    obj.save()

    return Response({
        "status": "success",
        "watched_seconds": obj.watched_seconds,
        "is_completed": obj.is_completed,
    })




from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import StudentChapterProgress, Chapter

@api_view(["GET"])
def fetch_chapter_progress(request, student_id, course_id):
    qs = StudentChapterProgress.objects.filter(
        student_id=student_id,
        chapter__course_id=course_id
    ).select_related("chapter")

    completed_ids = list(qs.filter(is_completed=True).values_list("chapter_id", flat=True))

    progress_map = {}
    for row in qs:
        progress_map[str(row.chapter_id)] = {
            "is_completed": row.is_completed,
            "watched_seconds": row.watched_seconds,
        }

    return Response({
        "completed_ids": completed_ids,
        "progress_map": progress_map
    })

@api_view(["GET"])
def generate_certificate(request, student_id, course_id):
    student = Student.objects.get(id=student_id)
    course = Course.objects.get(id=course_id)

    ok, cert, progress = generate_certificate_if_approved(student, course)

    if not ok:
        return Response({
            "eligible": False,
            "progress": progress
        })

    return Response({
        "eligible": True,
        "certificate_id": cert.certificate_id,
        "student_name": student.fullname,
        "course_title": course.title,
        "teacher_name": course.teacher.full_name if course.teacher else "",
        "issue_date": cert.issue_date.strftime("%d-%m-%Y")
    })

@api_view(["GET"])
def certificate_status(request, student_id, course_id):
    student = Student.objects.get(id=student_id)
    course = Course.objects.get(id=course_id)

    progress = calculate_course_progress(student, course)

    enroll = StudentCourseEnrollment.objects.filter(student=student, course=course).first()
    approved = enroll.certificate_approved if enroll else False

    cert = StudentCertificate.objects.filter(student=student, course=course).first()

    return Response({
        "progress": progress,
        "certificate_approved": approved,
        "certificate_exists": True if cert else False,
        "pdf_url": cert.pdf_file.url if cert and cert.pdf_file else None,

        # 🔥 THESE ARE REQUIRED FOR FRONTEND CERTIFICATE PAGE
        "student_name": student.fullname,
        "course_title": course.title,
        "teacher_name": course.teacher.full_name if course.teacher else "",
        "certificate_id": cert.certificate_id if cert else "",
        "issue_date": cert.issue_date.strftime("%d-%m-%Y") if cert else ""
    })



@api_view(["POST"])
def approve_certificate(request):
    student_id = request.data.get("student_id")
    course_id = request.data.get("course_id")

    if not student_id or not course_id:
        return Response({"status": False, "message": "student_id & course_id required"}, status=400)

    enroll = StudentCourseEnrollment.objects.filter(
        student_id=student_id, course_id=course_id
    ).first()

    if not enroll:
        return Response({"status": False, "message": "Enrollment not found"}, status=404)

    # ✅ eligibility check before approve
    student = Student.objects.get(id=student_id)
    course = Course.objects.get(id=course_id)

    progress = calculate_course_progress(student, course)
    if not progress["eligible"]:
        return Response({
            "status": False,
            "message": "Student not completed course yet",
            "progress": progress
        }, status=400)

    enroll.certificate_approved = True
    enroll.certificate_approved_at = now()
    enroll.save()

    return Response({
        "status": True,
        "message": "Approved successfully",
        "progress": progress
    })



@api_view(["GET"])
def teacher_student_course_progress(request, teacher_id):
    enrolls = StudentCourseEnrollment.objects.filter(
        course__teacher_id=teacher_id
    ).select_related("student", "course", "course__teacher")

    data = []
    for e in enrolls:
        prog = calculate_course_progress(e.student, e.course)

        data.append({
            "student": {"id": e.student.id, "fullname": e.student.fullname, "email": e.student.email},
            "course": {"id": e.course.id, "title": e.course.title},
            "progress": prog["overall"],
            "videos_done": prog["videos"]["ok"],
            "videos": {"done": prog["videos"]["done"], "total": prog["videos"]["total"]},
            "assignments_done": prog["assignments"]["ok"],
            "quiz_passed": prog["quiz"]["ok"],
            "eligible_for_certificate": prog["eligible"],
            "certificate_approved": e.certificate_approved
        })

    return Response(data)


def _build_mock_interview_context(student, course, progress):
    chapter_titles = list(
        models.Chapter.objects.filter(course=course).values_list("title", flat=True)[:8]
    )
    material_titles = list(
        models.StudyMaterial.objects.filter(course=course).values_list("title", flat=True)[:6]
    )
    quiz_titles = list(
        models.CourseQuiz.objects.filter(course=course)
        .select_related("quiz")
        .values_list("quiz__title", flat=True)[:4]
    )
    assignment_titles = list(
        models.StudentAssignment.objects.filter(student=student, course=course)
        .values_list("title", flat=True)[:6]
    )
    return [
        f"Student: {student.fullname}.",
        f"Course: {course.title}.",
        f"Course description: {course.description}.",
        f"Course technologies: {course.techs or 'N/A'}.",
        f"Progress overall: {progress.get('overall', 0)}%.",
        f"Video completion: {progress['videos']['done']}/{progress['videos']['total']}.",
        f"Assignments completion: {progress['assignments']['done']}/{progress['assignments']['total']}.",
        f"Quiz score: {progress['quiz']['score']}%.",
        f"Course chapters: {', '.join([x for x in chapter_titles if x]) or 'N/A'}.",
        f"Study materials: {', '.join([x for x in material_titles if x]) or 'N/A'}.",
        f"Assigned quizzes: {', '.join([x for x in quiz_titles if x]) or 'N/A'}.",
        f"Student assignments: {', '.join([x for x in assignment_titles if x]) or 'N/A'}.",
    ]


def _fallback_interview_questions(course, interview_type):
    title = course.title
    techs = course.techs or title
    question_bank = [
        {
            "round_type": "intro",
            "question_text": f"Introduce yourself and explain why you enrolled in {title}.",
            "ideal_points": "Name, background, current learning, relevant project, career goal.",
            "coding_prompt": "",
        },
        {
            "round_type": "technical",
            "question_text": f"Explain the most important concepts you learned in {title} and how you would apply them in a real project.",
            "ideal_points": f"Cover key concepts from {techs}, practical use case, and tradeoffs.",
            "coding_prompt": "",
        },
        {
            "round_type": "technical",
            "question_text": f"What project would you build using {techs}, and how would you structure it?",
            "ideal_points": "Architecture, modules, data flow, deployment, testing.",
            "coding_prompt": "",
        },
        {
            "round_type": "coding",
            "question_text": f"Solve a coding task related to {techs} and explain your logic step by step.",
            "ideal_points": "Clear approach, edge cases, complexity, clean explanation.",
            "coding_prompt": f"Write a short coding solution or pseudocode using {techs}.",
        },
        {
            "round_type": "hr",
            "question_text": "What are your strengths, what are you improving, and how do you handle mistakes during development?",
            "ideal_points": "Honest self-assessment, structured answer, growth mindset, ownership.",
            "coding_prompt": "",
        },
    ]
    if interview_type == models.MockInterview.INTRO:
        return question_bank[:2]
    if interview_type == models.MockInterview.TECHNICAL:
        return question_bank[1:4]
    if interview_type == models.MockInterview.CODING:
        return [question_bank[3]]
    if interview_type == models.MockInterview.HR:
        return [question_bank[0], question_bank[4]]
    return question_bank


def _get_interview_eligibility(student, course):
    enrollment = models.StudentCourseEnrollment.objects.filter(
        student=student, course=course, status="approved"
    ).first()
    progress = calculate_course_progress(student, course)
    unlocked = (
        enrollment is not None
        and progress["overall"] >= 50
        and (
            progress["quiz"]["score"] > 0
            or progress["assignments"]["done"] > 0
            or progress["videos"]["done"] > 0
        )
    )
    recommended = progress["eligible"] or progress["overall"] >= 70
    gaps = []
    if not enrollment:
        gaps.append("Course enrollment is not approved yet.")
    if progress["videos"]["total"] and not progress["videos"]["ok"]:
        gaps.append("Complete more chapter videos before final interview.")
    if progress["assignments"]["total"] and not progress["assignments"]["ok"]:
        gaps.append("Submit remaining assignments.")
    if not progress["quiz"]["ok"]:
        gaps.append("Improve quiz performance for stronger interview readiness.")
    return {
        "allowed": unlocked,
        "recommended": recommended,
        "progress": progress,
        "gaps": gaps,
    }


@api_view(["GET"])
def mock_interview_eligibility(request, student_id, course_id):
    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    if not student or not course:
        return Response({"error": "Student or course not found"}, status=404)

    result = _get_interview_eligibility(student, course)
    return Response(
        {
            "student_id": student.id,
            "course_id": course.id,
            "course_title": course.title,
            **result,
        }
    )


@api_view(["POST"])
def start_mock_interview(request):
    student_id = request.data.get("student_id")
    course_id = request.data.get("course_id")
    interview_type = str(request.data.get("interview_type", models.MockInterview.FULL)).strip().lower()

    student = models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    if not student or not course:
        return Response({"error": "Student or course not found"}, status=404)

    allowed_types = {
        models.MockInterview.INTRO,
        models.MockInterview.TECHNICAL,
        models.MockInterview.CODING,
        models.MockInterview.HR,
        models.MockInterview.FULL,
    }
    if interview_type not in allowed_types:
        interview_type = models.MockInterview.FULL

    eligibility = _get_interview_eligibility(student, course)
    if not eligibility["allowed"]:
        return Response(
            {
                "error": "Interview is locked for this student and course.",
                **eligibility,
            },
            status=403,
        )

    progress = eligibility["progress"]
    context_chunks = _build_mock_interview_context(student, course, progress)
    prompt = (
        f"Generate a {interview_type} mock interview for a student who studied {course.title}. "
        "Start with self introduction if relevant. Ask practical course-specific questions. "
        "Include coding only when the course clearly supports it. "
        "Keep questions job-oriented and based on the student's course journey."
    )
    generated = generate_mock_interview_questions(prompt, context_chunks)
    questions = generated.get("questions") if isinstance(generated, dict) else None
    if not questions:
        questions = _fallback_interview_questions(course, interview_type)

    interview = models.MockInterview.objects.create(
        student=student,
        course=course,
        interview_type=interview_type,
        status=models.MockInterview.IN_PROGRESS,
        total_questions=len(questions),
    )

    question_rows = []
    for index, item in enumerate(questions, start=1):
        round_type = str(item.get("round_type", "technical")).strip().lower()
        if round_type not in {"intro", "technical", "coding", "hr"}:
            round_type = "technical"
        question_rows.append(
            models.MockInterviewQuestion(
                interview=interview,
                round_type=round_type,
                question_text=item.get("question_text", ""),
                ideal_points=item.get("ideal_points", ""),
                coding_prompt=item.get("coding_prompt", ""),
                order=index,
            )
        )
    models.MockInterviewQuestion.objects.bulk_create(question_rows)
    interview.refresh_from_db()

    return Response(
        {
            "eligibility": eligibility,
            "interview": MockInterviewSerializer(interview, context={"request": request}).data,
        },
        status=201,
    )


@api_view(["POST"])
def submit_mock_interview_answer(request):
    interview_id = request.data.get("interview_id")
    question_id = request.data.get("question_id")
    answer_text = str(request.data.get("answer_text", "")).strip()

    if not interview_id or not question_id or not answer_text:
        return Response({"error": "interview_id, question_id and answer_text are required"}, status=400)

    interview = models.MockInterview.objects.filter(id=interview_id).select_related("student", "course").first()
    question = models.MockInterviewQuestion.objects.filter(id=question_id, interview_id=interview_id).first()
    if not interview or not question:
        return Response({"error": "Interview or question not found"}, status=404)

    progress = calculate_course_progress(interview.student, interview.course)
    context_chunks = _build_mock_interview_context(interview.student, interview.course, progress)
    evaluation_prompt = f"""
Interview type: {interview.interview_type}
Question round: {question.round_type}
Question: {question.question_text}
Ideal points: {question.ideal_points or 'N/A'}
Coding prompt: {question.coding_prompt or 'N/A'}
Student answer: {answer_text}

Evaluate this answer. If weak, explain exactly how the student should improve the answer structure, examples, confidence, and technical depth.
"""
    evaluation = evaluate_mock_interview_answer(evaluation_prompt, context_chunks)
    if "error" in evaluation:
        evaluation = {
            "score": 55,
            "communication_score": 55,
            "technical_score": 55,
            "confidence_score": 55,
            "feedback": "Your answer covers some points but needs more structure and clearer practical examples.",
            "improvement_tip": "Use a simple structure: concept, example, project usage, and result.",
            "suggested_followup": f"Practice another {question.round_type} question from {interview.course.title}.",
        }

    answer, _ = models.MockInterviewAnswer.objects.update_or_create(
        interview=interview,
        question=question,
        defaults={
            "answer_text": answer_text,
            "score": evaluation["score"],
            "communication_score": evaluation["communication_score"],
            "technical_score": evaluation["technical_score"],
            "confidence_score": evaluation["confidence_score"],
            "feedback": evaluation["feedback"],
            "improvement_tip": evaluation["improvement_tip"],
            "suggested_followup": evaluation["suggested_followup"],
        },
    )

    if not question.is_answered:
        question.is_answered = True
        question.save(update_fields=["is_answered"])

    interview.asked_questions = interview.answers.count()
    interview.save(update_fields=["asked_questions", "updated_at"])

    return Response(
        {
            "answer": MockInterviewAnswerSerializer(answer, context={"request": request}).data,
            "remaining_questions": max(interview.total_questions - interview.asked_questions, 0),
        }
    )


@api_view(["POST"])
def complete_mock_interview(request):
    interview_id = request.data.get("interview_id")
    interview = models.MockInterview.objects.filter(id=interview_id).first()
    if not interview:
        return Response({"error": "Interview not found"}, status=404)

    answers = interview.answers.select_related("question").all()
    if not answers.exists():
        return Response({"error": "No interview answers found"}, status=400)

    intro_scores = [a.score for a in answers if a.question.round_type == "intro"]
    technical_scores = [a.score for a in answers if a.question.round_type == "technical"]
    coding_scores = [a.score for a in answers if a.question.round_type == "coding"]
    communication_scores = [a.communication_score for a in answers]

    def _avg(values):
        return round(sum(values) / len(values)) if values else 0

    improvement_lines = [a.improvement_tip for a in answers if a.improvement_tip]
    feedback_lines = [a.feedback for a in answers if a.feedback]
    followup_lines = [a.suggested_followup for a in answers if a.suggested_followup]

    interview.score_intro = _avg(intro_scores)
    interview.score_technical = _avg(technical_scores)
    interview.score_coding = _avg(coding_scores)
    interview.score_communication = _avg(communication_scores)
    interview.overall_score = _avg([a.score for a in answers])
    interview.status = models.MockInterview.COMPLETED
    interview.completed_at = now()
    interview.strengths = " ".join(feedback_lines[:2]) or "The student showed usable understanding in parts of the interview."
    interview.weaknesses = " ".join(improvement_lines[:2]) or "The student needs more depth and structured responses."
    interview.improvement_plan = " ".join(improvement_lines[:4])
    interview.recommended_topics = " ".join(followup_lines[:4])
    interview.ai_summary = (
        f"Interview completed for {interview.course.title}. "
        f"Overall score {interview.overall_score}. "
        f"Communication {interview.score_communication}, technical {interview.score_technical}, coding {interview.score_coding}."
    )
    interview.asked_questions = answers.count()
    interview.save()

    return Response(MockInterviewSerializer(interview, context={"request": request}).data)


@api_view(["GET"])
def mock_interview_report(request, interview_id):
    interview = models.MockInterview.objects.filter(id=interview_id).first()
    if not interview:
        return Response({"error": "Interview not found"}, status=404)
    return Response(MockInterviewSerializer(interview, context={"request": request}).data)


@api_view(["GET"])
def student_mock_interviews(request, student_id):
    interviews = models.MockInterview.objects.filter(student_id=student_id).select_related("course", "student")
    serializer = MockInterviewSerializer(interviews, many=True, context={"request": request})
    return Response(serializer.data)





from rest_framework.views import APIView
from rest_framework.response import Response
from .models import StudentCourseEnrollment, Course
from .ai_service import get_ai_response, generate_tts_audio, translate_text


class AIChatView(APIView):

    def post(self, request):
        question = request.data.get("question")
        role = request.data.get("role")
        user_id = request.data.get("user_id")

        if not question or not role or not user_id:
            return Response({"error": "Missing fields"}, status=400)

        # 🔒 STUDENT RESTRICTION
        if role == "student":
            enrolled_courses = StudentCourseEnrollment.objects.filter(
                student_id=user_id
            ).values_list("course_id", flat=True)

            context_courses = Course.objects.filter(id__in=enrolled_courses)

        # 🔒 TEACHER RESTRICTION
        elif role == "teacher":
            context_courses = Course.objects.filter(teacher_id=user_id)

        else:
            return Response({"error": "Invalid role"}, status=403)

        # Build restricted context
        documents = []
        for c in context_courses:
            documents.append(f"{c.title} - {c.description}")

        answer = get_ai_response(question, documents)

        return Response({"answer": answer})


class AIChatAccessMixin:

    def _extract_bearer_token(self, request):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return None
        token = auth.split(" ", 1)[1].strip()
        return token or None

    def _is_valid_role_user(self, role, user_id):
        if role == "teacher":
            return models.Teacher.objects.filter(id=user_id, is_approved=True).exists()
        return models.Student.objects.filter(id=user_id, is_approved=True).exists()


class ProAIChatView(AIChatAccessMixin, APIView):

    def post(self, request):
        question = str(request.data.get("question", "")).strip()
        role = str(request.data.get("role", "")).strip().lower()
        user_id = request.data.get("user_id")
        history = request.data.get("history", [])
        current_path = str(request.data.get("current_path", "")).strip()
        current_page = str(request.data.get("current_page", "")).strip()
        capability_prompts = request.data.get("capability_prompts", [])
        role_scope = str(request.data.get("role_scope", "")).strip()
        preferred_language = str(request.data.get("preferred_language", "english")).strip()

        if not question or not role or not user_id:
            return Response({"error": "Missing fields"}, status=400)

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return Response({"error": "Invalid user id"}, status=400)

        token = self._extract_bearer_token(request)
        if not token:
            return Response({"error": "Missing auth token"}, status=401)

        token_data = parse_chat_token(token)
        if not token_data:
            return Response({"error": "Invalid or expired auth token"}, status=401)

        if token_data["role"] != role or token_data["user_id"] != user_id:
            return Response({"error": "Auth mismatch"}, status=403)

        if not self._is_valid_role_user(role, user_id):
            return Response({"error": "Unauthorized user"}, status=403)

        if role == "student":
            context_chunks = self._build_student_context(user_id)
        elif role == "teacher":
            context_chunks = self._build_teacher_context(user_id)
        else:
            return Response({"error": "Invalid role"}, status=403)

        answer = get_ai_response(
            question=question,
            context_chunks=context_chunks,
            role=role,
            history=history,
            user_id=user_id,
            current_path=current_path,
            current_page=current_page,
            capability_prompts=capability_prompts,
            role_scope=role_scope,
            preferred_language=preferred_language,
        )
        return Response({"answer": answer})


    def _build_student_context(self, student_id):
        student = models.Student.objects.filter(id=student_id).first()
        enrollments = models.StudentCourseEnrollment.objects.filter(
            student_id=student_id
        ).select_related("course", "course__teacher")

        chunks = [
            "Student assistant skill areas: dashboard summary, enrolled courses, study materials, chapters, assignments, quizzes, progress, certificates, favorites, and chat dashboard.",
            "Student page help: explain the current page, summarize counts, clarify course status, suggest next learning steps, and answer only from this student's records.",
        ]

        if not enrollments.exists():
            chunks.append("Student has no enrolled courses yet.")
            return chunks

        course_ids = [e.course_id for e in enrollments if e.course_id]
        approved_count = sum(1 for e in enrollments if e.status == "approved")
        pending_count = sum(1 for e in enrollments if e.status == "pending")
        rejected_count = sum(1 for e in enrollments if e.status == "rejected")

        total_submitted = models.StudentAssignment.objects.filter(
            student_id=student_id, student_status=True
        ).count()
        total_pending = models.StudentAssignment.objects.filter(
            student_id=student_id, student_status=False
        ).count()

        total_attempts = models.AttemptQuiz.objects.filter(student_id=student_id).count()
        total_correct = models.AttemptQuiz.objects.filter(
            student_id=student_id, is_correct=True
        ).count()
        assigned_quiz_ids = list(
            models.CourseQuiz.objects.filter(course_id__in=course_ids)
            .values_list("quiz_id", flat=True)
            .distinct()
        )
        assigned_quiz_count = len([q for q in assigned_quiz_ids if q])

        chunks.append(
            f"Student profile: id={student_id}, name={getattr(student, 'fullname', 'N/A')}."
        )
        chunks.append(
            f"Student summary: enrolled_courses={len(course_ids)}, approved={approved_count}, "
            f"pending={pending_count}, rejected={rejected_count}, assigned_quizzes={assigned_quiz_count}, "
            f"assignments_submitted={total_submitted}, assignments_pending={total_pending}, "
            f"quiz_attempts={total_attempts}, quiz_correct={total_correct}."
        )
        chunks.append(
            "Student permissions: answer only from this student's own approved or pending learning data. "
            "Do not expose any other student's private records."
        )

        approved_course_titles = [
            e.course.title
            for e in enrollments
            if e.course_id and e.course and e.status == "approved"
        ]
        if approved_course_titles:
            chunks.append(
                "Approved courses for personalized guidance: "
                + ", ".join(approved_course_titles[:20])
                + "."
            )
        else:
            chunks.append(
                "Student has no approved courses yet. Give only general study advice until enrollment approval."
            )

        for e in enrollments[:20]:
            c = e.course
            if not c:
                continue
            try:
                progress = calculate_course_progress(e.student, c)
                progress_percent = progress.get("overall", 0)
                eligible = progress.get("eligible", False)
            except Exception:
                progress_percent = 0
                eligible = False

            course_quiz_count = models.CourseQuiz.objects.filter(course_id=c.id).count()
            course_material_qs = models.StudyMaterial.objects.filter(course_id=c.id)
            course_material_count = course_material_qs.count()
            chapter_qs = models.Chapter.objects.filter(course_id=c.id)
            chapter_count = chapter_qs.count()
            sample_materials = list(
                course_material_qs.values_list("title", flat=True)[:5]
            )
            sample_chapters = list(chapter_qs.values_list("title", flat=True)[:6])
            material_details = list(
                course_material_qs.values_list("title", "description", "remarks")[:4]
            )
            chapter_details = list(
                chapter_qs.values_list("title", "description", "remarks")[:4]
            )
            assigned_quizzes = list(
                models.CourseQuiz.objects.filter(course_id=c.id)
                .select_related("quiz")
                .values_list("quiz__title", "quiz__detail")[:4]
            )
            course_assignments = list(
                models.StudentAssignment.objects.filter(student_id=student_id, course_id=c.id)
                .values_list("title", "detail", "student_status")[:4]
            )

            chunks.append(
                f"Course: {c.title}. Teacher: {getattr(c.teacher, 'full_name', 'N/A')}. "
                f"Enrollment_status={e.status}. Progress={progress_percent}%. "
                f"Eligible_for_certificate={eligible}. Quizzes={course_quiz_count}. "
                f"Study_materials={course_material_count}. Chapters={chapter_count}. "
                f"Topics: {c.techs or 'N/A'}. "
                f"Description: {c.description}."
            )
            if sample_chapters:
                chunks.append(
                    f"Course outline for {c.title}: {', '.join([x for x in sample_chapters if x][:6])}."
                )
            if sample_materials:
                chunks.append(
                    f"Study documents for {c.title}: {', '.join([x for x in sample_materials if x][:5])}."
                )
            for title, description, remarks in material_details:
                parts = [f"Study material in {c.title}: {title}."]
                if description:
                    parts.append(f"Description: {description}")
                if remarks:
                    parts.append(f"Remarks: {remarks}")
                chunks.append(" ".join(parts))
            for title, description, remarks in chapter_details:
                parts = [f"Chapter in {c.title}: {title}."]
                if description:
                    parts.append(f"Description: {description}")
                if remarks:
                    parts.append(f"Remarks: {remarks}")
                chunks.append(" ".join(parts))
            for quiz_title, quiz_detail in assigned_quizzes:
                if not quiz_title:
                    continue
                chunks.append(
                    f"Assigned quiz for {c.title}: {quiz_title}. Detail: {quiz_detail or 'No detail provided.'}"
                )
            for title, detail, student_status in course_assignments:
                chunks.append(
                    f"Assignment for {c.title}: {title}. Detail: {detail or 'No detail provided.'} "
                    f"Submission_status={'submitted' if student_status else 'pending'}."
                )

        return chunks

    def _build_teacher_context(self, teacher_id):
        teacher = models.Teacher.objects.filter(id=teacher_id).first()
        courses = models.Course.objects.filter(teacher_id=teacher_id)
        chunks = [
            "Teacher assistant skill areas: dashboard summary, courses, enrolled students, chapters, study materials, quizzes, assignments, and chat dashboard.",
            "Teacher page help: explain the current page, summarize totals, describe course assets, report scoped student progress, and answer only from this teacher's records.",
        ]
        if not courses.exists():
            chunks.append("Teacher has not created courses yet.")
            return chunks

        course_ids = list(courses.values_list("id", flat=True))

        enrolled_count = models.StudentCourseEnrollment.objects.filter(
            course_id__in=course_ids
        ).count()
        approved_enrolled_count = models.StudentCourseEnrollment.objects.filter(
            course_id__in=course_ids, status="approved"
        ).count()
        pending_enrolled_count = models.StudentCourseEnrollment.objects.filter(
            course_id__in=course_ids, status="pending"
        ).count()
        quiz_count = models.CourseQuiz.objects.filter(course_id__in=course_ids).count()
        teacher_created_quiz_count = models.Quiz.objects.filter(teacher_id=teacher_id).count()
        material_count = models.StudyMaterial.objects.filter(
            course_id__in=course_ids
        ).count()
        chapter_count = models.Chapter.objects.filter(course_id__in=course_ids).count()
        assignment_count = models.StudentAssignment.objects.filter(
            teacher_id=teacher_id
        ).count()
        assignment_submitted = models.StudentAssignment.objects.filter(
            teacher_id=teacher_id, student_status=True
        ).count()
        unique_students = models.StudentCourseEnrollment.objects.filter(
            course_id__in=course_ids
        ).values("student_id").distinct().count()

        chunks.append(
            f"Teacher profile: id={teacher_id}, name={getattr(teacher, 'full_name', 'N/A')}."
        )
        chunks.append(
            f"Teacher summary: total_courses={len(course_ids)}, unique_students={unique_students}, "
            f"total_enrollments={enrolled_count}, approved_enrollments={approved_enrolled_count}, "
            f"pending_enrollments={pending_enrolled_count}, assigned_quizzes={quiz_count}, "
            f"teacher_created_quizzes={teacher_created_quiz_count}, chapters={chapter_count}, "
            f"study_materials={material_count}, assignments={assignment_count}, "
            f"assignments_submitted={assignment_submitted}."
        )
        chunks.append(
            "Teacher permissions: answer only from this teacher's own classes, materials, quizzes, assignments, "
            "enrollments, and aggregated student progress. Do not expose unrelated private records."
        )

        for c in courses[:20]:
            c_enroll_total = models.StudentCourseEnrollment.objects.filter(course_id=c.id).count()
            c_enroll_approved = models.StudentCourseEnrollment.objects.filter(
                course_id=c.id, status="approved"
            ).count()
            c_quiz_count = models.CourseQuiz.objects.filter(course_id=c.id).count()
            c_material_count = models.StudyMaterial.objects.filter(course_id=c.id).count()
            c_chapter_count = models.Chapter.objects.filter(course_id=c.id).count()
            c_assignment_count = models.StudentAssignment.objects.filter(
                teacher_id=teacher_id, course_id=c.id
            ).count()
            material_details = list(
                models.StudyMaterial.objects.filter(course_id=c.id)
                .values_list("title", "description", "remarks")[:4]
            )
            chapter_details = list(
                models.Chapter.objects.filter(course_id=c.id)
                .values_list("title", "description", "remarks")[:4]
            )
            quiz_details = list(
                models.CourseQuiz.objects.filter(course_id=c.id)
                .select_related("quiz")
                .values_list("quiz__title", "quiz__detail")[:4]
            )
            assignment_details = list(
                models.StudentAssignment.objects.filter(teacher_id=teacher_id, course_id=c.id)
                .values_list("title", "detail", "student_status")[:4]
            )
            chunks.append(
                f"Course: {c.title}. Enrollments={c_enroll_total} (approved={c_enroll_approved}). "
                f"Chapters={c_chapter_count}. Quizzes={c_quiz_count}. Study_materials={c_material_count}. "
                f"Assignments={c_assignment_count}. Topics: {c.techs or 'N/A'}. "
                f"Description: {c.description}."
            )
            for title, description, remarks in material_details:
                parts = [f"Study material in {c.title}: {title}."]
                if description:
                    parts.append(f"Description: {description}")
                if remarks:
                    parts.append(f"Remarks: {remarks}")
                chunks.append(" ".join(parts))
            for title, description, remarks in chapter_details:
                parts = [f"Chapter in {c.title}: {title}."]
                if description:
                    parts.append(f"Description: {description}")
                if remarks:
                    parts.append(f"Remarks: {remarks}")
                chunks.append(" ".join(parts))
            for quiz_title, quiz_detail in quiz_details:
                if not quiz_title:
                    continue
                chunks.append(
                    f"Quiz in {c.title}: {quiz_title}. Detail: {quiz_detail or 'No detail provided.'}"
                )
            for title, detail, student_status in assignment_details:
                chunks.append(
                    f"Assignment in {c.title}: {title}. Detail: {detail or 'No detail provided.'} "
                    f"Submitted={'yes' if student_status else 'no'}."
                )

        return chunks


class AIVoiceView(AIChatAccessMixin, APIView):

    def post(self, request):
        text = str(request.data.get("text", "")).strip()
        role = str(request.data.get("role", "")).strip().lower()
        user_id = request.data.get("user_id")
        voice = str(request.data.get("voice", "alloy")).strip().lower()
        preferred_language = str(request.data.get("preferred_language", "english")).strip()

        if not text or not role or not user_id:
            return Response({"error": "Missing fields"}, status=400)

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return Response({"error": "Invalid user id"}, status=400)

        token = self._extract_bearer_token(request)
        if not token:
            return Response({"error": "Missing auth token"}, status=401)

        token_data = parse_chat_token(token)
        if not token_data:
            return Response({"error": "Invalid or expired auth token"}, status=401)

        if token_data["role"] != role or token_data["user_id"] != user_id:
            return Response({"error": "Auth mismatch"}, status=403)

        if not self._is_valid_role_user(role, user_id):
            return Response({"error": "Unauthorized user"}, status=403)

        translation_result = translate_text(text=text, target_language=preferred_language)
        if "error" in translation_result:
            return Response(translation_result, status=503)

        audio_result = generate_tts_audio(text=translation_result.get("text", text), voice=voice)
        if "error" in audio_result:
            return Response(audio_result, status=503)

        response = HttpResponse(
            audio_result["audio"],
            content_type=audio_result.get("content_type", "audio/mpeg"),
        )
        response["Content-Disposition"] = 'inline; filename="assistant-voice.mp3"'
        response["X-Assistant-Voice"] = audio_result.get("voice", voice)
        return response


class AITranslateView(AIChatAccessMixin, APIView):

    def post(self, request):
        text = str(request.data.get("text", "")).strip()
        role = str(request.data.get("role", "")).strip().lower()
        user_id = request.data.get("user_id")
        target_language = str(request.data.get("target_language", "english")).strip()

        if not text or not role or not user_id:
            return Response({"error": "Missing fields"}, status=400)

        try:
            user_id = int(user_id)
        except (TypeError, ValueError):
            return Response({"error": "Invalid user id"}, status=400)

        token = self._extract_bearer_token(request)
        if not token:
            return Response({"error": "Missing auth token"}, status=401)

        token_data = parse_chat_token(token)
        if not token_data:
            return Response({"error": "Invalid or expired auth token"}, status=401)

        if token_data["role"] != role or token_data["user_id"] != user_id:
            return Response({"error": "Auth mismatch"}, status=403)

        if not self._is_valid_role_user(role, user_id):
            return Response({"error": "Unauthorized user"}, status=403)

        result = translate_text(text=text, target_language=target_language)
        if "error" in result:
            return Response(result, status=503)

        return Response({"text": result.get("text", text)})

from .ai_service import generate_structured_quiz, generate_mock_interview_questions, evaluate_mock_interview_answer
import json
import re

@api_view(["POST"])
def generate_single_quiz_question(request):
    quiz_id = request.data.get("quiz_id")
    teacher_prompt = request.data.get("prompt", "")
    question_type = request.data.get("question_type", "mcq")

    quiz = models.Quiz.objects.filter(id=quiz_id).first()
    if not quiz:
        return Response({"error": "Quiz not found"}, status=404)

    # 🔹 Get existing questions
    existing_questions = list(
        models.QuizQuestions.objects
        .filter(quiz_id=quiz_id)
        .values_list("questions", flat=True)
    )

    existing_text = "\n".join(existing_questions) if existing_questions else "No existing questions yet."

    # 🔹 Build Prompt
    if question_type == "coding":

        final_instruction = f"""
Generate 1 CODING question STRICTLY based on the quiz topic.

Quiz Title: {quiz.title}
Quiz Detail: {quiz.detail}

Teacher Instruction: {teacher_prompt}

Already existing questions:
{existing_text}

IMPORTANT:
- Must be programming problem.
- Include problem description.
- Include sample input and output.
- Include constraints.
- Include starter code.
- Include correct solution.
- Do NOT repeat existing questions.
- You MUST return:
  questions
  coding_starter_code
  coding_solution

Return ONLY JSON:
{{
  "questions": "...problem statement...",
  "coding_starter_code": "...starter code...",
  "coding_solution": "...solution code..."
}}
"""

    else:

        final_instruction = f"""
Generate 1 multiple choice question STRICTLY based on the quiz topic.

Quiz Title: {quiz.title}
Quiz Detail: {quiz.detail}

Teacher Instruction: {teacher_prompt}

Already existing questions:
{existing_text}

IMPORTANT:
- Do NOT repeat or rephrase existing questions.
- Do NOT generate general knowledge questions.
- 4 options.
- One correct answer.
- right_ans must match exactly one option text.

Return ONLY JSON:
{{
  "questions": "...",
  "ans1": "...",
  "ans2": "...",
  "ans3": "...",
  "ans4": "...",
  "right_ans": "..."
}}
"""

    context_chunks = [
        f"Quiz Title: {quiz.title}",
        f"Quiz Detail: {quiz.detail}",
    ]

    try:
        ai_text = generate_structured_quiz(final_instruction, context_chunks)

        if isinstance(ai_text, dict) and "error" in ai_text:
            return Response(ai_text, status=500)

        json_match = re.search(r"\{.*\}", ai_text, re.DOTALL)
        if not json_match:
            return Response({"error": "Invalid AI format", "raw": ai_text}, status=500)

        parsed = json.loads(json_match.group())

        # 🔥 Normalize Coding Question
        if question_type == "coding":

            question_text = parsed.get("questions") or parsed.get("question") or ""

            starter_code = (
                parsed.get("coding_starter_code")
                or parsed.get("starter_code")
                or parsed.get("starterCode")
                or ""
            )

            solution_code = (
                parsed.get("coding_solution")
                or parsed.get("solution")
                or parsed.get("solution_code")
                or ""
            )

            parsed = {
                "questions": question_text.strip(),
                "coding_starter_code": starter_code.strip(),
                "coding_solution": solution_code.strip(),
            }

        # 🔥 Normalize MCQ
        else:
            parsed = {
                "questions": parsed.get("questions", "").strip(),
                "ans1": parsed.get("ans1", "").strip(),
                "ans2": parsed.get("ans2", "").strip(),
                "ans3": parsed.get("ans3", "").strip(),
                "ans4": parsed.get("ans4", "").strip(),
                "right_ans": parsed.get("right_ans", "").strip(),
            }

        # 🔥 Duplicate Protection
        generated_question = parsed["questions"].strip().lower()
        if generated_question in [q.lower() for q in existing_questions]:
            return Response({"error": "Duplicate question generated."}, status=400)

        return Response(parsed)

    except Exception as e:
        return Response({
            "error": "AI generation failed",
            "detail": str(e)
        }, status=500)
    




from rest_framework.decorators import api_view
from rest_framework.response import Response
from . import models

@api_view(["POST"])
def submit_coding(request):
    student_id = request.data.get("student")
    quiz_id = request.data.get("quiz")
    question_id = request.data.get("question")
    student_code = request.data.get("code", "")

    if not student_id or not quiz_id or not question_id:
        return Response({"error": "student, quiz and question are required"}, status=400)

    try:
        student_id = int(student_id)
        quiz_id = int(quiz_id)
        question_id = int(question_id)
    except (TypeError, ValueError):
        return Response({"error": "Invalid ids provided"}, status=400)

    if not _student_has_quiz_access(student_id, quiz_id):
        return Response({"error": "You are not enrolled in the course for this quiz."}, status=403)

    question = models.QuizQuestions.objects.filter(id=question_id, quiz_id=quiz_id).first()

    if not question:
        return Response({"error": "Question not found"}, status=404)

    if question.question_type != "coding":
        return Response({"error": "This is not a coding question"}, status=400)

    correct_solution = question.coding_solution or ""

    def normalize_code(code):
        if not code:
            return ""
        text = code.replace("\r\n", "\n").replace("\r", "\n")
        lines = [line.rstrip() for line in text.split("\n")]
        # Ignore fully empty lines to avoid false negatives from formatting only.
        lines = [line for line in lines if line.strip() != ""]
        return "\n".join(lines).strip()

    normalized_student = normalize_code(student_code)
    normalized_solution = normalize_code(correct_solution)

    is_correct = normalized_student == normalized_solution

    # Fallback for Python code: AST structural equality (ignores formatting differences).
    if not is_correct:
        try:
            import ast
            student_ast = ast.dump(ast.parse(normalized_student), include_attributes=False)
            solution_ast = ast.dump(ast.parse(normalized_solution), include_attributes=False)
            is_correct = student_ast == solution_ast
        except Exception:
            pass

    models.AttemptQuiz.objects.update_or_create(
        student_id=student_id,
        quiz_id=quiz_id,
        question_id=question_id,
        defaults={
            "selected_answer": student_code,
            "is_correct": is_correct,
        }
    )

    return Response({
        "correct": is_correct,
        "solution": correct_solution
    })


