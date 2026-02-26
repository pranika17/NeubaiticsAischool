


# from django.urls import path
# from . import views
# from .views import (
#     workshop_list,
#     register_workshop,
#     payment_info,
#     mark_paid
# )

# urlpatterns =[



       
#      path('blog-list/', views.BlogListAPIView.as_view()),
#      # urls.py
#      path('blog-detail/<int:pk>/', views.BlogDetailAPIView.as_view()),

#       path('student-assigned-quizzes/<int:student_id>/', views.student_assigned_quizzes),

#       path("quiz-assign-course/", views.quiz_assign_course),

#       path("course-quizzes/<int:course_id>/", views.course_quizzes),

#       path(
#   "teacher-course-quizzes/<int:teacher_id>/<int:course_id>/",
#   views.TeacherCourseQuizList.as_view()
# ),



#     # list favorites for a student
#     path("fetch-favorite-coourses/<int:student_id>", views.StudentFavoriteCourseList.as_view()),

#     # add favorite (POST)
#     path("student-add-favorte-course/", views.StudentFavoriteCourseList.as_view()),

#     # remove favorite
#     path("student-remove-favorite-course/<int:course_id>/<int:student_id>", views.remove_favorite_course),

#     # check favorite status
#     path("fetch-favorite-status/<int:student_id>/<int:course_id>", views.fetch_favorite_status),





        
#     path('workshops/', workshop_list),

#     path('workshops/register/', register_workshop),

#     path('workshops/payment-info/<int:registration_id>/', payment_info),

#     path('workshops/mark-paid/<int:registration_id>/', mark_paid),



#         path('teacher/', views.TeacherList.as_view()),

#         path('student/', views.StudentRegisterView.as_view()),

#         path('teacher/<int:pk>/',views.TeacherDetail.as_view()),
        
#         path('teacher-login',views.teacher_login),

#         path('teacher/change-password/<int:teacher_id>/',views.teacher_change_password),

#         path('student/change-password/<int:student_id>/',views.student_change_password),

#         path('teacher/dashboard/<int:pk>/', views.TeacherDashboard.as_view()),

#         path('student/dashboard/<int:pk>/', views.StudentDashboard.as_view()),

#         path('student-login',views.student_login),

#         path('student/<int:pk>/',views.StudentDetail.as_view()),

#         path('category/', views.CategoryList.as_view()),

#         path('category/<int:pk>/', views.CategoryDetailView.as_view()), 

#         path('course/', views.CourseList.as_view()),
        
#         path('course/<int:pk>/', views.CourseDetailView.as_view()),
        
#         path(
#     'course/<int:course_id>/quiz/<int:student_id>/',
#     views.CourseQuizQuestions.as_view()
# ),



#         path('search-courses/<str:searchstring>', views.CourseList.as_view()),

    

#         path('chapter/<int:pk>', views.ChapterDetailView.as_view()),

#         path('course-chapters/<int:course_id>', views.CourseChapterList.as_view()),

#         path('teacher-course/<int:teacher_id>', views.TeacherCourseList.as_view()),

#         path('teacher-course-detail/<int:pk>', views.TeacherCourseDetail.as_view()),

#         path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),

#         path('fetch-enroll-status/<int:student_id>/<int:course_id>', views.fetch_enroll_status),

#         path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),
#         # u
#         path('fetch-enroll-status/<int:student_id>/<int:course_id>/', views.fetch_enroll_status),

#         path('fetch-enrolled-courses/<int:student_id>/', views.EnrolledCoursesByStudent.as_view()),
        
#         path('fetch-all-enrolled-students/<int:teacher_id>/', views.EnrolledStudentsByTeacher.as_view()),

#         path('fetch-enrolled-students/<int:course_id>/', views.EnrolledStudentsByCourse.as_view()),


#         path('course-rating/', views.CourseRatingList.as_view()),

#         path('popular-courses/', views.CourseRatingList.as_view()),

#         path('fetch-rating-status/<int:student_id>/<int:course_id>', views.fetch_rating_status),

#         path('student-add-favorte-course/', views.StudentFavoriteCourseList.as_view()),

#         path('student-remove-favorite-course/<int:course_id>/<int:student_id>', views.remove_favorite_course),

#         path('fetch-favorite-coourses/<int:student_id>', views.StudentFavoriteCourseList.as_view()),

       
#         path('student-assignment/<int:teacher_id>/<int:student_id>/', views.AssignmentList.as_view()),


#         path('my-assignments/<int:student_id>/', views.MyAssignmentList.as_view()),

 
#        path('update-assignments/<int:pk>/', views.UpdateAssignmentList.as_view()),

#        path('submit-assignment/<int:pk>/', views.SubmitAssignment.as_view()),


