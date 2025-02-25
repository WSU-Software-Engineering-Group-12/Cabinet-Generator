from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Cabinet
from .utils import place_cabinet_on_canvas

# Create your views here.
@api_view(['POST'])
def place_cabinet(request):
    """
    API endpoint to place a cabinet at a specified x and y position
    """

    # Gather the needed data from the request (will be used to call place_cabinet from utils)
    cabinet_data = request.data.get('cabinet')
    x = request.data.get('x')
    y = request.data.get('y')

    if not cabinet_data or not x or not y:
        return Response({'error': 'not all parameters entered for place_cabinet'}, status=400)
    
    try:
        cabinet = Cabinet(
            name=cabinet_data['name'],
            width=cabinet_data['width'],
            height=cabinet_data['height']
        )
    except KeyError as e:
        return Response({'error:' f'Missing key in cabinet data: {str(e)}'}, status=400)

    placed_cabinet = place_cabinet_on_canvas(cabinet, float(x), float(y))

    return Response({'placed_cabinet': placed_cabinet})