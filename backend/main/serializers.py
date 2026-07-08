from rest_framework import serializers
from . import models
from django.contrib.flatpages.models import FlatPage
from django.contrib.auth.hashers import make_password
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.files.storage import default_storage

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Teacher


def build_media_url(request, field_file):
    if not field_file:
        return None

    file_name = getattr(field_file, "name", None)
    if not file_name or not default_storage.exists(file_name):
        return None

    file_url = field_file.url
    if request:
        return request.build_absolute_uri(file_url)
    return file_url

# ------------------ TEACHER SERIALIZER ------------------




class TeacherSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}

    def get_image_url(self, obj):
        request = self.context.get("request")
        return build_media_url(request, obj.image)

    def validate_email(self, value):
        email = str(value).strip().lower()
        try:
            validate_email(email)
        except DjangoValidationError:
            raise serializers.ValidationError("Please provide a valid email address.")
        return email

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['is_approved'] = False
        return Teacher.objects.create(**validated_data)




# ------------------ COURSE SERIALIZER ------------------
class CourseSerializer(serializers.ModelSerializer):
    featured_img_url = serializers.SerializerMethodField()
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Teacher.objects.all(), source='teacher', write_only=True
    )
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = [
            'id', 'category', 'teacher', 'teacher_id', 'title', 'description',
            'featured_img', 'featured_img_url', 'techs', 'course_chapters', 'related_videos',
            'teach_list', 'total_enrolled_students', 'course_rating'
        ]
        depth = 1

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2

    def get_featured_img_url(self, obj):
        request = self.context.get("request")
        return build_media_url(request, obj.featured_img)

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        featured_img_url = self.get_featured_img_url(instance)
        representation["featured_img"] = featured_img_url
        representation["featured_img_url"] = featured_img_url
        return representation


# ------------------ CATEGORY SERIALIZER ------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseCategory
        fields = ['id', 'title', 'description', 'total_courses']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2




from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    profile_img = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Student
        fields = "__all__"
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def get_profile_img(self, obj):
        request = self.context.get("request")
        return build_media_url(request, obj.image)

    def validate_email(self, value):
        email = str(value).strip().lower()
        try:
            validate_email(email)
        except DjangoValidationError:
            raise serializers.ValidationError("Please provide a valid email address.")
        return email

    def create(self, validated_data):
        # Normalize email
        validated_data['email'] = validated_data['email'].lower().strip()
        return super().create(validated_data)



# ------------------ STUDENT COURSE ENROLLMENT ------------------
class StudentCourseEnrollSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)
    student = StudentSerializer(read_only=True)
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Course.objects.all(),
        source='course',
        write_only=True
    )
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Student.objects.all(),
        source='student',
        write_only=True
    )

    class Meta:
        model = models.StudentCourseEnrollment
        fields = ['id', 'course', 'student', 'course_id', 'student_id', 'status', 'enrolled_time']

# ------------------ FAVORITE COURSES ------------------
class StudentFavoriteCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentFavoriteCourse
        fields = ['id', 'course', 'student', 'status']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2