#         path('quiz/',views.Quizlist.as_view()),

#         path('teacher-quiz/<int:teacher_id>',views.TeacherQuizList.as_view()),

#         path('teacher-quiz-detail/<int:pk>', views.TeacherQuizDetail.as_view()),

   

#         path('quiz/<int:pk>', views.QuizDetailView.as_view()),

        
#         path('quiz-question/<int:id>/', views.QuizQuestionDetail.as_view()),

#         # MOST SPECIFIC FIRST
#         path('quiz-questions/<int:quiz_id>/next-question/<int:question_id>', views.QuizQuestionList.as_view()),

# # THEN limit
#         path('quiz-questions/<int:quiz_id>/<int:limit>', views.QuizQuestionList.as_view()),

# # LEAST SPECIFIC LAST
#         path('quiz-questions/<int:quiz_id>', views.QuizQuestionList.as_view()),

#         path('quiz-questions/', views.QuizQuestionCreate.as_view()),  # POST endpoint

        



#         path('fetch-quiz-assign-status/<int:quiz_id>/<int:course_id>', views.fetch_quiz_assign_status),

#         path('quiz-assign-course/', views.CourseQuizList.as_view()),

#         path('fetch-assigned-quiz/<int:course_id>', views.CourseQuizList.as_view()),

#         path('fetch-quiz-assign-status/<int:quiz_id>/<int:course_id>', views.fetch_quiz_assign_status),

#         path('attempt-quiz/', views.AttempQuizList.as_view()),

#         path('attempted-quiz/<int:quiz_id>', views.AttempQuizList.as_view()),

#         # path('quiz-questions/<int:quiz_id>/next-question/<int:question_id>', views.QuizQuestionList.as_view()),

#         path('fetch-quiz-attempt-status/<int:quiz_id>/<int:student_id>', views.fetch_quiz_attempt_status),

#         path('fetch-quiz-result/<int:quiz_id>/<int:student_id>/', views.fetch_quiz_result),




#         path('study-material/<int:course_id>', views.StudyMaterialList.as_view()),

#         path('study-materials/<int:pk>', views.StudyMaterialView.as_view()),

#         path('user/study-material/<int:course_id>', views.StudyMaterialList.as_view()),

#        # urls.py
#        path('student-quizzes/<int:student_id>/', views.StudentQuizzes.as_view()),


       

#         path('update-view/<int:course_id>', views.update_view),

#         path('student-test/', views.CourseRatingList.as_view()),

#         path('popular-teachers/', views.TeacherList.as_view()),

#         path('faq/', views.FaqList.as_view()),

#         path('pages/', views.FlatPagesList.as_view()),

#         path('pages/<int:pk>/<str:page_slug>', views.FlatPagesDetail.as_view()),

#        path('send-message/<int:teacher_id>/<int:student_id>/', views.ChatBot),
       
#        path('unread-count/<int:teacher_id>/', views.unread_message_count),



#         path('get-message/<int:teacher_id>/<int:student_id>', views.MessageList.as_view()),

#         path('send-group-message/<int:teacher_id>/', views.GroupChatBot),

#         path('fetch-my-teachers/<int:student_id>', views.MyTeacherList().as_view()),

#         path('student-chat/<int:student_id>/', views.StudentChatList),


#         path('student-all-messages/<int:student_id>/', views.student_all_messages),


#         path('student-group-messages/<int:student_id>/', views.StudentGroupMessages),


#         path('unread-individual-count/<int:student_id>/', views.unread_individual_count),

#         path('unread-group-count/<int:student_id>/', views.unread_group_count),

      
#        path('teacher-group-messages/<int:teacher_id>/', views.TeacherGroupMessages),


#        path('student-reply-group/<int:student_id>/<int:group_id>/', views.send_group_reply),



#     path('teacher/chat-dashboard/<int:teacher_id>/', views.teacher_chat_dashboard),

#     path('student/chat-dashboard/<int:student_id>/', views.student_chat_dashboard),

#     path('chat/individual/<int:teacher_id>/<int:student_id>/', views.fetch_individual_chat),

#     path('chat/individual/send/', views.send_individual_message),

#     path('chat/group/<int:course_id>/', views.fetch_group_chat),

#     path('chat/group/send/', views.send_group_message),

#     path('chat/individual/delete/<int:msg_id>/', views.delete_individual_message),


#     path("save-video-progress/", views.save_video_progress),

#     path("chapter-progress/<int:student_id>/<int:course_id>/", views.fetch_chapter_progress),

#     path("generate-certificate/<int:student_id>/<int:course_id>/", views.generate_certificate),

#     path("certificate-status/<int:student_id>/<int:course_id>/", views.certificate_status),


