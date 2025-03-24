from .base_object import Object

class Cabinet(Object):
    """
    Represents a cabinet that can be placed in a room. Inherits from *Object* class.

    This class uses all attributes defined in *Object* and adds 1 method - place_on_canvas

    Typical usage example:

        cabinet = Cabinet
    """

    _VALID_SIZES = [36, 33, 30, 27, 24, 21, 18, 15, 12, 9]  # Standard cabinet sizes
    
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

class Base(Cabinet):
    DEPTH = 24  # inches
    HEIGHT = 36  # inches

    def __init__(self, width):
        super().__init__(width, Base.HEIGHT, Base.DEPTH, name="B")

class BaseCorner(Base):
    def __init__(self, width):
        if width not in [33, 36]:  # Width must be 33 or 36 inches
            raise ValueError("Width must be either 33 or 36 inches.")
        super().__init__(width)
        self.name = f"BC{width}"


class Upper(Cabinet):
    DEPTH = 12  # inches

    def __init__(self, width, height):
        super().__init__(width, height, Upper.DEPTH, name="U")


class UpperCorner(Upper):
    WIDTH = 24  # Updated to 24 inches

    def __init__(self, height):
        super().__init__(UpperCorner.WIDTH, height)
        self.name = "UC24"


class Filler(Cabinet):
    def __init__(self, width):
        super().__init__(width, None, None, name="F")