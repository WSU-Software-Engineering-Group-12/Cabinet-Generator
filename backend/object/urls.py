from django.urls import path
from .views import place_cabinet, generate_wall

urlpatterns = [
    path('place_cabinet/', place_cabinet, name='place_cabinet'),
    path('generate_wall/', generate_wall, name='generate_wall')
]