# This is a folder where we will put any logic needed for cabinets

def place_cabinet_on_canvas(cabinet, x, y):
    """
    This function places a cabinet on a Konva canvas (usually a room)

    Args:
        cabinet (Cabinet object): The cabinet object to be placed
        x: the x position to place the cabinet
        y: the y position to place the cabinet

    Returns:
        dict: Contains the cabinet name, width, height, and position
    """
    cabinet_position = {
        'name': cabinet.name,
        'width': cabinet.width,
        'height': cabinet.height,
        'position_x': x,
        'position_y': y
    }

    return cabinet_position