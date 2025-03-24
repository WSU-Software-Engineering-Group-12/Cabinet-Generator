from django.db import models

class Object(models.Model):
    """
    **Abstract** base class for all objects in the system.\n
    NOTE: All dimensions (position, dimensions, etc) are in *inches* not *pixels*.

    Attributes:
        Public:
            get_dimensions() - float[]: Returns the width and height of the object.\n
            get_position() - int[]: Returns the x, y position of the object.\n
            move_to(float x, float y) - void: Moves the object to a specified (x, y) position on the canvas.\n

        Private:
            _name - str: The name of the object.\n
            _width - float: The width of the object (in inches).\n
            _height - float: The height of the object (in inches).\n
            _positionX - float: The x position of the object (in inches).\n
            _positionY - float: The y position of the object (in inches).

    """
    # This class is abstract so that Cabinet and Obstacle can inherit from it
    class Meta:
        abstract = True
    
    # Public fields
    def get_dimensions(self):
        """Returns the object's dimensions in inches (width, height)"""
        return {'width': self._width, 'height': self._height}

    def get_position(self):
        """Returns the object's (x, y) position in inches"""
        return {'x': self._position_x, 'y': self._position_y}
    
    def move_to(self, x, y):
        """Moves the object to a new (x, y) position"""
        self._position_x = x
        self._position_y = y
        return (self._position_x, self._position_y)

    def __str__(self):
        return self._name

    # Private fields, note: all dimension variables will be in inches
    _name = models.CharField(max_length=100)
    _width = models.FloatField(default=0.0)
    _height = models.FloatField(default=0.0)
    _position_x = models.FloatField(default=0.0)
    _position_y = models.FloatField(default=0.0)