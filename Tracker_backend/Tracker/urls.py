from django.urls import path
from .views import RegisterView,BoardsView,LoginView,upload_content,CardCreateView, update_card,save_comment,get_comments
from .views import get_file
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('register/', RegisterView, name='register'),
    path('login/', LoginView, name='login'),
    path('upload-content/', upload_content, name='upload_content'),
    path('cards/', CardCreateView, name='card-list'),  # For creating/listing cards
    path('cards/<str:card_id>/', CardCreateView, name='card-detail'),  # For retrieving/deleting specific cards by cardId
    path('cards/<str:card_id>/', update_card, name='update_card'),
    path('boards/', BoardsView, name='boards-list'),  # For GET and POST requests
    path('boards/<int:boardId>/', BoardsView, name='board-detail'),  # For PUT and DELETE requests
    path('get-file/<str:filename>/', get_file, name='get_file'),
    path('save_comment/', save_comment, name='save_comment'),
    path('get_comments/', get_comments, name='get_comments'),

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)