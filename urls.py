from django.conf.urls import patterns, url, include
import views
from . import APP_NAME
from .api import StylersResource
from tastypie.api import Api
api = Api(api_name='stylers-api')
api.register(StylersResource())
urlpatterns = patterns('',
                       url(r'^$', views.index, name='%s.index' % APP_NAME),
                       url(r'^styles/(?P<layername>[^/]*)$',
                           views.layer_styles, name='%s.layer_styles' % APP_NAME),
                       url(r'^styles/save/(?P<layer_name>[^/]*)/(?P<style_name>[^/]*)$',
                           views.save_style, name='%s.save_style' % APP_NAME),
                       url(r'^proxy/geoserver/rest/(?P<suburl>.*)$',
                           views.geoserver_rest_proxy, name='%s.proxy' % APP_NAME),
                       url(r'^', include(api.urls)),
                       )
