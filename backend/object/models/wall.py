from .base_object import Object
from .cabinet import Cabinet

class Wall(Object):
    """
    Represents a wall in the system, which can have cabinets placed on it.
    It handles the wall's width and the process of filling it with cabinets.

    Attributes:
        bases (list): A list to store the base cabinets placed on the wall.
        uppers (list): A list to store the upper cabinets placed on the wall.
    """

    def __init__(self, *args, width=None, **kwargs):
        """
        Initializes a Wall object with a specified width.

        Args:
            width (float): The width of the wall (in inches).
        
        Raises:
            ValueError: If the width is not provided.
        """
        self.bases = []  # Initialize list to hold base cabinets.
        self.uppers = []  # Initialize list to hold upper cabinets.

        if(width is None):  # Ensure that the width is provided.
            raise ValueError(f"Error: Width ({width}) should be nonnull")
        
        kwargs["width"] = width  # Store the wall's width in the kwargs.

        super().__init__(*args, **kwargs)  # Call the parent constructor to initialize the object.

    def greedy_fill(self, remaining_width, cabinet_prefix):
        """
        Fills the wall greedily with cabinets and uses filler if needed to completely fill the width.
        
        Args:
            remaining_width (float): The remaining width to be filled on the wall.
            cabinet_prefix (str): The prefix for cabinet types, like 'B' for base cabinets.

        Returns:
            list: A list of cabinet identifiers (including filler cabinets if needed).
        """
        cabinets = []  # List to store the cabinet sizes placed.

        while remaining_width > 0:  # While there's still remaining space to fill.
            placed = False  # Track whether a cabinet was successfully placed.

            # Attempt to place a cabinet of any valid size that fits the remaining space.
            for size in Cabinet.VALID_SIZES:
                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break  # Exit the loop once a cabinet is placed.

            # If the remaining width is between 3 and 9 inches, and we have placed at least one cabinet,
            # try to reduce the last cabinet size by 6 inches to fit.
            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])  # Extract the size from the cabinet name.
                if last_size - 6 in Cabinet.VALID_SIZES:  # Check if reducing by 6 inches is valid.
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6  # Add back the reduced size to the remaining width.
                else:
                    cabinets.append(last_cabinet)

            if not placed:  # If no cabinet was placed, add a filler for the remaining space.
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0  # No remaining space after adding filler.

        return cabinets  # Return the list of placed cabinets (including fillers).

    def fixed_pattern_fill(self, remaining_width, cabinet_prefix):
        """
        Fills the wall with cabinets using a fixed pattern and includes filler as needed.
        
        Args:
            remaining_width (float): The remaining width to be filled on the wall.
            cabinet_prefix (str): The prefix for cabinet types, like 'B' for base cabinets.
        
        Returns:
            list: A list of cabinet identifiers (including filler cabinets if needed).
        """
        pattern = [33, 27, 24, 21, 18, 12, 9]  # Predefined pattern of cabinet sizes.
        cabinets = []  # List to store the cabinet sizes placed.

        while remaining_width > 0:
            placed = False  # Track whether a cabinet was successfully placed.

            # Attempt to place cabinets according to the fixed pattern.
            for size in pattern:
                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break  # Exit the loop once a cabinet is placed.

            # Same logic as in greedy_fill for handling the space between 3 and 9 inches.
            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])
                if last_size - 6 in Cabinet.VALID_SIZES:
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6
                else:
                    cabinets.append(last_cabinet)

            if not placed:  # If no cabinet was placed, add a filler.
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0

        return cabinets  # Return the list of placed cabinets (including fillers).

    def rotating1_fill(self, remaining_width, cabinet_prefix, pattern=None):
        """
        Fills the wall by rotating through a given pattern of cabinet sizes, 
        without repeating the same size consecutively.
        
        Args:
            remaining_width (float): The remaining width to be filled on the wall.
            cabinet_prefix (str): The prefix for cabinet types, like 'B' for base cabinets.
            pattern (list, optional): A custom pattern to use for filling (defaults to None).
        
        Returns:
            list: A list of cabinet identifiers (including filler cabinets if needed).
        """
        if pattern is None:
            pattern = [18, 36, 30, 21, 18, 15, 12, 9]  # Default pattern if none is provided.

        cabinets = []  # List to store the cabinet sizes placed.
        pattern_index = 0  # Index to track the current position in the pattern.
        pattern_len = len(pattern)  # Length of the pattern.

        while remaining_width > 0:
            attempted = 0  # Counter for how many attempts have been made to place a cabinet.
            placed = False  # Track whether a cabinet was successfully placed.

            # Rotate through the pattern and try to place a cabinet.
            while attempted < pattern_len:
                size = pattern[pattern_index % pattern_len]  # Get the next cabinet size in the pattern.
                pattern_index += 1  # Move to the next index in the pattern.
                attempted += 1

                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break  # Exit the loop once a cabinet is placed.

            # Same filler logic as in previous methods for handling small remaining widths.
            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])
                if last_size - 6 in Cabinet.VALID_SIZES:
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6
                else:
                    cabinets.append(last_cabinet)

            if not placed:  # If no cabinet was placed, add a filler.
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0

        return cabinets  # Return the list of placed cabinets (including fillers).

    # Methods for generating cabinets on the wall using different patterns.

    def generation_b1(self):
        """Generates base cabinets using the rotating1_fill method."""
        remaining_width = self.width - 36
        self.bases = self.rotating1_fill(remaining_width, "B")
        self.bases.append("BC36")

    def generation_b2(self):
        """Generates base cabinets using the greedy_fill method."""
        remaining_width = self.width - 72
        self.bases = self.greedy_fill(remaining_width, "B")

    def generation_b3(self):
        """Generates base cabinets using the fixed_pattern_fill method."""
        remaining_width = self.width - 36
        self.bases = self.fixed_pattern_fill(remaining_width, "B")
        self.bases.insert(0, "BC36")

    def generation_u1(self):
        """Generates upper cabinets using the greedy_fill method."""
        remaining_width = self.width - 24
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.append("UC24")

    def generation_u2(self):
        """Generates upper cabinets using the greedy_fill method."""
        remaining_width = self.width - 48
        self.uppers = self.greedy_fill(remaining_width, "U")

    def generation_u3(self):
        """Generates upper cabinets using the greedy_fill method."""
        remaining_width = self.width - 24
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.insert(0, "UC24")
