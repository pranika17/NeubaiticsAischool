from django.core.management.base import BaseCommand

from main.models import Course, CourseQuiz, Quiz, QuizQuestions


COURSE_QUIZ_SETS = {
    "Artificial Intelligence Fundamentals with Python": [
        {
            "title": "AI Fundamentals - Set 1: Basics of AI",
            "detail": "Covers AI concepts, terminology, and common use cases.",
            "questions": [
                ("What is Artificial Intelligence?", "A system that can perform tasks needing human intelligence", "Only a database", "A spreadsheet formula", "A hardware cable", "A system that can perform tasks needing human intelligence"),
                ("Which is a common AI application?", "Image recognition", "Keyboard cleaning", "Printer refilling", "Cable crimping", "Image recognition"),
                ("Machine learning mainly helps systems to:", "Learn patterns from data", "Avoid using data", "Run without algorithms", "Delete training examples", "Learn patterns from data"),
                ("Which language is widely used for AI development?", "Python", "HTML only", "CSS only", "SQL only", "Python"),
                ("A trained AI model is used to:", "Make predictions or decisions", "Design electric sockets", "Replace all servers", "Format a hard disk", "Make predictions or decisions"),
            ],
        },
        {
            "title": "AI Fundamentals - Set 2: Python for AI",
            "detail": "Tests Python libraries and data handling basics for AI.",
            "questions": [
                ("Which library is commonly used for numerical arrays?", "NumPy", "Bootstrap", "React", "Nmap", "NumPy"),
                ("Pandas is mainly used for:", "Data analysis and manipulation", "Network scanning", "Password cracking", "CSS styling", "Data analysis and manipulation"),
                ("Which file type is often used for tabular datasets?", "CSV", "PNG", "EXE", "MP3", "CSV"),
                ("In Python, a list is used to:", "Store multiple values", "Create a firewall", "Render HTML only", "Compile Java", "Store multiple values"),
                ("Jupyter Notebook is useful because it:", "Runs code with notes and outputs together", "Blocks all internet traffic", "Hosts only images", "Encrypts disks only", "Runs code with notes and outputs together"),
            ],
        },
        {
            "title": "AI Fundamentals - Set 3: Machine Learning",
            "detail": "Covers supervised learning, features, labels, and evaluation.",
            "questions": [
                ("In supervised learning, training data usually has:", "Input features and target labels", "Only random images", "No examples", "Only passwords", "Input features and target labels"),
                ("A feature is:", "An input variable used by a model", "A server room", "A CSS color", "A browser tab", "An input variable used by a model"),
                ("A label is:", "The output value the model learns to predict", "A file extension", "A router setting", "A keyboard key", "The output value the model learns to predict"),
                ("Which metric is common for classification?", "Accuracy", "Font size", "Screen width", "Disk RPM", "Accuracy"),
                ("Overfitting means the model:", "Performs well on training data but poorly on new data", "Never learns from data", "Has no parameters", "Uses no features", "Performs well on training data but poorly on new data"),
            ],
        },
        {
            "title": "AI Fundamentals - Set 4: Deep Learning",
            "detail": "Covers neural networks, TensorFlow, Keras, and training.",
            "questions": [
                ("Deep learning is mainly based on:", "Neural networks", "Static HTML pages", "Manual sorting only", "Printer drivers", "Neural networks"),
                ("TensorFlow is a:", "Machine learning framework", "CSS framework", "Network cable", "Database table", "Machine learning framework"),
                ("Keras is commonly used to:", "Build neural network models", "Scan ports", "Write HTML tags only", "Compress images only", "Build neural network models"),
                ("An epoch means:", "One full pass through the training data", "A deleted dataset", "A browser refresh", "A SQL join", "One full pass through the training data"),
                ("Activation functions help neural networks:", "Learn non-linear patterns", "Remove all data", "Disable training", "Create folders", "Learn non-linear patterns"),
            ],
        },
        {
            "title": "AI Fundamentals - Set 5: Computer Vision",
            "detail": "Covers OpenCV, image data, and vision model concepts.",
            "questions": [
                ("OpenCV is mainly used for:", "Computer vision and image processing", "Web page routing", "Database migrations", "Email templates", "Computer vision and image processing"),
                ("An image is commonly represented as:", "Pixels", "Only text paragraphs", "A password hash", "A network port", "Pixels"),
                ("Image classification predicts:", "The category of an image", "The price of a keyboard", "The size of a database only", "The router password", "The category of an image"),
                ("Object detection is used to:", "Find and locate objects in an image", "Delete duplicate rows", "Style buttons", "Install packages only", "Find and locate objects in an image"),
                ("Preprocessing images can include:", "Resizing and normalization", "Randomly deleting labels", "Turning off Python", "Removing all pixels", "Resizing and normalization"),
            ],
        },
    ],
    "Full Stack Web Development with React & Django": [
        {
            "title": "Full Stack Web - Set 1: HTML CSS JavaScript",
            "detail": "Covers frontend fundamentals for web applications.",
            "questions": [
                ("HTML is used to define:", "Page structure", "Database indexes", "Server voltage", "Firewall rules", "Page structure"),
                ("CSS is used for:", "Styling web pages", "Training AI models", "Scanning networks", "Writing database rows only", "Styling web pages"),
                ("JavaScript runs in the browser to:", "Add interactivity", "Replace all databases", "Format hard disks", "Configure routers only", "Add interactivity"),
                ("Which tag is used for a link?", "a", "table-only", "python", "router", "a"),
                ("Responsive design helps pages:", "Work well on different screen sizes", "Run without browsers", "Avoid CSS", "Delete mobile views", "Work well on different screen sizes"),
            ],
        },
        {
            "title": "Full Stack Web - Set 2: React Basics",
            "detail": "Covers components, state, props, and React rendering.",
            "questions": [
                ("React is mainly used to build:", "User interfaces", "Operating systems", "Network switches", "Antivirus engines", "User interfaces"),
                ("A React component is:", "A reusable UI piece", "A database backup", "A firewall port", "A Python package only", "A reusable UI piece"),
                ("Props are used to:", "Pass data to components", "Delete components", "Encrypt CSS", "Start Django migrations", "Pass data to components"),
                ("State is used for:", "Data that can change in a component", "Only static images", "Server hardware", "DNS records", "Data that can change in a component"),
                ("React Router helps with:", "Frontend navigation", "Password hashing", "Image compression", "Network sniffing", "Frontend navigation"),
            ],
        },
        {
            "title": "Full Stack Web - Set 3: Django Backend",
            "detail": "Covers Django models, views, URLs, and admin basics.",
            "questions": [
                ("Django is a:", "Python web framework", "CSS library", "Browser extension", "Network scanner", "Python web framework"),
                ("Django models represent:", "Database structure", "Only CSS colors", "Keyboard shortcuts", "Image filters only", "Database structure"),
                ("Django views handle:", "Request and response logic", "Monitor brightness", "Network cabling", "Only font downloads", "Request and response logic"),
                ("URL patterns are used to:", "Map URLs to views", "Encrypt passwords directly", "Create CSS classes", "Open images only", "Map URLs to views"),
                ("Django admin is useful for:", "Managing database records", "Editing videos only", "Writing React state", "Scanning ports", "Managing database records"),
            ],
        },
        {
            "title": "Full Stack Web - Set 4: REST API",
            "detail": "Covers Django REST Framework and API communication.",
            "questions": [
                ("REST APIs commonly exchange data as:", "JSON", "Only JPG", "Only EXE", "Only MP3", "JSON"),
                ("Django REST Framework helps build:", "Web APIs", "CSS animations", "BIOS settings", "LAN cables", "Web APIs"),
                ("A serializer is used to:", "Convert model data to/from API data", "Style buttons", "Scan networks", "Compile React", "Convert model data to/from API data"),
                ("HTTP POST is commonly used to:", "Create data", "Only read data", "Delete browsers", "Install drivers", "Create data"),
                ("Axios is used in React to:", "Make HTTP requests", "Create database tables directly", "Style forms only", "Run Django commands", "Make HTTP requests"),
            ],
        },
        {
            "title": "Full Stack Web - Set 5: Deployment and Git",
            "detail": "Covers version control, deployment, and production basics.",
            "questions": [
                ("Git is used for:", "Version control", "Image editing only", "Network hacking only", "Typing passwords", "Version control"),
                ("A commit is:", "A saved snapshot of changes", "A CSS border", "A server cable", "A browser cookie only", "A saved snapshot of changes"),
                ("Environment variables are useful for:", "Storing configuration like keys safely", "Making text bold only", "Deleting code", "Replacing APIs", "Storing configuration like keys safely"),
                ("Production deployment means:", "Making the app available to users", "Only writing comments", "Disabling the app", "Removing the backend", "Making the app available to users"),
                ("A frontend build creates:", "Optimized static files", "New database passwords", "Only Python migrations", "Router firmware", "Optimized static files"),
            ],
        },
    ],
    "Ethical Hacking and Cybersecurity Essentials": [
        {
            "title": "Cybersecurity - Set 1: Security Basics",
            "detail": "Covers CIA triad, threats, and core security concepts.",
            "questions": [
                ("The CIA triad stands for:", "Confidentiality, Integrity, Availability", "Code, Internet, Access", "CPU, Input, API", "Cloud, IP, Admin", "Confidentiality, Integrity, Availability"),
                ("Confidentiality means:", "Keeping data private", "Making all data public", "Deleting backups", "Disabling passwords", "Keeping data private"),
                ("Integrity means:", "Data remains accurate and unchanged without authorization", "Data is always public", "Systems are offline", "Passwords are visible", "Data remains accurate and unchanged without authorization"),
                ("Availability means:", "Systems and data are accessible when needed", "Data is deleted", "Network is always blocked", "Users cannot login", "Systems and data are accessible when needed"),
                ("A vulnerability is:", "A weakness that can be exploited", "A secure password", "A backup copy", "A trusted update", "A weakness that can be exploited"),
            ],
        },
        {
            "title": "Cybersecurity - Set 2: Linux and Kali",
            "detail": "Covers Linux basics and Kali Linux security workflow.",
            "questions": [
                ("Kali Linux is commonly used for:", "Security testing", "Video editing only", "CSS design", "Accounting only", "Security testing"),
                ("The ls command is used to:", "List files and directories", "Change passwords only", "Scan websites", "Open browsers only", "List files and directories"),
                ("The cd command is used to:", "Change directory", "Copy disks", "Delete networks", "Create firewalls only", "Change directory"),
                ("Permissions in Linux help control:", "Who can read, write, or execute files", "Screen brightness", "Mouse speed", "HTML color", "Who can read, write, or execute files"),
                ("sudo is used to:", "Run commands with elevated privileges", "Write CSS", "Create React props", "Open only images", "Run commands with elevated privileges"),
            ],
        },
        {
            "title": "Cybersecurity - Set 3: Network Scanning",
            "detail": "Covers Nmap, ports, services, and reconnaissance basics.",
            "questions": [
                ("Nmap is used for:", "Network scanning", "Image cropping", "React rendering", "Database design only", "Network scanning"),
                ("A port represents:", "A communication endpoint for a service", "A CSS style", "A Python list", "A screen pixel", "A communication endpoint for a service"),
                ("Port 80 is commonly used for:", "HTTP", "SSH", "SMTP only", "DNS only", "HTTP"),
                ("Reconnaissance means:", "Gathering information about a target", "Deleting logs", "Encrypting all traffic", "Writing frontend code", "Gathering information about a target"),
                ("A service version scan helps identify:", "Software and version running on a port", "Font names", "Image size", "Keyboard model", "Software and version running on a port"),
            ],
        },
        {
            "title": "Cybersecurity - Set 4: Web Security",
            "detail": "Covers OWASP, Burp Suite, and common web vulnerabilities.",
            "questions": [
                ("OWASP focuses on:", "Web application security", "Video streaming", "Graphic design", "Spreadsheet formulas", "Web application security"),
                ("Burp Suite is commonly used for:", "Web security testing", "CSS animation", "Database backup only", "React routing", "Web security testing"),
                ("SQL injection targets:", "Database queries", "Image pixels", "CSS margins", "Keyboard shortcuts", "Database queries"),
                ("XSS stands for:", "Cross-Site Scripting", "Extra Secure Server", "XML Style Sheet only", "Cross Server Scan", "Cross-Site Scripting"),
                ("Input validation helps:", "Reduce malicious or invalid input", "Make passwords public", "Disable security", "Remove authentication", "Reduce malicious or invalid input"),
            ],
        },
        {
            "title": "Cybersecurity - Set 5: Defensive Practices",
            "detail": "Covers passwords, patching, monitoring, and safe practice.",
            "questions": [
                ("Strong passwords should be:", "Long, unique, and hard to guess", "Short and reused", "Only the word password", "Shared publicly", "Long, unique, and hard to guess"),
                ("Two-factor authentication adds:", "An extra layer of login security", "A public password", "A deleted account", "A slower keyboard", "An extra layer of login security"),
                ("Patching means:", "Updating software to fix issues", "Deleting users", "Turning off logs", "Removing backups", "Updating software to fix issues"),
                ("Logs are useful for:", "Monitoring and investigating activity", "Making pages colorful only", "Writing CSS", "Hiding all attacks", "Monitoring and investigating activity"),
                ("Ethical hacking requires:", "Permission and legal authorization", "No permission", "Publicly leaking data", "Ignoring rules", "Permission and legal authorization"),
            ],
        },
    ],
}


