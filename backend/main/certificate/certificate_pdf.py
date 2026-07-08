import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from django.conf import settings
from datetime import datetime

def generate_certificate_pdf(student, course, certificate_id, teacher_name=""):
    width, height = A4

    # ✅ Canva template (PNG)
    template_path = os.path.join(settings.MEDIA_ROOT, "certificate_templates", "company_certificate.png")

    # Output folder
    output_folder = os.path.join(settings.MEDIA_ROOT, "certificates")
    os.makedirs(output_folder, exist_ok=True)

    filename = f"{certificate_id}.pdf"
    output_path = os.path.join(output_folder, filename)

    c = canvas.Canvas(output_path, pagesize=A4)

    # ✅ Draw Background Template
    if os.path.exists(template_path):
        c.drawImage(template_path, 0, 0, width=width, height=height)

    # ✅ Dynamic fields (adjust x/y to match Canva design)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(width / 2, 420, student.fullname)

    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2, 380, "has successfully completed the course")

    c.setFont("Helvetica-Bold", 20)
    c.drawCentredString(width / 2, 350, course.title)

    c.setFont("Helvetica", 12)
    c.drawString(60, 110, f"Certificate ID: {certificate_id}")
    c.drawString(60, 90, f"Issue Date: {datetime.now().strftime('%d-%m-%Y')}")

    if teacher_name:
        c.drawRightString(width - 60, 90, f"Instructor: {teacher_name}")

    c.save()

    return f"certificates/{filename}"