#     path("teacher/student-course-progress/<int:teacher_id>/", views.teacher_student_course_progress),

    
#     path("teacher/approve-certificate/", views.approve_certificate),



   



# ]

from django.urls import path
from . import views
from .views import (
    AIChatView,
    workshop_list,
    register_workshop,
    payment_info,
    mark_paid
)

urlpatterns =[



       
     path('blog-list/', views.BlogListAPIView.as_view()),
     # urls.py
     path('blog-detail/<int:pk>/', views.BlogDetailAPIView.as_view()),

      path('student-assigned-quizzes/<int:student_id>/', views.student_assigned_quizzes),

      path("quiz-assign-course/", views.quiz_assign_course),

      path("course-quizzes/<int:course_id>/", views.course_quizzes),

      path(
  "teacher-course-quizzes/<int:teacher_id>/<int:course_id>/",
  views.TeacherCourseQuizList.as_view()
),



    # list favorites for a student
    path("fetch-favorite-coourses/<int:student_id>", views.StudentFavoriteCourseList.as_view()),

    # add favorite (POST)
    path("student-add-favorte-course/", views.StudentFavoriteCourseList.as_view()),

    # remove favorite
    path("student-remove-favorite-course/<int:course_id>/<int:student_id>", views.remove_favorite_course),

    # check favorite status
    path("fetch-favorite-status/<int:student_id>/<int:course_id>", views.fetch_favorite_status),





        
    path('workshops/', workshop_list),

    path('workshops/register/', register_workshop),

    path('workshops/payment-info/<int:registration_id>/', payment_info),

    path('workshops/mark-paid/<int:registration_id>/', mark_paid),



        path('teacher/', views.TeacherList.as_view()),

        path('student/', views.StudentRegisterView.as_view()),

        path('teacher/<int:pk>/',views.TeacherDetail.as_view()),
        
        path('teacher-login',views.teacher_login),

        path('teacher/change-password/<int:teacher_id>/',views.teacher_change_password),

        path('student/change-password/<int:student_id>/',views.student_change_password),

        path('teacher/dashboard/<int:pk>/', views.TeacherDashboard.as_view()),

        path('student/dashboard/<int:pk>/', views.StudentDashboard.as_view()),

        path('student-login',views.student_login),

        path('student/<int:pk>/',views.StudentDetail.as_view()),

        path('category/', views.CategoryList.as_view()),

        path('category/<int:pk>/', views.CategoryDetailView.as_view()), 

        path('course/', views.CourseList.as_view()),
        
        path('course/<int:pk>/', views.CourseDetailView.as_view()),
        
        path(
    'course/<int:course_id>/quiz/<int:student_id>/',
    views.CourseQuizQuestions.as_view()
),



        path('search-courses/<str:searchstring>', views.CourseList.as_view()),

    

        path('chapter/<int:pk>', views.ChapterDetailView.as_view()),

        path('course-chapters/<int:course_id>', views.CourseChapterList.as_view()),

        path('teacher-course/<int:teacher_id>', views.TeacherCourseList.as_view()),

        path('teacher-course-detail/<int:pk>', views.TeacherCourseDetail.as_view()),

        path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),

        path('fetch-enroll-status/<int:student_id>/<int:course_id>', views.fetch_enroll_status),

        path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),
        # u
        path('fetch-enroll-status/<int:student_id>/<int:course_id>/', views.fetch_enroll_status),

        path('fetch-enrolled-courses/<int:student_id>/', views.EnrolledCoursesByStudent.as_view()),
        
        path('fetch-all-enrolled-students/<int:teacher_id>/', views.EnrolledStudentsByTeacher.as_view()),

        path('fetch-enrolled-students/<int:course_id>/', views.EnrolledStudentsByCourse.as_view()),


        path('course-rating/', views.CourseRatingList.as_view()),

        path('popular-courses/', views.CourseRatingList.as_view()),

        path('fetch-rating-status/<int:student_id>/<int:course_id>', views.fetch_rating_status),

        path('student-add-favorte-course/', views.StudentFavoriteCourseList.as_view()),

        path('student-remove-favorite-course/<int:course_id>/<int:student_id>', views.remove_favorite_course),

        path('fetch-favorite-coourses/<int:student_id>', views.StudentFavoriteCourseList.as_view()),

       
        path('student-assignment/<int:teacher_id>/<int:student_id>/', views.AssignmentList.as_view()),


        path('my-assignments/<int:student_id>/', views.MyAssignmentList.as_view()),

 
       path('update-assignments/<int:pk>/', views.UpdateAssignmentList.as_view()),

       path('submit-assignment/<int:pk>/', views.SubmitAssignment.as_view()),


        path('quiz/',views.Quizlist.as_view()),

        path('teacher-quiz/<int:teacher_id>',views.TeacherQuizList.as_view()),

        path('teacher-quiz-detail/<int:pk>', views.TeacherQuizDetail.as_view()),

   

        path('quiz/<int:pk>', views.QuizDetailView.as_view()),

        
        path('quiz-question/<int:id>/', views.QuizQuestionDetail.as_view()),

        # MOST SPECIFIC FIRST
        path('quiz-questions/<int:quiz_id>/next-question/<int:question_id>', views.QuizQuestionList.as_view()),

