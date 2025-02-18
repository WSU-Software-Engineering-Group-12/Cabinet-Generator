from django.urls import path
from .views import place_cabinet

urlpatterns = [
    path('place_cabinet/', place_cabinet, name='place_cabinet')
]