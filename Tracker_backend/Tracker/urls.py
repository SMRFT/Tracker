from django.urls import path
from .views import RegisterView,BoardsView,LoginView,upload_content,CardCreateView,save_comment,get_comments
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView, name='register'),
    path('login/', LoginView, name='login'),
    path('upload-content/', upload_content, name='upload_content'),
    path('cards/', CardCreateView, name='create-card'),
    path('boards/', BoardsView, name='boards-list'),  # For GET and POST requests
    path('boards/<str:title>/', BoardsView, name='board-detail'),  # For PUT and DELETE requests
    path('save-comment/', save_comment, name='save_comment'),
    path('get-comments/', get_comments, name='get_comments'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)