from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from bson import ObjectId
class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)
    def to_internal_value(self, data):
        return ObjectId(data)
    

from .models import Employee
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])  # Encrypt the password
        return super(EmployeeSerializer, self).create(validated_data)
    

from .models import Card
class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['cardId', 'cardName', 'columnId', 'employeeId', 'employeeName', 'boardName', 'date', 'time']
        extra_kwargs = {
            'employeeId': {'required': True},
            'employeeName': {'required': True},
            'boardName': {'required': True},
        }
    

from .models import Comment
class CommentSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'

    
from .models import Board
class BoardSerializer(serializers.ModelSerializer):
    id = ObjectIdField(read_only=True)
    class Meta:
        model = Board
        fields = '__all__'


from .models import Members
class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Members
        fields = ['cardId', 'cardName', 'boardName', 'employeeId', 'employeeName']


from .models import Description
class DescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Description
        fields = ['text', 'cardId', 'cardName', 'boardName', 'created_at']
