from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('', include('AppParaisoVerde.urls')), 
    path('AppParaisoVerde/', include('AppParaisoVerde.urls')), 
]
