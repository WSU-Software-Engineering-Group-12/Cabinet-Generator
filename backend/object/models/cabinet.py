from .base_object import Object

class Cabinet(Object):
    """
    Represents a cabinet that can be placed in a room. Inherits from *Object* class.

    This class uses all attributes defined in *Object* and adds 1 method - place_on_canvas

    Typical usage example:

        cabinet = Cabinet
    """

    VALID_SIZES = [36, 33, 30, 27, 24, 21, 18, 15, 12, 9]  # Standard cabinet sizes
    
    # Default values (make generation easier)
    STANDARD_HEIGHT = 36
    STANDARD_BASE_DEPTH = 24.5
    STANDARD_UPPER_DEPTH = 12

    def __init__(self, *args, name=None, width=None, height=None, depth=None, place_x=None, place_y=None, **kwargs):
        """Creates a Cabinet with initial coordinates."""
        self._validate_width(width) # Validate width against predefined sizes
        
        # Assign ORM fields if provided
        if name is not None and width is not None and height is not None and depth is not None:
            kwargs["name"] = f"{name}{width}"
            kwargs["width"] = width
            kwargs["height"] = height
            kwargs["depth"] = depth

        # Handle optional positional fields
        if place_x is not None:
            kwargs["position_x"] = place_x
        if place_y is not None:
            kwargs["position_y"] = place_y
        
        super().__init__(*args, **kwargs)
    
    def _validate_width(self, width):
        """Ensure width is one of the predefined valid sizes."""
        if width not in Cabinet.VALID_SIZES:
            raise ValueError(f"Invalid width: {width}. Must be one of {Cabinet.VALID_SIZES}.")

    def place_on_canvas(self, x, y):
        """Moves a cabinet to a new position"""
        self.move_to(x, y)

class Base(Cabinet):
    DEPTH = 24  # inches
    HEIGHT = 36  # inches

    def __init__(self, width):
        # Pass the required parameters using keyword arguments.
        super().__init__(name="B", width=width, height=Base.HEIGHT, depth=Base.DEPTH)


class BaseCorner(Base):
    def __init__(self, width):
        if width not in [33, 36]:  # Width must be 33 or 36 inches
            raise ValueError("Width must be either 33 or 36 inches.")
        super().__init__(width)
        self.name = f"BC{width}"


class Upper(Cabinet):
    DEPTH = 12  # inches

    def __init__(self, width, height):
        super().__init__(name="U", width=width, height=height, depth=Upper.DEPTH)


class UpperCorner(Upper):
    WIDTH = 24  # Updated to 24 inches

    def __init__(self, height):
        super().__init__(width=UpperCorner.WIDTH, height=height)
        self.name = "UC24"


class Filler(Cabinet):
    def __init__(self, width):
        # Provide default values for height and depth if needed; adjust as appropriate.
        super().__init__(name="F", width=width, height=0, depth=0)