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
import os
from pymongo import MongoClient
from django.conf import settings
from datetime import datetime
#files and images post
# Initialize MongoDB connection
client = MongoClient('mongodb+srv://smrfttracker:tracker2024@projecttracker.fls8r.mongodb.net/')
db = client['Tracker']
fs = gridfs.GridFS(db)
@api_view(['POST', 'GET'])
def upload_content(request):
    response_data = {}

    # Get additional fields from request
    cardId = request.POST.get('cardId')
    cardName = request.POST.get('cardName')
    boardName = request.POST.get('boardName')
    employeeId = request.POST.get('employeeId')
    employeeName = request.POST.get('employeeName')

    # Create custom filename prefix using boardName, cardId, employeeName, and employeeId
    custom_filename_prefix_image = f"{boardName}_{cardId}_{cardName}.jpg"
    custom_filename_prefix_file = f"{boardName}_{cardId}_{cardName}.pdf"

    # Handle file upload
    if 'file' in request.FILES:
        file = request.FILES['file']
        
        # Get the file extension
        _, file_extension = os.path.splitext(file.name)
        
        # Set custom filename with the extension
        # custom_filename = f"{custom_filename_prefix}{file_extension}"
        
        # Store file in GridFS
        file_id = fs.put(file, filename=custom_filename_prefix_file, boardName=boardName, cardId=cardId, cardName=cardName, 
                         employeeId=employeeId, employeeName=employeeName, content_type=file.content_type)
        
        # Add file_id to the response data
        response_data['file_id'] = str(file_id)

    # Handle image upload
    if 'image' in request.FILES:
        image = request.FILES['image']
        
        # Get the image extension
        _, image_extension = os.path.splitext(image.name)
        
        # Set custom image filename with the extension
        # custom_image_filename = f"{custom_filename_prefix}{image_extension}"
        
        # Store image in GridFS
        image_id = fs.put(image, filename= custom_filename_prefix_image , boardName=boardName, cardId=cardId, cardName=cardName, 
                          employeeId=employeeId, employeeName=employeeName, content_type=image.content_type)
        
        # Add image_id to the response data
        response_data['image_id'] = str(image_id)

    # Include additional fields in the response data
    response_data.update({
        'cardId': cardId,
        'cardName': cardName,
        'boardName': boardName,
        'employeeId': employeeId,
        'employeeName': employeeName
    })

    # If no file or image was uploaded, return an error
    if not response_data:
        return Response({'error': 'No file or image provided'}, status=400)
    
    return Response(response_data, status=201)


from django.http import HttpResponse, Http404
from gridfs.errors import NoFile

