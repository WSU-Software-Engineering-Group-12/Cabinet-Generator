from django.db import models
from .base_object import Object

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