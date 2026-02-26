from django.db import models
from django.core import serializers

# models.py
from django.db import models






class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    qualification = models.CharField(max_length=500, blank=True, null=True)
    mobile_no = models.CharField(max_length=20)
    skills = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='teacher_images/', blank=True, null=True)
    
    # NEW FIELD
    is_approved = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "Teachers"

    def __str__(self):
        return self.full_name



    

    class Meta:
        verbose_name_plural="1. Teacher"

    def skill_list(self):
        skill_list=self.skills.split(',')
        return skill_list

    def total_teacher_course(self):
        total_course=Course.objects.filter(teacher=self).count()
        return total_course

    def total_teacher_chapters(self):
        total_chapters=Chapter.objects.filter(course__teacher=self).count()
        return total_chapters

    def total_teacher_students(self):
        total_students=StudentCourseEnrollment.objects.filter(course__teacher=self).count()
        return total_students 
    




class CourseCategory(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField()

    class Meta:
        verbose_name_plural="2. Course Categories"

    def total_courses(self):
        return Course.objects.filter(category=self).count()

    def __str__(self) :
        return self.title
    





class Course(models.Model):
    category=models.ForeignKey(CourseCategory,on_delete=models.CASCADE, related_name='category_courses')
    teacher=models.ForeignKey(Teacher,on_delete=models.CASCADE, related_name='teacher_courses')
    title=models.CharField(max_length=150)
    description=models.TextField()
    featured_img=models.ImageField(upload_to='course_imgs/',null=True)
    techs=models.TextField(null=True)
    course_views=models.BigIntegerField(default=0)

    class Meta:
        verbose_name_plural="3. Courses"

    def related_videos(self):
        related_videos=Course.objects.filter(techs__icontains=self.techs).exclude(id=self.id)
        return serializers.serialize('json',related_videos)

    def teach_list(self):
        teach_list=self.techs.split(',')
        return teach_list

    def total_enrolled_students(self):
        total_enrolled_students=StudentCourseEnrollment.objects.filter(course=self).count()
        return total_enrolled_students

    def course_rating(self):
        course_rating=CourseRating.objects.filter(course=self).aggregate(avg_rating=models.Avg('rating'))
        return course_rating['avg_rating']
    
    def __str__(self) :
        return self.title
    



    

    
class Chapter(models.Model):
    course=models.ForeignKey(Course,null=True,on_delete=models.CASCADE,related_name='course_chapters')
    title=models.CharField(max_length=150,null=True)
    description=models.TextField()
    video = models.FileField(upload_to='chapter_videos/', null=True, max_length=200)

    remarks=models.TextField(null=True)

    class Meta:
        verbose_name_plural="4. Chapters"







from django.db import models
from django.contrib.auth.hashers import make_password

class Student(models.Model):
    fullname = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=255)
    interseted_categories = models.TextField()
    image = models.ImageField(upload_to='student_images/', null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


    def save(self, *args, **kwargs):
        # Hash password only if it's not already hashed
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.fullname



    def enrolled_courses(self):
        enrolled_courses=StudentCourseEnrollment.objects.filter(student=self).count()
        return enrolled_courses

    def favorite_courses(self):
        favorite_courses=StudentFavoriteCourse.objects.filter(student=self).count()
        return favorite_courses

    def complete_assignments(self):
        complete_assignments=StudentAssignment.objects.filter(student=self,student_status=True).count()
        return complete_assignments

    def pending_assignments(self):
        pending_assignments=StudentAssignment.objects.filter(student=self,student_status=False).count()
        return pending_assignments
    
    def message_count(self):
        return TeacherStudentChat.objects.filter(student=self).count()

    class Meta:
        verbose_name_plural="5. Students"




class StudentCourseEnrollment(models.Model):

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    course = models.ForeignKey(Course, null=True, on_delete=models.CASCADE, related_name='enrolled_courses')
    student = models.ForeignKey(Student, null=True, on_delete=models.CASCADE, related_name='enrolled_student')

    enrolled_time = models.DateTimeField(auto_now_add=True)

    # 🔥 Payment System
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_proof = models.ImageField(upload_to='payment_proofs/', null=True, blank=True)

    # Certificate
    certificate_approved = models.BooleanField(default=False)
    certificate_approved_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('course', 'student')


class CourseRating(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,null=True)
    student=models.ForeignKey(Student,on_delete=models.CASCADE,null=True)
    rating=models.PositiveBigIntegerField(default=0)
    reviews=models.TextField(null=True)
    review_time=models.DateTimeField(auto_now_add=True)

    class Meta:
         verbose_name_plural="7. Course Ratings"

    def __str__(self):
        return f"{self.course}-{self.student}-{self.rating}"

from django.db import models

class StudentFavoriteCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "8. Student Favorite Course"
        constraints = [
            models.UniqueConstraint(fields=["course", "student"], name="unique_favorite_course")
        ]


# class StudentAssignment(models.Model):
#     teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
#     student = models.ForeignKey(Student, on_delete=models.CASCADE)

#     title=models.CharField(max_length=150)
#     detail=models.TextField(null=True)    
#     student_status = models.BooleanField(default=False)

#     add_time=models.DateTimeField(auto_now_add=True)

#     class Meta:
#          verbose_name_plural="9. STudent Assignment"

#     def __str__(self):
#         return f"{self.title}" 



from django.db import models

class StudentAssignment(models.Model):
    teacher = models.ForeignKey('Teacher', on_delete=models.CASCADE)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)

    title = models.CharField(max_length=150)
    detail = models.TextField(null=True, blank=True)

    # Student submission fields
    answer_text = models.TextField(null=True, blank=True)
    upload_file = models.FileField(upload_to="assignment_files/", null=True, blank=True)
    upload_image = models.ImageField(upload_to="assignment_images/", null=True, blank=True)

    # status
    student_status = models.BooleanField(default=False)  # Pending/Submitted
    add_time = models.DateTimeField(auto_now_add=True)
    submitted_time = models.DateTimeField(null=True, blank=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)


    class Meta:
        verbose_name_plural = "Student Assignments"

    def __str__(self):
        return self.title

        
