from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models.cabinet import Cabinet
from .models.wall import Wall
import traceback

@api_view(['POST'])
def place_cabinet(request):
    """
    API endpoint to place a cabinet at a specified x and y position
    """

    print("Request data:", request.data)

    # Gather the needed data from the request (will be used to call place_cabinet from utils)
    cabinet_data = request.data.get('cabinet')
    print('cabinet data:', cabinet_data)
    x = request.data.get('x')
    y = request.data.get('y')

    if not cabinet_data or not x or not y:
        return Response({'error': 'not all parameters entered for place_cabinet'}, status=400)
    
    try:
        print('about to place cabinet')
        cabinet = Cabinet(
            name=cabinet_data['name'],
            width=cabinet_data['width'],
            height=cabinet_data['height'],
            depth=cabinet_data['depth'],
            position_x=float(x),
            position_y=float(y)
        )
        print('placed cabinet')
        cabinet.save()
        print('saved cabinet')
    except KeyError as e:
        return Response({'error:' f'Missing key in cabinet data: {str(e)}'}, status=400)
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return Response({'error:', str(e)}, status=500)

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

    ### Expected JSON payload:
    {
        "width": number,           # The width of the wall in inches
        "generation": string       # One of "b1", "b2", "b3", "u1", "u2", or "u3"
    }

    ### Response JSON format:
    {
        "cabinets": {
            "bases": [...],  # List of base cabinets
            "uppers": [...]  # List of upper cabinets
        }
    }
    """
    data = request.data
    print("RECIEVED generate_wall request data:", data)

    width = data.get("width")
    #generation = data.get("generation", "u3") # TODO get this from frontend

    if width is None:
        return Response({"error": "Width is required"}, status=400)
    
    try:
        wall = Wall(width=width)

        # TODO handle this dynamically
        wall.generation_b1()
        wall.generation_u1()

        response_data = {
            "cabinets": {
                "bases": extract_cabinet_details(wall.bases, is_base=True),
                "uppers": extract_cabinet_details(wall.uppers, is_base=False)
            }
        }

        print(f"Generated cabinets: {response_data}")
        return Response(response_data)
    
    except Exception as e:
        print("Error in generate_wall:", str(e))
        print(traceback.format_exc())
        return Response({"error": str(e)}, status=500)

# Helper function for generate_wall
def extract_cabinet_details(cabinets, is_base=True):
    cabinet_details = []
    for cabinet in cabinets:
        if cabinet[0] in ["B", "F", "U", "C"]:  # Consider all cabinet types
            try:
                # Manually input dimensions for corners
                if cabinet == "BC36": # Base corner
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
                if cabinet == "UC24": # Upper corner
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

                # Handle regular cabinets
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
                print(f"Skipping invalid cabinet entry: {cabinet}")
    return cabinet_details