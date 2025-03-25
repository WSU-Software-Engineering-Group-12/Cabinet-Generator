from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models.cabinet import Cabinet
from .models.wall import Wall

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
    Endpoint to test cabinet layout generation.
    Expected JSON payload:
    {
        "width": <number>,
        "generation": "b1" | "b2" | "b3" | "u1" | "u2" | "u3"
    }
    """
    data = request.data
    print("generate_wall request data:", data)

    width = data.get("width")
    generation = data.get("generation", "b1") # Default to gen b1

    if width is None:
        return Response({"error": "Width is required"}, status=400)
    
    try:
        wall = Wall(width=width)
        if generation == "b1":
            wall.generation_b1()
            layout = {"bases": wall.bases}
        elif generation == "b2":
            wall.generation_b2()
            layout = {"bases": wall.bases}
        elif generation == "b3":
            wall.generation_b3()
            layout = {"bases": wall.bases}
        else:
            return Response({"error": "Invalid generation type."}, status=400)
        # TODO implement uppers

        # Extract width, height, and depth
        cabinet_details = []
        for cabinet in wall.bases:
            if cabinet[0] in ["B", "F"]: # Extract width
                try:
                    cab_width = int(cabinet[1:])
                    cab_height = Cabinet.STANDARD_HEIGHT
                    
                    # TODO change based on upper/lower status
                    cab_depth = Cabinet.STANDARD_BASE_DEPTH

                    cabinet_details.append({
                        "width": cab_width,
                        "height": cab_height,
                        "depth": cab_depth
                    })
                except ValueError:
                    print(f"Skipping invalid cabinet entry: {cabinet}")

        return Response({"cabinets": cabinet_details})
    except Exception as e:
        return Response({"error": str(e)}, status=500)