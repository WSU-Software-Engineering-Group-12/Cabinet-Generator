from django.db import models

class Object(models.Model):
    """
    **Abstract** base class for all objects in the system.\n
    NOTE: All dimensions (position, dimensions, etc) are in *inches* not *pixels*.

    Attributes:
        Public:
            get_dimensions() - dict: Returns the width, height, and depth of the object.\n
            get_position() - dict: Returns the x, y position of the object.\n
            move_to(x, y) - tuple: Moves the object to a specified (x, y) position on the canvas and returns the new position.\n

        Private:
            name - str: The name of the object.\n
            width - float: The width of the object (in inches).\n
            height - float: The height of the object (in inches).\n
            position_x - float: The x position of the object (in inches).\n
            position_y - float: The y position of the object (in inches).

    This model serves as an **abstract base class**, meaning that it is not instantiated directly,
    but rather inherited by other models, such as Cabinet or Obstacle, to provide common functionality.
    """

    # This class is abstract so that Cabinet and Obstacle can inherit from it
    class Meta:
        abstract = True
    
    # Public Methods
    def get_dimensions(self):
        """
        Returns the dimensions of the object in inches (width, height, depth).
        
        Returns:
            dict: A dictionary containing the width, height, and depth of the object.
        """
        return {'width': self.width, 'height': self.height, 'depth': self.depth}

    def get_position(self):
        """
        Returns the current position of the object on the canvas in inches (x, y).
        
        Returns:
            dict: A dictionary containing the x and y coordinates of the object's position.
        """
        return {'x': self.position_x, 'y': self.position_y}
    
    def move_to(self, x, y):
        """
        Moves the object to a new (x, y) position and returns the new position.
        
        Args:
            x (float): The new x-coordinate of the object.
            y (float): The new y-coordinate of the object.

        Returns:
            tuple: A tuple containing the new x and y coordinates of the object.
        """
        self.position_x = x
        self.position_y = y
        return (self.position_x, self.position_y)

    def __str__(self):
        """Returns the name of the object as a string."""
        return self.name
    
    # Model Fields (attributes that are mapped to database columns)
    name = models.CharField(max_length=100)  # Name of the object
    width = models.FloatField(default=0.0)   # Width in inches
    height = models.FloatField(default=0.0)  # Height in inches
    depth = models.FloatField(default=0.0)   # Depth in inches
    position_x = models.FloatField(default=0.0)  # X position in inches
    position_y = models.FloatField(default=0.0)  # Y position in inches
