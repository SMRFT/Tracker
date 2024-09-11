from django.urls import path
from .views import RegisterView,BoardsView,LoginView,upload_content,CardCreateView,save_comment,get_comments,get_all_employees
from .views import add_member_to_card,save_description
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', RegisterView, name='register'),
    path('login/', LoginView, name='login'),
    path('upload-content/', upload_content, name='upload_content'),
    path('cards/', CardCreateView, name='card-list'),  # For creating/listing cards
    path('cards/<str:card_id>/', CardCreateView, name='card-detail'),  # For retrieving/deleting specific cards by cardId
    path('boards/', BoardsView, name='boards-list'),  # For GET and POST requests
    path('boards/<str:boardName>/', BoardsView, name='board-detail'),  # For PUT and DELETE requests
    path('save-comment/', save_comment, name='save_comment'),
    path('get-comments/', get_comments, name='get_comments'),
    path('get-employees/', get_all_employees, name='get_all_employees'),
    path('add-membername/', add_member_to_card, name='add_member_to_card'),
    path('save-description/', save_description, name='save_description'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)