class Quiz(models.Model):   
    teacher=models.ForeignKey(Teacher,on_delete=models.CASCADE)
    title=models.CharField(max_length=200,null=True)
    detail=models.TextField()
    add_time=models.DateTimeField(auto_now_add=True)

    def assign_status(self):
        return CourseQuiz.objects.filter(quiz=self).count()

    class Meta:
         verbose_name_plural="11. Quizs"

class QuizQuestions(models.Model):
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE,null=True)
    questions=models.CharField(max_length=200)
    ans1=models.CharField(max_length=200)
    ans2=models.CharField(max_length=200)
    ans3=models.CharField(max_length=200)
    ans4=models.CharField(max_length=200)
    right_ans=models.CharField(max_length=200)
    add_time=models.DateTimeField(auto_now_add=True)

    class Meta:
         verbose_name_plural="12. Quiz Question&answer "

class CourseQuiz(models.Model):
    teacher=models.ForeignKey(Teacher,on_delete=models.CASCADE,null=True)
    course=models.ForeignKey(Course,on_delete=models.CASCADE,null=True)
    quiz=models.ForeignKey(Quiz,on_delete=models.CASCADE,null=True)
    add_time=models.DateTimeField(auto_now_add=True)

    class Meta:
         verbose_name_plural="13. Course Quiz "



class AttemptQuiz(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True)
    question = models.ForeignKey(QuizQuestions, on_delete=models.CASCADE, null=True)
    selected_answer = models.CharField(max_length=200, null=True)
    is_correct = models.BooleanField(default=False)
    add_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "14. Attempted Questions"
        unique_together = ('student', 'quiz', 'question')   # 👈 FIXED!!



