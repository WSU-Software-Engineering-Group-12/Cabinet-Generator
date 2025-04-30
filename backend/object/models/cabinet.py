from .base_object import Object

class Cabinet(Object):
    """
    Represents a cabinet that can be placed in a room. Inherits from *Object* class.

    This class uses all attributes defined in *Object* and adds one method - place_on_canvas.

    Typical usage example:

        cabinet = Cabinet
    """

    # List of valid cabinet sizes (in inches)
    VALID_SIZES = [36, 33, 30, 27, 24, 21, 18, 15, 12, 9]  # Standard cabinet sizes
    
    # Default values for cabinet height and depth
    STANDARD_HEIGHT = 36  # Standard height for a cabinet (inches)
    STANDARD_BASE_DEPTH = 24.5  # Depth for base cabinets (inches)
    STANDARD_UPPER_DEPTH = 12  # Depth for upper cabinets (inches)

    def __init__(self, *args, name=None, width=None, height=None, depth=None, place_x=None, place_y=None, **kwargs):
        """
        Initializes a Cabinet object with optional position and dimensions.
        
        Args:
            name (str): The name of the cabinet (optional).
            width (int): The width of the cabinet (required).
            height (int): The height of the cabinet (required).
            depth (int): The depth of the cabinet (required).
            place_x (float): The x-coordinate position (optional).
            place_y (float): The y-coordinate position (optional).

        Raises:
            ValueError: If the width is not in the list of valid sizes.
        """
        self._validate_width(width)  # Validate width against predefined valid sizes
        
        # Assign ORM fields if all required values are provided
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
        
        # Call the parent constructor (Object) with the initialized attributes
        super().__init__(*args, **kwargs)
    
    def _validate_width(self, width):
        """
        Ensure that the width is one of the predefined valid sizes.
        
        Args:
            width (int): The width of the cabinet.
        
        Raises:
            ValueError: If the width is not one of the valid sizes.
        """
        if width not in Cabinet.VALID_SIZES:
            raise ValueError(f"Invalid width: {width}. Must be one of {Cabinet.VALID_SIZES}.")

    def place_on_canvas(self, x, y):
        """
        Moves a cabinet to a new position on the canvas.
        
        Args:
            x (float): The new x-coordinate position for the cabinet.
            y (float): The new y-coordinate position for the cabinet.
        """
        self.move_to(x, y)

class Base(Cabinet):
    """
    Represents a base cabinet. Inherits from the Cabinet class.
    Sets standard dimensions for a base cabinet (height, depth).
    """
    DEPTH = 24  # inches (depth for base cabinets)
    HEIGHT = 36  # inches (height for base cabinets)

    def __init__(self, width):
        """
        Initializes a Base cabinet with the specified width.
        
        Args:
            width (int): The width of the base cabinet.
        """
        # Pass the required parameters using keyword arguments.
        super().__init__(name="B", width=width, height=Base.HEIGHT, depth=Base.DEPTH)


class BaseCorner(Base):
    """
    Represents a corner base cabinet. Inherits from the Base class.
    Only allows width values of 33 or 36 inches.
    """
    def __init__(self, width):
        """
        Initializes a BaseCorner cabinet with the specified width.
        
        Args:
            width (int): The width of the base corner cabinet (must be 33 or 36).
        
        Raises:
            ValueError: If the width is not 33 or 36 inches.
        """
        if width not in [33, 36]:  # Width must be 33 or 36 inches
            raise ValueError("Width must be either 33 or 36 inches.")
        super().__init__(width)
        self.name = f"BC{width}"


class Upper(Cabinet):
    """
    Represents an upper cabinet. Inherits from the Cabinet class.
    Sets a standard depth for upper cabinets.
    """
    DEPTH = 12  # inches (depth for upper cabinets)

    def __init__(self, width, height):
        """
        Initializes an Upper cabinet with the specified width and height.
        
        Args:
            width (int): The width of the upper cabinet.
            height (int): The height of the upper cabinet.
        """
        super().__init__(name="U", width=width, height=height, depth=Upper.DEPTH)


class UpperCorner(Upper):
    """
    Represents a corner upper cabinet. Inherits from the Upper class.
    Standardizes the width to 24 inches.
    """
    WIDTH = 24  # inches (width for corner upper cabinets)

    def __init__(self, height):
        """
        Initializes an UpperCorner cabinet with a standardized width and specified height.
        
        Args:
            height (int): The height of the upper corner cabinet.
        """
        super().__init__(width=UpperCorner.WIDTH, height=height)
        self.name = "UC24"


class Filler(Cabinet):
    """
    Represents a filler cabinet. Used to fill space in between other cabinets.
    Inherits from the Cabinet class.
    """
    def __init__(self, width):
        """
        Initializes a Filler cabinet with the specified width.
        Default values for height and depth are set to 0.
        
        Args:
            width (int): The width of the filler cabinet.
        """
        # Provide default values for height and depth if needed; adjust as appropriate.
        super().__init__(name="F", width=width, height=0, depth=0)