@api_view(['GET'])
def get_file(request, filename):
    try:
        file = fs.find_one({"filename": filename})
        if not file:
            raise Http404("File not found")
        response = HttpResponse(file.read(), content_type=file.content_type)
        response['Content-Disposition'] = f'attachment; filename="{file.filename}"'
        return response
    except NoFile:
        raise Http404("File not found")





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
            return JsonResponse({'message': 'Login successful!', 'employeeId': user.employeeId, 'employeeName': user.employeeName, 'email': user.email}, status=status.HTTP_200_OK)
        else:
            # If password doesn't match
            return JsonResponse({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    except Employee.DoesNotExist:
        # If user with given email does not exist
        return JsonResponse({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    


        
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Card
from .serializers import CardSerializer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST', 'GET', 'DELETE', 'PATCH'])
def CardCreateView(request, card_id=None):
    if request.method == 'POST':
        serializer = CardSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'GET':
        board_id = request.query_params.get('boardId', None)
        if card_id:
            card = get_object_or_404(Card, cardId=card_id, boardId=board_id)
            serializer = CardSerializer(card)
            return Response(serializer.data)
        else:
            if board_id:
                cards = Card.objects.filter(boardId=board_id)
            else:
                cards = Card.objects.all()
            serializer = CardSerializer(cards, many=True)
            return Response(serializer.data)

    elif request.method == 'DELETE':
        if card_id:
            card = get_object_or_404(Card, cardId=card_id)
            card.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PATCH':
        card = get_object_or_404(Card, cardId=card_id)
        data = request.data
        serializer = CardSerializer(card, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




from .models import Board
from .serializers import BoardSerializer
# Set up MongoDB connection
client = MongoClient('mongodb+srv://smrfttracker:tracker2024@projecttracker.fls8r.mongodb.net/')  # Update with your MongoDB URI if different
db = client['Tracker']  # Replace with your actual database name
collection = db['Tracker_board']
@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def BoardsView(request, boardId=None):
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
        if boardId is None:
            return JsonResponse({'error': 'Board ID is required to update a board.'}, status=400)

        board = collection.find_one({'boardId': boardId})
        if not board:
            return JsonResponse({'error': 'Board not found.'}, status=404)

        request_employee_id = request.data.get('employeeId')
        if board['employeeId'] != request_employee_id:
            return JsonResponse({'error': 'Unauthorized to edit this board.'}, status=403)

        updated_data = {
            'boardName': request.data.get('boardName', board['boardName']),
            'boardColor': request.data.get('boardColor', board['boardColor']),
            'employeeId': request_employee_id,
            'employeeName': request.data.get('employeeName', board['employeeName']),
        }

        result = collection.update_one({'boardId': boardId}, {'$set': updated_data})
        if result.modified_count > 0:
            return JsonResponse({'message': 'Board updated successfully!'}, status=200)
        else:
            return JsonResponse({'message': 'No changes made to the board.'}, status=200)

    elif request.method == 'DELETE':
        if boardId is None:
            return JsonResponse({'error': 'Title is required to delete a board.'}, status=400)
        board = collection.find_one({'boardId': boardId})
        if not board:
            return JsonResponse({'error': 'Board not found.'}, status=404)
        request_employee_id = request.data.get('employeeId')
        if board['employeeId'] != request_employee_id:
            return JsonResponse({'error': 'Unauthorized to delete this board.'}, status=403)
        result = collection.delete_one({'boardId': boardId})
        if result.deleted_count > 0:
            return JsonResponse({'message': 'Board deleted successfully!'}, status=204)
        else:
            return JsonResponse({'error': 'Board could not be deleted.'}, status=400)
        



#delete the card

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Card

class CardDetail(APIView):
    def delete(self, request, pk, format=None):
        try:
            card = Card.objects.get(pk=pk)
            card.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Card.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        

        


#update a card when the edit the card
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Card
import json
@csrf_exempt
def update_card(request, card_id):
    if request.method == 'PUT':
        try:
            card = Card.objects.get(cardId=card_id)
        except Card.DoesNotExist:
            return JsonResponse({'error': 'Card not found'}, status=404)

        data = json.loads(request.body)
        card.cardName = data.get('cardName', card.cardName)  # Update card name
        card.save()
        return JsonResponse({'cardId': card.cardId, 'cardName': card.cardName})
    





from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Card
import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Card
import json

@csrf_exempt
def save_comment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            cardId = data.get('cardId')
            boardId = data.get('boardId')  # Ensure you're using the correct field name

            # Fetch the card based on cardId and boardId
            card = Card.objects.get(cardId=cardId, boardId=boardId)

            new_comment = {
                "empid": data.get("employeeId"),
                "empname": data.get("employeeName"),
                "commenttext": data.get("text"),
                "date": data.get("date"),
                "time": data.get("time")
            }

            # If card.comment is None, initialize it as an empty list
            if card.comment is None:
                card.comment = []

            # Ensure card.comment is a list
            if not isinstance(card.comment, list):
                try:
                    card.comment = json.loads(card.comment)  # Attempt to parse it as a list
                except (json.JSONDecodeError, TypeError):
                    card.comment = []  # Initialize as an empty list if it's invalid

            # Append the new comment to the existing comments
            card.comment.append(new_comment)
            card.save()

            return JsonResponse({"message": "Comment saved successfully!"}, status=200)
        except Card.DoesNotExist:
            return JsonResponse({"error": "Card not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)


@csrf_exempt
def get_comments(request):
    if request.method == "GET":
        try:
            cardId = request.GET.get('cardId')
            boardId = request.GET.get('boardId')

            # Fetch the card based on cardId and boardId
            card = Card.objects.get(cardId=cardId, boardId=boardId)

            # If comments are None, return an empty list
            comments = card.comment if card.comment is not None else []

            return JsonResponse({"comments": comments}, status=200)

        except Card.DoesNotExist:
            return JsonResponse({"error": "Card not found"}, status=404)
    return JsonResponse({"error": "Invalid request method"}, status=400)