from django.contrib import admin
from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import format_html
from .models import (
    Teacher, CourseCategory, Course, Chapter, Student,
    StudentCourseEnrollment, CourseRating, StudentFavoriteCourse,
    StudentAssignment, Quiz, CourseQuiz, QuizQuestions,
    AttemptQuiz, StudyMaterial, Faq, TeacherStudentChat
)


def _send_approval_email(*, email, full_name, role_label, login_path):
    if not email:
        return

    base_url = getattr(settings, "FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")
    login_url = f"{base_url}{login_path}"
    send_mail(
        f"{role_label} account approved",
        (
            f"Hi {full_name},\n\n"
            f"Your {role_label.lower()} account has been approved by admin.\n"
            f"You can now login here:\n{login_url}\n\n"
            "Regards,\nNeubAItics Team"
        ),
        getattr(settings, "DEFAULT_FROM_EMAIL", "no-reply@neubaitics.local"),
        [email],
        fail_silently=True,
    )


class ApprovalEmailAdminMixin:
    approval_field = "is_approved"
    email_field = "email"
    name_field = ""
    role_label = "User"
    login_path = "/"

    def _approval_changed_to_true(self, obj):
        if not obj.pk:
            return bool(getattr(obj, self.approval_field, False))
        previous_value = obj.__class__.objects.filter(pk=obj.pk).values_list(self.approval_field, flat=True).first()
        return previous_value is False and bool(getattr(obj, self.approval_field, False))

    def _send_object_approval_email(self, obj):
        _send_approval_email(
            email=getattr(obj, self.email_field, ""),
            full_name=getattr(obj, self.name_field, "User"),
            role_label=self.role_label,
            login_path=self.login_path,
        )

    def save_model(self, request, obj, form, change):
        should_send_email = self._approval_changed_to_true(obj)
        super().save_model(request, obj, form, change)
        if should_send_email:
            self._send_object_approval_email(obj)

    @admin.action(description="Approve selected accounts and send login email")
    def approve_selected_accounts(self, request, queryset):
        pending_ids = list(queryset.filter(**{self.approval_field: False}).values_list("id", flat=True))
        updated = queryset.filter(id__in=pending_ids).update(**{self.approval_field: True})
        for obj in queryset.model.objects.filter(id__in=pending_ids):
            self._send_object_approval_email(obj)
        self.message_user(request, f"{updated} account(s) approved and emailed.")

# --------------------------
# Custom Admin Panels
# --------------------------
class TeacherAdmin(ApprovalEmailAdminMixin, admin.ModelAdmin):
    list_display = ("id", "full_name", "email", "is_approved", "login_link")
    list_filter = ("is_approved",)
    search_fields = ("full_name", "email")
    list_editable = ("is_approved",)
    actions = ("approve_selected_accounts",)
    name_field = "full_name"
    role_label = "Teacher"
    login_path = "/teacher-login"

    def login_link(self, obj):
        base_url = getattr(settings, "FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")
        return format_html('<a href="{}{}" target="_blank">Login Page</a>', base_url, self.login_path)
    login_link.short_description = "Login"


class StudentAdmin(ApprovalEmailAdminMixin, admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "is_approved", "login_link")
    list_filter = ("is_approved",)
    search_fields = ("fullname", "email")
    list_editable = ("is_approved",)
    actions = ("approve_selected_accounts",)
    name_field = "fullname"
    role_label = "Student"
    login_path = "/user-login"

    def login_link(self, obj):
        base_url = getattr(settings, "FRONTEND_BASE_URL", "http://localhost:3000").rstrip("/")
        return format_html('<a href="{}{}" target="_blank">Login Page</a>', base_url, self.login_path)
    login_link.short_description = "Login"


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


@admin.register(Faq)
class FaqAdmin(admin.ModelAdmin):
    list_display = ("question", "short_answer")
    search_fields = ("question", "answer")

    def short_answer(self, obj):
        answer = obj.answer or ""
        return answer if len(answer) <= 90 else f"{answer[:87]}..."
    short_answer.short_description = "Answer"


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