# ------------------ COURSE RATING ------------------
class CourseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseRating
        fields = ['id', 'course', 'student', 'rating', 'reviews', 'review_time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2 

    def to_representation(self, instance):
        """Ensures nested student serializer receives request context"""
        representation = super().to_representation(instance)

        request = self.context.get("request")

        # FIX student nested image URL
        if "student" in representation:
            if instance.student:
                representation["student"] = StudentSerializer(
                    instance.student,
                    context={"request": request}  # <-- 🔥 This is the missing part
                ).data

        return representation



# ------------------ TEACHER DASHBOARD ------------------
class TeacherDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = ['total_teacher_course', 'total_teacher_chapters', 'total_teacher_students']


# ------------------ STUDENT ASSIGNMENT ------------------
# class StudentAssignmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.StudentAssignment
#         fields = ['id', 'teacher', 'student', 'title', 'detail', 'student_status', 'add_time']
#         read_only_fields = ['teacher', 'student', 'add_time']
#         depth = 2



#     def __init__(self, *args, **kwargs):
#         super().__init__(*args, **kwargs)
#         method = getattr(self.context.get('request', None), 'method', None)
#         self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2



from rest_framework import serializers
from . import models

class StudentAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentAssignment
        fields = [
            'id', 'teacher', 'student',
            'course',
            'title', 'detail',
            'answer_text', 'upload_file', 'upload_image',
            'student_status', 'add_time', 'submitted_time'
        ]
        read_only_fields = ['teacher', 'student', 'add_time', 'submitted_time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)

        # ✅ show nested teacher/student in GET only
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2


# ------------------ STUDENT DASHBOARD ------------------
class StudentDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = ['enrolled_courses', 'favorite_courses', 'complete_assignments', 'pending_assignments', 'message_count']


# ------------------ QUIZ & QUESTIONS ------------------
# class QuizSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.Quiz
#         fields = ['id', 'teacher', 'title', 'detail', 'assign_status', 'add_time']

from rest_framework import serializers
from . import models

class QuizSerializer(serializers.ModelSerializer):
    assign_status = serializers.SerializerMethodField()
    teacher_name = serializers.CharField(source="teacher.full_name", read_only=True)

    class Meta:
        model = models.Quiz
        fields = ['id', 'teacher', 'teacher_name', 'title', 'detail', 'assign_status', 'add_time']

    def get_assign_status(self, obj):
        return obj.assign_status()



class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.QuizQuestions
        fields = '__all__'


# ------------------ COURSE QUIZ ------------------
class CourseQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CourseQuiz
        fields = ['id', 'teacher', 'course', 'quiz', 'add_time']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 2 if method == 'GET' else 0


# ------------------ ATTEMPTED QUIZZES ------------------
from rest_framework import serializers
from . import models

class AttempQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.AttemptQuiz
        fields = [
            'id',
            'student',
            'quiz',
            'question',
            'selected_answer',   # ✅ FIXED
            'is_correct',        # ✅ INCLUDED
            'add_time'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 2 if request and request.method == 'GET' else 0

# ------------------ STUDY MATERIAL ------------------
class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudyMaterial
        fields = ['id', 'course', 'title', 'description', 'upload', 'remarks']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2


# ------------------ FAQ ------------------
class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Faq
        fields = ['question', 'answer']


# ------------------ FLAT PAGE ------------------
class FlatPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatPage
        fields = ['id', 'title', 'content', 'url']



from rest_framework import serializers
from .models import TeacherStudentChat, CourseGroupMessage

class TeacherStudentChatSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.fullname', read_only=True)
    teacher_name = serializers.CharField(source='teacher.full_name', read_only=True)
    student_code = serializers.CharField(source='student.student_code', read_only=True)
    teacher_code = serializers.CharField(source='teacher.teacher_code', read_only=True)
    image_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()

    class Meta:
        model = TeacherStudentChat
        fields = '__all__'

    def get_image_url(self, obj):
        request = self.context.get("request")
        return build_media_url(request, obj.image)

    def get_audio_url(self, obj):
        request = self.context.get("request")
        if obj.audio and request:
            return request.build_absolute_uri(obj.audio.url)
        if obj.audio:
            return obj.audio.url
        return None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['timestamp'] = instance.timestamp.strftime("%Y-%m-%d %H:%M")
        return data


class CourseGroupMessageSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='sender_student.fullname', read_only=True
    )
    course_id = serializers.IntegerField(source="group.course_id", read_only=True)
    course_title = serializers.CharField(source="group.course.title", read_only=True)

    class Meta:
        model = CourseGroupMessage
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['timestamp'] = instance.timestamp.strftime("%Y-%m-%d %H:%M")
        return data


# ------------------ CHAPTER ------------------
class ChapterSerializer(serializers.ModelSerializer):
    video_stream_url = serializers.SerializerMethodField()

    class Meta:
        model = models.Chapter
        fields = '__all__'

    def get_video_stream_url(self, obj):
            request = self.context.get('request')
            if obj.video_url:
                return obj.video_url
            if obj.video:
                if request:
                    return request.build_absolute_uri(obj.video.url)
                return obj.video.url
            return None

    def validate(self, attrs):
            if self.instance:
                final_video = attrs.get('video', self.instance.video)
                final_video_url = attrs.get('video_url', self.instance.video_url)
            else:
                final_video = attrs.get('video')
                final_video_url = attrs.get('video_url')

            if not final_video and not final_video_url:
                raise serializers.ValidationError("Provide either an uploaded video or an external video URL.")

            return attrs

    def update(self, instance, validated_data):
            new_video = validated_data.get('video')
            new_video_url = validated_data.get('video_url')

            if new_video is not None:
                validated_data['video_url'] = None

            if new_video_url:
                validated_data['video'] = None

            return super().update(instance, validated_data)

    def __init__(self, *args, **kwargs):
            super(ChapterSerializer, self).__init__(*args, **kwargs)
            request = self.context.get('request')
            if request and request.method in ['POST', 'PUT', 'PATCH']:
                print('Method is POST')
                self.Meta.depth = 0
                print(self.Meta.depth)
            else:
                print(f"Method is - {request.method}")
                self.Meta.depth = 2



from rest_framework import serializers
from . import models
class EnrolledCourseStudentSerializer(serializers.ModelSerializer):
    student = serializers.SerializerMethodField()
    course = serializers.SerializerMethodField()

    class Meta:
        model = models.StudentCourseEnrollment
        fields = ['id', 'student', 'course', 'enrolled_time']

    def get_student(self, obj):
        request = self.context.get('request')
        profile_img = build_media_url(request, getattr(obj.student, "image", None))

        return {
            "id": obj.student.id,
            "student_code": obj.student.student_code,
            "fullname": obj.student.fullname,
            "username": obj.student.username,
            "email": obj.student.email,
            "profile_img": profile_img,  # this must be URL
        }

    def get_course(self, obj):
        return {
            "id": obj.course.id,
            "title": obj.course.title,
        }



# workshop



from rest_framework import serializers
from .models import Workshop, WorkshopRegistration


class WorkshopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workshop
        fields = '__all__'


from rest_framework import serializers
from .models import WorkshopRegistration
class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopRegistration
        fields = [
            'id', 'workshop', 'full_name', 'email', 'phone',
            'institution',
            'base_amount', 'payable_amount', 'status', 'registered_at'
        ]
        read_only_fields = ('id', 'base_amount', 'payable_amount', 'status', 'registered_at')



from rest_framework import serializers
from .models import Blog

class BlogSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id',
            'title',
            'description',
            'video_url',
            'created_at'
        ]

    def get_video_url(self, obj):
        request = self.context.get('request')
        if obj.video_upload:
            return request.build_absolute_uri(obj.video_upload.url)
        return None


class MockInterviewQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MockInterviewQuestion
        fields = [
            'id',
            'round_type',
            'question_text',
            'ideal_points',
            'coding_prompt',
            'question_signature',
            'order',
            'is_answered',
        ]


class MockInterviewAnswerSerializer(serializers.ModelSerializer):
    question = MockInterviewQuestionSerializer(read_only=True)

    class Meta:
        model = models.MockInterviewAnswer
        fields = [
            'id',
            'question',
            'answer_text',
            'answer_summary',
            'score',
            'communication_score',
            'technical_score',
            'confidence_score',
            'feedback',
            'improvement_tip',
            'missing_points',
            'sample_answer',
            'suggested_followup',
            'created_at',
            'updated_at',
        ]


class MockInterviewSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.fullname', read_only=True)
    course_title = serializers.CharField(source='course.title', read_only=True)
    questions = MockInterviewQuestionSerializer(many=True, read_only=True)
    answers = MockInterviewAnswerSerializer(many=True, read_only=True)

    class Meta:
        model = models.MockInterview
        fields = [
            'id',
            'student',
            'student_name',
            'course',
            'course_title',
            'interview_type',
            'difficulty_level',
            'status',
            'total_questions',
            'asked_questions',
            'overall_score',
            'score_intro',
            'score_technical',
            'score_coding',
            'score_communication',
            'strengths',
            'weaknesses',
            'improvement_plan',
            'recommended_topics',
            'ai_summary',
            'started_at',
            'completed_at',
            'updated_at',
            'questions',
            'answers',
        ]
