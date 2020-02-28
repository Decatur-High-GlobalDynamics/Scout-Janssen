from django.views.static import serve as staticserve
import webapps.settings as settings
from django.urls import path

def serve(request, what):
   response = staticserve(request, what,
              document_root=settings.MEDIA_ROOT)
   response['Cache-Control'] = 'no-cache'
   return response