from django.contrib import admin
from .models import (
    Teacher, CourseCategory, Course, Chapter, Student,
    StudentCourseEnrollment, CourseRating, StudentFavoriteCourse,
    StudentAssignment, Quiz, CourseQuiz, QuizQuestions,
    AttemptQuiz, StudyMaterial, Faq, TeacherStudentChat
)

# --------------------------
# Custom Admin Panels
# --------------------------
class TeacherAdmin(admin.ModelAdmin):
    list_display = ("id", "full_name", "email", "is_approved")
    list_filter = ("is_approved",)
    search_fields = ("full_name", "email")


class StudentAdmin(admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "is_approved")
    list_filter = ("is_approved",)
    search_fields = ("fullname", "email")


# --------------------------
# Register Models
# --------------------------

admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Student, StudentAdmin)

admin.site.register(CourseCategory)
admin.site.register(Course)
admin.site.register(Chapter)

admin.site.register(StudentCourseEnrollment)
admin.site.register(CourseRating)
admin.site.register(StudentFavoriteCourse)

admin.site.register(StudentAssignment)
admin.site.register(Quiz)
admin.site.register(CourseQuiz)
admin.site.register(QuizQuestions)
admin.site.register(AttemptQuiz)

admin.site.register(StudyMaterial)
admin.site.register(Faq)
admin.site.register(TeacherStudentChat)




from django.contrib import admin
from .models import Blog


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'description','video_upload' ,'created_at')



from django.contrib import admin
from .models import Workshop, WorkshopRegistration

@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'date', 'fee', 'max_seats', 'is_active')
    list_filter = ('type', 'is_active')
    search_fields = ('title',)
    ordering = ('-created_at',)
    date_hierarchy = 'date'
    readonly_fields = ('created_at',)

# @admin.register(WorkshopRegistration)
# class WorkshopRegistrationAdmin(admin.ModelAdmin):
#     list_display = (
#         'id',
#         'full_name',
#         'email',
#         'workshop',
#         'payable_amount',
#         'status',
#         'registered_at'
#     )

#     list_filter = ('status', 'workshop')
#     search_fields = ('full_name', 'email')
#     readonly_fields = ('registered_at',)

@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'institution',
        'workshop',
        'status'
    )

    list_filter = ('institution', 'workshop', 'status')
    search_fields = ('full_name', 'institution__name')
    readonly_fields = ('registered_at',)

from django.contrib import admin
from .models import Institution, WorkshopRegistration


class StudentInline(admin.TabularInline):
    model = WorkshopRegistration
    extra = 0
    fields = ('full_name', 'email', 'phone', 'workshop', 'status')
    readonly_fields = ('full_name', 'email', 'phone', 'workshop', 'status')


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'student_count')
    inlines = [StudentInline]

    def student_count(self, obj):
        return obj.students.count()