
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.core.files.storage import default_storage
import gridfs
from pymongo import MongoClient
from django.conf import settings
# Initialize MongoDB connection
client = MongoClient('mongodb+srv://smrfttracker:tracker2024@projecttracker.fls8r.mongodb.net/')
db = client['Tracker']
fs = gridfs.GridFS(db)
@api_view(['POST'])
def upload_content(request):
    response_data = {}
    # Handle file upload
    if 'file' in request.FILES:
        file = request.FILES['file']
        file_id = fs.put(file, filename=file.name, content_type=file.content_type)
        response_data['file_id'] = str(file_id)
    # Handle image upload
    if 'image' in request.FILES:
        image = request.FILES['image']
        image_id = fs.put(image, filename=image.name, content_type=image.content_type)
        response_data['image_id'] = str(image_id)
    if not response_data:
        return Response({'error': 'No file or image provided'}, status=400)
    return Response(response_data, status=201)


from .serializers import EmployeeSerializer
@csrf_exempt
@api_view(['POST'])
def RegisterView(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Registration successful!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Login check through email and password
from django.contrib.auth.hashers import check_password
from .models import Employee
@csrf_exempt
@api_view(['POST'])
def LoginView(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        # Find the user by email
        user = Employee.objects.get(email=email)
        # Check if the password matches
        if check_password(password, user.password):
            # If password matches, login is successful
            return JsonResponse({'message': 'Login successful!', 'employeeId': user.employeeId, 'employeeName': user.employeeName}, status=status.HTTP_200_OK)
        else:
            # If password doesn't match
            return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Employee.DoesNotExist:
        # If user with given email does not exist
        return JsonResponse({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    

from .models import Card
from .serializers import CardSerializer,CardNameSerializer
@csrf_exempt
@api_view(['POST', 'GET'])
def CardCreateView(request):
    if request.method == 'POST':
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        cards = Card.objects.all()
        serializer = CardNameSerializer(cards, many=True)
        return Response(serializer.data)
    

from .models import Comment
from .serializers import CommentSerializer
import json
@csrf_exempt
def save_comment(request):
    if request.method == "POST":
        data = json.loads(request.body)
        text = data.get('text', '')
        if text:
            comment = Comment.objects.create(text=text)
            return JsonResponse({
                "id": str(comment.id),  # Convert ObjectId to string if using MongoDB
                "text": comment.text,
                "created_at": comment.created_at
            }, status=201)
        return JsonResponse({"error": "Text is required"}, status=400)
def get_comments(request):
    comments = Comment.objects.all().order_by('-created_at')
    comments_data = [{
        "id": str(comment.id),  # Convert ObjectId to string if using MongoDB
        "text": comment.text,
        "created_at": comment.created_at
    } for comment in comments]
    return JsonResponse(comments_data, safe=False)


from .models import Board
from .serializers import BoardSerializer
# Set up MongoDB connection
client = MongoClient('mongodb+srv://smrfttracker:tracker2024@projecttracker.fls8r.mongodb.net/')  # Update with your MongoDB URI if different
db = client['Tracker']  # Replace with your actual database name
collection = db['Tracker_board']

@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def BoardsView(request, title=None):
    if request.method == 'POST':
        serializer = BoardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Board created successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'GET':
        boards = Board.objects.all()
        serializer = BoardSerializer(boards, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        if title is None:
            return JsonResponse({'error': 'Title is required to update a board.'}, status=400)
        
        board = collection.find_one({'title': title})
        if not board:
            return JsonResponse({'error': 'Board not found.'}, status=404)

        request_employee_id = request.data.get('employeeId')
        if board['employeeId'] != request_employee_id:
            return JsonResponse({'error': 'Unauthorized to edit this board.'}, status=403)

        updated_data = {
            'title': request.data.get('title', board['title']),
            'color': request.data.get('color', board['color']),
            'employeeId': request_employee_id,
            'employeeName': request.data.get('employeeName', board['employeeName']),
        }
        
        result = collection.update_one({'title': title}, {'$set': updated_data})

        if result.modified_count > 0:
            return JsonResponse({'message': 'Board updated successfully!'}, status=200)
        else:
            return JsonResponse({'message': 'No changes made to the board.'}, status=200)

    elif request.method == 'DELETE':
        if title is None:
            return JsonResponse({'error': 'Title is required to delete a board.'}, status=400)
        
        board = collection.find_one({'title': title})
        if not board:
            return JsonResponse({'error': 'Board not found.'}, status=404)

        request_employee_id = request.data.get('employeeId')
        if board['employeeId'] != request_employee_id:
            return JsonResponse({'error': 'Unauthorized to delete this board.'}, status=403)

        result = collection.delete_one({'title': title})

        if result.deleted_count > 0:
            return JsonResponse({'message': 'Board deleted successfully!'}, status=204)
        else:
            return JsonResponse({'error': 'Board could not be deleted.'}, status=400)
