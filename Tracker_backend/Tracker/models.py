from django.db import models
from django.contrib.auth.models import User

class Employee(models.Model):
    employeeId = models.CharField(max_length=50, unique=True)
    employeeName = models.CharField(max_length=100)
    employeeDepartment = models.CharField(max_length=100)
    employeeDesignation = models.CharField(max_length=100)
    email = models.EmailField(unique=True)  # Only in Employee model
    password = models.CharField(max_length=255)  # Only in Employee model
    def __str__(self):
        return self.employeeName
    
    
import uuid
from datetime import date
class Card(models.Model):
    cardId = models.CharField(max_length=255, unique=True, primary_key=True) 
    cardName = models.CharField(max_length=255)
    columnId = models.CharField(max_length=50)
    employeeId = models.CharField(max_length=50)
    employeeName = models.CharField(max_length=255)
    boardName = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)
    time = models.TimeField(auto_now=True)

    def __str__(self):
        return self.cardName
    
    
class Comment(models.Model):
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.text
    
    
class Board(models.Model):
    employeeId = models.CharField(max_length=50)
    employeeName = models.CharField(max_length=100)
    boardName = models.CharField(max_length=255)
    color = models.CharField(max_length=7)


class Members(models.Model):
    cardId = models.IntegerField()
    cardName = models.CharField(max_length=255)
    boardName = models.CharField(max_length=255)
    employeeId = models.CharField(max_length=500)
    employeeName = models.CharField(max_length=500)
    def __str__(self):
        return f"Card: {self.cardName} ({self.cardId})"
    

class Description(models.Model):
    text = models.TextField()
    cardId = models.CharField(max_length=255)
    cardName = models.CharField(max_length=255)
    boardName = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

