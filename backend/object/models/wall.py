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
            placed = False
            for size in Cabinet.VALID_SIZES:
                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break

            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])
                if last_size - 6 in Cabinet.VALID_SIZES:
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6
                else:
                    cabinets.append(last_cabinet)

            if not placed:
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0

        return cabinets

    def fixed_pattern_fill(self, remaining_width, cabinet_prefix):
        """Fills cabinets using a fixed pattern and includes filler as needed."""
        pattern = [33, 27, 24, 21, 18, 12, 9]
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
                last_size = int(last_cabinet[1:])
                if last_size - 6 in Cabinet.VALID_SIZES:
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6
                else:
                    cabinets.append(last_cabinet)

            if not placed:
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0

        return cabinets

    def rotating1_fill(self, remaining_width, cabinet_prefix, pattern=None):
        """Fills cabinets by rotating through a list without repeating the same size."""
        if pattern is None:
            pattern = [18, 36, 30, 21, 18, 15, 12, 9]

        cabinets = []
        pattern_index = 0
        pattern_len = len(pattern)

        while remaining_width > 0:
            attempted = 0
            placed = False

            while attempted < pattern_len:
                size = pattern[pattern_index % pattern_len]
                pattern_index += 1
                attempted += 1

                if size <= remaining_width:
                    cabinets.append(f"{cabinet_prefix}{size}")
                    remaining_width -= size
                    placed = True
                    break

            if 3 < remaining_width < 9 and len(cabinets) > 0:
                last_cabinet = cabinets.pop()
                last_size = int(last_cabinet[1:])
                if last_size - 6 in Cabinet.VALID_SIZES:
                    new_size = last_size - 6
                    cabinets.append(f"{cabinet_prefix}{new_size}")
                    remaining_width += 6
                else:
                    cabinets.append(last_cabinet)

            if not placed:
                cabinets.append(f"F{remaining_width}")
                remaining_width = 0

        return cabinets

    def generation_b1(self):
        remaining_width = self.width - 36
        self.bases = self.rotating1_fill(remaining_width, "B")
        self.bases.append("BC36")

    def generation_b2(self):
        remaining_width = self.width - 72
        self.bases = self.greedy_fill(remaining_width, "B")

    def generation_b3(self):
        remaining_width = self.width - 36
        self.bases = self.fixed_pattern_fill(remaining_width, "B")
        self.bases.insert(0, "BC36")

    def generation_u1(self):
        remaining_width = self.width - 24
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.append("UC24")

    def generation_u2(self):
        remaining_width = self.width - 48
        self.uppers = self.greedy_fill(remaining_width, "U")

    def generation_u3(self):
        remaining_width = self.width - 24
        self.uppers = self.greedy_fill(remaining_width, "U")
        self.uppers.insert(0, "UC24")