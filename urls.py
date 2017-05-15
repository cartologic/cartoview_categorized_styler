# from django.conf.urls import patterns, url, include
# from django.views.generic import TemplateView
# from . import views, APP_NAME
#
# urlpatterns = patterns('',
#     url(r'^$', views.index, name='%s.index' % APP_NAME),
# )
from django.conf.urls import patterns, url
import views
from . import APP_NAME

urlpatterns = patterns('',
   url(r'^$', views.index, name='%s.index' % APP_NAME),
   url(r'^styles/(?P<layername>[^/]*)$', views.layer_styles, name='%s.layer_styles' % APP_NAME),
   url(r'^styles/save/(?P<layer_name>[^/]*)/(?P<style_name>[^/]*)$', views.save_style, name='%s.save_style' % APP_NAME),
   url(r'^proxy/geoserver/rest/(?P<suburl>.*)$', views.geoserver_rest_proxy, name='%s.proxy' % APP_NAME),
)