class StudyMaterial(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE)
    title=models.CharField(max_length=150)
    description=models.TextField()
    upload=models.FileField(upload_to='study_materials/',null=True)
    remarks=models.TextField(null=True)

    class Meta:
         verbose_name_plural="15. Course Materials"

class Faq(models.Model):
    question=models.CharField(max_length=300)
    answer=models.TextField()

    class Meta:
         verbose_name_plural="16. FAQ "



class TeacherStudentChat(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True, blank=True)


    message = models.TextField()
    sender = models.CharField(
        max_length=10,
        choices=(('teacher', 'Teacher'), ('student', 'Student')),
        default="teacher" 
    )

    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    message = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='chat_images/', null=True, blank=True)


    class Meta:
      ordering = ['timestamp']
      indexes = [
        models.Index(fields=['teacher', 'student', 'sender', 'is_read']),
    ]
    verbose_name_plural = "Individual Chats"


    def __str__(self):
        return f"{self.teacher} ↔ {self.student}"



class CourseChatGroup(models.Model):
    course = models.OneToOneField(Course, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Course Chat Groups"

    def __str__(self):
        return self.course.title





class CourseGroupMessage(models.Model):
    group = models.ForeignKey(CourseChatGroup, on_delete=models.CASCADE)

    sender_type = models.CharField(
        max_length=10,
        choices=(('teacher', 'Teacher'), ('student', 'Student'))
    )

    sender_student = models.ForeignKey(
        Student, null=True, blank=True, on_delete=models.CASCADE
    )

    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
        verbose_name_plural = "Group Messages"





class Institution(models.Model):
    SCHOOL = "school"
    COLLEGE = "college"

    TYPE_CHOICES = [
        (SCHOOL, "School"),
        (COLLEGE, "College"),
    ]

    name = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                models.functions.Lower('name'),
                'type',
                name='unique_institution_name_type'
            )
        ]

    def __str__(self):
        return f"{self.name} ({self.type})"







from django.db import models


class Workshop(models.Model):
    WORKSHOP = 'workshop'
    BOOTCAMP = 'bootcamp'

    TYPE_CHOICES = [
        (WORKSHOP, 'Workshop'),
        (BOOTCAMP, 'Bootcamp'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    date = models.DateField()

    fee = models.DecimalField(max_digits=8, decimal_places=2)
    max_seats = models.PositiveIntegerField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WorkshopRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('approved', 'Approved'),
    ]

    workshop = models.ForeignKey(Workshop, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    institution = models.ForeignKey(
        "Institution",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students"
    )



    # 🔹 Unique Amount System
    base_amount = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    payable_amount = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)

   

    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='pending'
    )

    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.workshop.title}"




class Blog(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    video_upload = models.FileField(upload_to='blog_videos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

def __str__(self):
        return self.title



# for cetfication of student chapter progress tracking


from django.db import models
from django.utils.timezone import now

class StudentChapterProgress(models.Model):
    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name="chapter_progress")
    chapter = models.ForeignKey('Chapter', on_delete=models.CASCADE, related_name="student_progress")

    watched_seconds = models.PositiveIntegerField(default=0)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'chapter')
        verbose_name_plural = "Student Chapter Progress"

    def __str__(self):
        return f"{self.student.fullname} - {self.chapter.title}"





import uuid
from django.utils.timezone import now

class StudentCertificate(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="certificates")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="certificates")

    certificate_id = models.CharField(max_length=100, unique=True, blank=True)
    issue_date = models.DateTimeField(default=now)

    pdf_file = models.FileField(upload_to="certificates/", null=True, blank=True)

    status = models.CharField(max_length=20, default="issued")  # issued/revoked

    class Meta:
        unique_together = ("student", "course")
        verbose_name_plural = "Student Certificates"

    def save(self, *args, **kwargs):
        if not self.certificate_id:
            self.certificate_id = f"NB-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.fullname} - {self.course.title}"