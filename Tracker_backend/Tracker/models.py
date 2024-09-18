from django.db import models
from django.contrib.auth.models import User

#Register Employee with email and password 
class Employee(models.Model):
    employeeId = models.CharField(max_length=50, primary_key=True)
    employeeName = models.CharField(max_length=100)
    employeeDepartment = models.CharField(max_length=100)
    employeeDesignation = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    email = models.EmailField(unique=True) 
    password = models.CharField(max_length=255) 


#create board and retrive 
class Board(models.Model):
    boardId = models.PositiveIntegerField(unique=True, blank=True, editable=False,primary_key=True)
    boardName = models.CharField(max_length=255)
    boardColor = models.CharField(max_length=250)
    employeeId = models.CharField(max_length=50)
    employeeName = models.CharField(max_length=100)
    card = models.JSONField() #(cardid and cardname)
    createdDate= models.DateField(auto_now_add=True)
    createdTime = models.TimeField(auto_now=True)
    def save(self, *args, **kwargs):
        if not self.boardId:
            # Get the highest existing boardId and increment by 1
            last_board = Board.objects.order_by('-boardId').first()
            if last_board and last_board.boardId is not None:
                self.boardId = last_board.boardId + 1
            else:
                self.boardId = 1
        super(Board, self).save(*args, **kwargs)


#create card and retrive 
class Card(models.Model):
    boardId = models.PositiveIntegerField()
    employeeId = models.CharField(max_length=50)
    employeeName = models.CharField(max_length=255)
    cardId = models.PositiveIntegerField(unique=True, blank=True, editable=False,primary_key=True)
    cardName = models.CharField(max_length=255)
    columnId = models.CharField(max_length=50)
    descriptionId = models.CharField(max_length=255)
    description = models.TextField()
    comment= models.JSONField()#(empid,empname,commenttext,date,time)
    startdate = models.DateField(auto_now_add=True)
    enddate = models.DateField(auto_now_add=True)
    members = models.JSONField()#(empid,empname)
    createdDate= models.DateField(auto_now_add=True)
    createdTime = models.TimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.cardId:
            # Get the highest existing cardId and increment by 1
            last_card = Card.objects.order_by('-cardId').first()
            if last_card and last_card.cardId is not None:
                self.cardId = last_card.cardId + 1
            else:
                self.cardId = 1
        super(Card, self).save(*args, **kwargs)