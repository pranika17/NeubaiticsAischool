from django.apps import AppConfig


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'


    def ready(self):
        from .ai_service import build_vector_index
        build_vector_index()
