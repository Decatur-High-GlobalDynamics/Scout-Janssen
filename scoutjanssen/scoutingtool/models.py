from django.db import models

class Event(models.Model):
    code = models.CharField(primary_key = True, max_length=100)
    name = models.CharField(max_length = 1000)
    start_date = models.DateField()
    end_date = models.DateField()
    year = models.IntegerField()

    def __str__(self):
        return self.name + " " + self.year

class Team(models.Model):
    code = models.CharField(primary_key = True, max_length=100)
    number = models.IntegerField()
    name = models.CharField(max_length = 1000)
    events = models.ManyToManyField(Event, related_name='teams')

    def __str__(self):
        return "Team " + self.number + ": " + self.name
    def __matches(self):
        return self.matches1 | self.matches2 | self.matches3 | self.matches4 | self.matches5 | self.matches6

    matches = property(__matches)



class Match(models.Model):
    code = models.CharField(primary_key = True, max_length=100)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    team1 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches1')
    team2 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches2')
    team3 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches3')
    team4 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches4')
    team5 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches5')
    team6 = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, related_name='matches6')
    
class Report(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
