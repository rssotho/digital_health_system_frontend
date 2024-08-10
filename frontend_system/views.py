from django.shortcuts import render

def sign_up(request):
    return render(request, 'sign_up/sign_up.html')

def login(request):
    return render(request, 'sign_up/login.html')

def reset_password(request):
    return render(request, 'sign_up/reset_password.html')

def home(request):
    return render(request, 'sign_up/base.html')

def user_management(request):
    return render(request, 'sign_up/user_management.html')