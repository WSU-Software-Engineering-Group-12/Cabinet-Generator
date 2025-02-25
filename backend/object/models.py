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
        return (self._width, self._height)

    def get_position(self):
        """Returns the object's (x, y) position in inches"""
        return (self._position_x, self._position_y)
    
    def move_to(self, x, y):
        """Moves the object to a new (x, y) position"""
        self._position_x = x
        self._position_y = y
        return (self._position_x, self._position_y)

    # Private fields, note: all dimension variables will be in inches
    _name = models.CharField(max_length=100)
    _width = models.FloatField(default=0.0)
    _height = models.FloatField(default=0.0)
    _position_x = models.FloatField(default=0.0)
    _position_y = models.FloatField(default=0.0)


class Cabinet(Object):
    """
    Represents a cabinet that can be placed in a room. Inherits from *Object* class.

    This class uses all attributes defined in *Object* and adds 1 method - place_on_canvas

    Typical usage example:

        cabinet = Cabinet
    """
    
    def __init__(self, *args, place_x=None, place_y=None, **kwargs):
        """Creates a Cabinet with initial coordinates."""
        # If provided, assign the coordinates to the appropriate fields
        if place_x is not None:
            kwargs["position_x"] = place_x
        if place_y is not None:
            kwargs["position_y"] = place_y
        
        super().__init__(*args, **kwargs)

    def place_on_canvas(self, x, y):
        """Moves a cabinet to a new position"""
        self.move_to(x, y)