# THEN limit
        path('quiz-questions/<int:quiz_id>/<int:limit>', views.QuizQuestionList.as_view()),

# LEAST SPECIFIC LAST
        path('quiz-questions/<int:quiz_id>', views.QuizQuestionList.as_view()),

        path('quiz-questions/', views.QuizQuestionCreate.as_view()),  # POST endpoint

        



        path('fetch-quiz-assign-status/<int:quiz_id>/<int:course_id>', views.fetch_quiz_assign_status),

        path('quiz-assign-course/', views.CourseQuizList.as_view()),

        path('fetch-assigned-quiz/<int:course_id>', views.CourseQuizList.as_view()),

        path('fetch-quiz-assign-status/<int:quiz_id>/<int:course_id>', views.fetch_quiz_assign_status),

        path('attempt-quiz/', views.AttempQuizList.as_view()),

        path('attempted-quiz/<int:quiz_id>', views.AttempQuizList.as_view()),

        # path('quiz-questions/<int:quiz_id>/next-question/<int:question_id>', views.QuizQuestionList.as_view()),

        path('fetch-quiz-attempt-status/<int:quiz_id>/<int:student_id>', views.fetch_quiz_attempt_status),

        path('fetch-quiz-result/<int:quiz_id>/<int:student_id>/', views.fetch_quiz_result),




        path('study-material/<int:course_id>', views.StudyMaterialList.as_view()),

        path('study-materials/<int:pk>', views.StudyMaterialView.as_view()),

        path('user/study-material/<int:course_id>', views.StudyMaterialList.as_view()),

       # urls.py
       path('student-quizzes/<int:student_id>/', views.StudentQuizzes.as_view()),


       

        path('update-view/<int:course_id>', views.update_view),

        path('student-test/', views.CourseRatingList.as_view()),

        path('popular-teachers/', views.TeacherList.as_view()),

        path('faq/', views.FaqList.as_view()),

        path('pages/', views.FlatPagesList.as_view()),

        path('pages/<int:pk>/<str:page_slug>', views.FlatPagesDetail.as_view()),

       path('send-message/<int:teacher_id>/<int:student_id>/', views.ChatBot),
       
       path('unread-count/<int:teacher_id>/', views.unread_message_count),



        path('get-message/<int:teacher_id>/<int:student_id>', views.MessageList.as_view()),

        path('send-group-message/<int:teacher_id>/', views.GroupChatBot),

        path('fetch-my-teachers/<int:student_id>', views.MyTeacherList().as_view()),

        path('student-chat/<int:student_id>/', views.StudentChatList),


        path('student-all-messages/<int:student_id>/', views.student_all_messages),


        path('student-group-messages/<int:student_id>/', views.StudentGroupMessages),


        path('unread-individual-count/<int:student_id>/', views.unread_individual_count),

        path('unread-group-count/<int:student_id>/', views.unread_group_count),

      
       path('teacher-group-messages/<int:teacher_id>/', views.TeacherGroupMessages),


       path('student-reply-group/<int:student_id>/<int:group_id>/', views.send_group_reply),



    path('teacher/chat-dashboard/<int:teacher_id>/', views.teacher_chat_dashboard),

    path('student/chat-dashboard/<int:student_id>/', views.student_chat_dashboard),

    path('chat/individual/<int:teacher_id>/<int:student_id>/', views.fetch_individual_chat),

    path('chat/individual/send/', views.send_individual_message),

    path('chat/group/<int:course_id>/', views.fetch_group_chat),

    path('chat/group/send/', views.send_group_message),

    path('chat/individual/delete/<int:msg_id>/', views.delete_individual_message),


    path("save-video-progress/", views.save_video_progress),

    path("chapter-progress/<int:student_id>/<int:course_id>/", views.fetch_chapter_progress),

    path("generate-certificate/<int:student_id>/<int:course_id>/", views.generate_certificate),

    path("certificate-status/<int:student_id>/<int:course_id>/", views.certificate_status),


    path("teacher/student-course-progress/<int:teacher_id>/", views.teacher_student_course_progress),

    
    path("teacher/approve-certificate/", views.approve_certificate),
     


    path("ai-chat/", AIChatView.as_view())


   



]