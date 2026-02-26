from rest_framework import serializers
from . import models
from django.contrib.flatpages.models import FlatPage
from django.contrib.auth.hashers import make_password

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import Teacher

# ------------------ TEACHER SERIALIZER ------------------




class TeacherSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = "__all__"
        extra_kwargs = {'password': {'write_only': True}}

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        validated_data['is_approved'] = False
        return Teacher.objects.create(**validated_data)




# ------------------ COURSE SERIALIZER ------------------
class CourseSerializer(serializers.ModelSerializer):
    teacher_id = serializers.PrimaryKeyRelatedField(
        queryset=models.Teacher.objects.all(), source='teacher', write_only=True
    )
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = [
            'id', 'category', 'teacher', 'teacher_id', 'title', 'description',
            'featured_img', 'techs', 'course_chapters', 'related_videos',
            'teach_list', 'total_enrolled_students', 'course_rating'
        ]
        depth = 1

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        method = getattr(self.context.get('request', None), 'method', None)
        self.Meta.depth = 0 if method in ['POST', 'PUT', 'PATCH'] else 2


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
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

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
        fields = ['id', 'course', 'student', 'course_id', 'student_id']

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

    class Meta:
        model = TeacherStudentChat
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['timestamp'] = instance.timestamp.strftime("%Y-%m-%d %H:%M")
        return data


class CourseGroupMessageSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(
        source='sender_student.fullname', read_only=True
    )

    class Meta:
        model = CourseGroupMessage
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['timestamp'] = instance.timestamp.strftime("%Y-%m-%d %H:%M")
        return data


# ------------------ CHAPTER ------------------
class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Chapter
        fields = '__all__'
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
        profile_img = None
        if obj.student.image:
            if request:
                profile_img = request.build_absolute_uri(obj.student.image.url)
            else:
                profile_img = obj.student.image.url

        return {
            "id": obj.student.id,
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