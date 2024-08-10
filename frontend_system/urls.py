from django.urls import path
from . import views

urlpatterns = [
    path('sign_up/', views.sign_up, name='sign_up'),
    path('login/', views.login, name='login'),
    path('reset_password/', views.reset_password, name='reset_password'),
    path('home/', views.home, name='home'),
    path('user_management/', views.user_management, name='user_management'),
]
