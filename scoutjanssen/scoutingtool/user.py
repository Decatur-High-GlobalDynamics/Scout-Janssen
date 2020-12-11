from .models import *
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
content_type = ContentType.objects.get_for_model(Report)
permission = Permission.objects.create(codename = "can_submit_report", name="Can submit report", content_type=content_type)