from django.urls import path, re_path
from . import views, APP_NAME


urlpatterns = [
    re_path(r'^$', views.index, name='%s.index' % APP_NAME),
    path('styles/<str:layername>/', views.layer_styles, name='%s.layer_styles' % APP_NAME),
    path('styles/save/<str:layer_name>/<str:style_name>', views.save_style, name='%s.save_style' % APP_NAME),
    re_path(r'^proxy/geoserver/rest/(?P<suburl>.*)$', views.geoserver_rest_proxy, name='%s.proxy' % APP_NAME),
]
