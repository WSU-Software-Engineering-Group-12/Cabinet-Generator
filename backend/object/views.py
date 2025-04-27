from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models.cabinet import Cabinet
from .models.wall import Wall
import traceback

@api_view(['POST'])
def place_cabinet(request):
    """
    API endpoint to place a cabinet at a specified x and y position.

    This endpoint accepts a POST request with the following JSON payload:
    - cabinet: A dictionary containing the cabinet's attributes (name, width, height, depth).
    - x: The x-coordinate for positioning the cabinet.
    - y: The y-coordinate for positioning the cabinet.

    If successful, the endpoint will save the cabinet in the database and return its details.
    """
    
    print("Request data:", request.data)

    # Gather the needed data from the request (will be used to call place_cabinet from utils)
    cabinet_data = request.data.get('cabinet')
    print('cabinet data:', cabinet_data)
    x = request.data.get('x')
    y = request.data.get('y')

    # Ensure that all necessary data has been provided
    if not cabinet_data or not x or not y:
        return Response({'error': 'not all parameters entered for place_cabinet'}, status=400)
    
    try:
        print('about to place cabinet')
        # Create a new Cabinet object from the provided data
        cabinet = Cabinet(
            name=cabinet_data['name'],
            width=cabinet_data['width'],
            height=cabinet_data['height'],
            depth=cabinet_data['depth'],
            position_x=float(x),
            position_y=float(y)
        )
        print('placed cabinet')
        # Save the newly created cabinet to the database
        cabinet.save()
        print('saved cabinet')
    except KeyError as e:
        # Return an error if any key is missing in the cabinet data
        return Response({'error:' f'Missing key in cabinet data: {str(e)}'}, status=400)
    except Exception as e:
        # Return a general error for any exceptions that occur
        print(f"Exception occurred: {str(e)}")
        return Response({'error:', str(e)}, status=500)

    # Prepare the response data containing the cabinet's details
    response_data = {
        'name': cabinet.__str__(),
        'width': cabinet.get_dimensions()['width'],
        'height': cabinet.get_dimensions()['height'],
        'depth': cabinet.get_dimensions()['depth'],
        'position_x': cabinet.get_position()['x'],
        'position_y': cabinet.get_position()['y']
    }

    return Response({'placed_cabinet': response_data})

@api_view(['POST'])
def generate_wall(request):
    """
    Endpoint to generate a cabinet layout for a given wall width and generation type.

    This endpoint accepts a POST request with the following JSON payload:
    - width: The width of the wall (in inches).
    - orientation: The orientation of the wall (one of "left", "top", or "right").

    The response will return a layout of base and upper cabinets that fit within the wall's width.
    """
    
    data = request.data
    print("RECEIVED generate_wall request data:", data)

    # Retrieve the width and orientation from the request
    width = data.get("width")
    orientation = data.get("orientation")  # Can be left, right, or top

    # Ensure that the width is provided
    if width is None:
        return Response({"error": "Width is required"}, status=400)
    
    try:
        # Create a Wall object with the given width
        wall = Wall(width=width)

        # Generate cabinets based on the wall's orientation
        if orientation == "left":
            wall.generation_b1()  # Generate base cabinets using method b1
            wall.generation_u1()  # Generate upper cabinets using method u1
        elif orientation == "top":
            wall.generation_b2()  # Generate base cabinets using method b2
            wall.generation_u2()  # Generate upper cabinets using method u2
        elif orientation == "right":
            wall.generation_b1()  # Generate base cabinets using method b1
            wall.generation_u1()  # Generate upper cabinets using method u1
        else:
            # Raise an error if the orientation is not valid
            raise ValueError(f"{orientation} is not a valid entry for orientation type")

        # Prepare the response data with the generated cabinet layout
        response_data = {
            "cabinets": {
                "bases": extract_cabinet_details(wall.bases, is_base=True),
                "uppers": extract_cabinet_details(wall.uppers, is_base=False)
            }
        }

        print(f"Generated cabinets: {response_data}")
        return Response(response_data)
    
    except Exception as e:
        # Handle any exceptions and return the error in the response
        print("Error in generate_wall:", str(e))
        print(traceback.format_exc())
        return Response({"error": str(e)}, status=500)

# Helper function for generate_wall
def extract_cabinet_details(cabinets, is_base=True):
    """
    Extracts the details (name, width, height, depth) for each cabinet in the list.
    
    This function is used to format the cabinet data for the response of generate_wall.

    Args:
        cabinets (list): A list of cabinet names.
        is_base (bool): A flag to indicate whether the cabinets are base cabinets or upper cabinets.
    
    Returns:
        list: A list of dictionaries containing the cabinet details (name, width, height, depth).
    """
    cabinet_details = []
    for cabinet in cabinets:
        if cabinet[0] in ["B", "F", "U", "C"]:  # Consider all cabinet types
            try:
                # Handle special cases for corner cabinets
                if cabinet == "BC36":  # Base corner cabinet
                    cab_width = 36
                    cab_height = 36
                    cab_depth = 36
                    cabinet_details.append({
                        "name": cabinet,
                        "width": cab_width,
                        "height": cab_height,
                        "depth": cab_depth
                    })
                    continue
                if cabinet == "UC24":  # Upper corner cabinet
                    cab_width = 24
                    cab_height = 24
                    cab_depth = 24
                    cabinet_details.append({
                        "name": cabinet,
                        "width": cab_width,
                        "height": cab_height,
                        "depth": cab_depth
                    })
                    continue

                # Handle regular cabinets by extracting their dimensions
                cab_width = int(cabinet[1:]) if cabinet[1:].isdigit() else 0
                cab_height = Cabinet.STANDARD_HEIGHT
                cab_depth = (
                    Cabinet.STANDARD_BASE_DEPTH if is_base else Cabinet.STANDARD_UPPER_DEPTH
                )

                cabinet_details.append({
                    "name": cabinet,
                    "width": cab_width,
                    "height": cab_height,
                    "depth": cab_depth
                })
            except ValueError:
                # Skip invalid cabinet entries
                print(f"Skipping invalid cabinet entry: {cabinet}")
    return cabinet_details
