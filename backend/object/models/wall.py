from .base_object import Object
from .cabinet import Cabinet

class Wall(Object):
    """Handles the wall sizes as well as their owned cabinets"""
    def __init__(self, *args, width=None, **kwargs):
        self.bases = []
        self.uppers = []

        if(width == None):
            raise ValueError(f"Error: Width ({width}) should be nonnull")
        
        kwargs["width"] = width

        super().__init__(*args, **kwargs)
    
    def greedy_fill(self, remaining_width, cabinet_prefix):
        """Fills cabinets greedily and uses filler if needed."""
        cabinets = []

        while remaining_width > 0:
            placed = False  # Track if a cabinet was placed
            for size in Cabinet.VALID_SIZES:
                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break  # Restart loop to try the largest possible cabinet
            
            # Adjust the previous cabinet if the remaining width is between 3 and 9 inches
            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])  # Extract size from name
                if last_size - 6 in Cabinet.VALID_SIZES:  # Ensure new size is valid
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6  # Restore the removed width
                else:
                    cabinets.append(last_cabinet)  # Re-add the last cabinet if adjustment isn't possible
            
            # If no cabinet fits, add filler
            if not placed:
                cabinets.append(f"F{remaining_width}")  # Use the remaining space as filler
                remaining_width = 0  # Stop loop

        return cabinets
    
    def fixed_pattern_fill(self, remaining_width, cabinet_prefix):
        """Fills cabinets using a fixed pattern and includes filler as needed."""
        pattern = [27, 24, 21, 18, 12, 9]
        cabinets = []

        while remaining_width > 0:
            placed = False
            for size in pattern:
                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break
                
            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])  # Extract size from name
                if last_size - 6 in Cabinet.VALID_SIZES:  # Ensure new size is valid
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6  # Restore the removed width
                else:
                    cabinets.append(last_cabinet)  # Re-add the last cabinet if adjustment isn't possible
            
            # If no cabinet fits but space is left, add filler
            if not placed:
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0
        
        return cabinets

    def generation_b1(self):
        remaining_width = self.width - 36  # Leave space for Base Corner
        self.bases = self.greedy_fill(remaining_width, "B")
        self.bases.append("BC36")  # Add Base Corner at the end

    def generation_b2(self):
        remaining_width = self.width - 72 # Leave space for Base Corner
        self.bases = self.fixed_pattern_fill(remaining_width, "B")  # No Base Corner added

    def generation_b3(self):
        remaining_width = self.width - 36  # Leave space for Base Corner
        self.bases = self.greedy_fill(remaining_width, "B")
        self.bases.insert(0, "BC36")  # Add Base Corner at the beginning

    def generation_u1(self):
        remaining_width = self.width - 24  # Leave space for Upper Corner
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.append("UC24")  # Add Upper Corner at the end

    def generation_u2(self):
        remaining_width = self.width - 48 # Leave space for Base Corner
        self.uppers = self.greedy_fill(remaining_width, "U")  # No Upper Corner added

    def generation_u3(self):
        remaining_width = self.width - 24  # Leave space for Upper Corner
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.insert(0, "UC24")  # Add Upper Corner at the beginning