from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

class Event(models.Model):
    name = models.CharField(max_length = 1000, primary_key = True)
    start_date = models.DateField()
    end_date = models.DateField()
    year = models.IntegerField()

    def __str__(self):
        return self.name + " " + self.year

class Team(models.Model):
    number = models.IntegerField(primary_key = True)
    name = models.CharField(max_length = 1000)
    events = models.ManyToManyField(Event, related_name='teams')

    def __str__(self):
        return "Team " + str(self.number) + ": " + self.name
    def __matches(self):
        return self.matches1 | self.matches2 | self.matches3 | self.matches4 | self.matches5 | self.matches6

    matches = property(__matches)



class Match(models.Model): 
    number = models.IntegerField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches1')
    team2 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches2')
    team3 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches3')
    team4 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches4')
    team5 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches5')
    team6 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches6')
    def __str__(self):
        return str(self.number)
    
class Report(models.Model):
    
    scouter = models.CharField(blank = True, max_length=20);
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE,)
    initiationLine = models.BooleanField()
    onePointMadeTele = models.PositiveIntegerField(default = 0)
    onePointMissedTele = models.PositiveIntegerField(default = 0)
    twoPointMadeTele = models.PositiveIntegerField(default = 0)
    twoPointMissedTele = models.PositiveIntegerField(default = 0)
    wheelTurn = models.BooleanField()
    wheelColor = models.BooleanField()
    climb = models.BooleanField(default = False)
    climbAssist = models.PositiveIntegerField(default=0, validators=[MaxValueValidator(2)])
    balanceResponsibility = models.BooleanField(default = False)
    onePointMadeAuto = models.PositiveIntegerField(default = 0)
    onePointMissedAuto = models.PositiveIntegerField(default = 0)
    twoPointMadeAuto = models.PositiveIntegerField(default = 0)
    twoPointMissedAuto = models.PositiveIntegerField(default = 0)
    timeOnDefense = models.FloatField(blank = True, default = 0, validators=[MinValueValidator(0), MaxValueValidator(150)])
    bot1Defense = models.FloatField(blank = True, default = 0, validators=[MinValueValidator(0), MaxValueValidator(150)])
    bot2Defense = models.FloatField(blank = True, default = 0, validators=[MinValueValidator(0), MaxValueValidator(150)])
    bot3Defense = models.FloatField(blank = True, default = 0, validators=[MinValueValidator(0), MaxValueValidator(150)])
    timeInoperable = models.FloatField(blank = True, default = 0, validators=[MinValueValidator(0), MaxValueValidator(150)])
    notes = models.TextField(blank = True, max_length=100000, null=True)
    estimate3pt = models.PositiveIntegerField(default = 0)

    def __str__(self):
        return str(self.scouter + self.match)

class CurrentScouting(models.Model):
    id = models.PositiveIntegerField(default = 1, primary_key = True)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

class Schedule(models.Model):
    scouter = models.CharField(primary_key=True, max_length=20);
    matches = models.CharField(blank = True, default='', max_length=9999);
