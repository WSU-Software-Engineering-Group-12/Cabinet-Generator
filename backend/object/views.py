from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cabinet

# Create your views here.
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
            _name=cabinet_data['name'],
            _width=cabinet_data['width'],
            _height=cabinet_data['height'],
            _position_x=float(x),
            _position_y=float(y)
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
        'width': cabinet.get_dimensions()[0],
        'height': cabinet.get_dimensions()[1],
        'position_x': cabinet.get_position()[0],
        'position_y': cabinet.get_position()[1]
    }

    return Response({'placed_cabinet': response_data})