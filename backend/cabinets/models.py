from django.db import models

class Cabinet(models.Model):
    name = models.CharField(max_length=100)

    # Cabinet dimensions are in inches
    width = models.FloatField()
    height = models.FloatField()

    # Cabinet's position on the canvas (in pixels)
    position_x = models.FloatField(null=True, blank=True)
    position_y = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name

class Obstacle(models.Model):
    name = "";