class Command(BaseCommand):
    help = "Seed five quiz sets for each main course and assign them to the course."

    def handle(self, *args, **options):
        created_quizzes = 0
        created_questions = 0
        created_assignments = 0

        for course_title, quiz_sets in COURSE_QUIZ_SETS.items():
            course = Course.objects.filter(title=course_title).select_related("teacher").first()
            if not course:
                self.stdout.write(self.style.WARNING(f"Course not found: {course_title}"))
                continue

            for quiz_set in quiz_sets:
                quiz, quiz_created = Quiz.objects.get_or_create(
                    teacher=course.teacher,
                    title=quiz_set["title"],
                    defaults={"detail": quiz_set["detail"]},
                )
                if quiz_created:
                    created_quizzes += 1
                elif quiz.detail != quiz_set["detail"]:
                    quiz.detail = quiz_set["detail"]
                    quiz.save(update_fields=["detail"])

                assignment, assignment_created = CourseQuiz.objects.get_or_create(
                    teacher=course.teacher,
                    course=course,
                    quiz=quiz,
                )
                if assignment_created:
                    created_assignments += 1

                if not QuizQuestions.objects.filter(quiz=quiz).exists():
                    for question, ans1, ans2, ans3, ans4, right_ans in quiz_set["questions"]:
                        QuizQuestions.objects.create(
                            quiz=quiz,
                            question_type="mcq",
                            questions=question,
                            ans1=ans1,
                            ans2=ans2,
                            ans3=ans3,
                            ans4=ans4,
                            right_ans=right_ans,
                        )
                        created_questions += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {created_quizzes} quizzes, "
                f"{created_questions} questions, {created_assignments} course assignments created."
            )
        )
