import json
import random
import string
import requests
from django.shortcuts import render, HttpResponse
from django.contrib.auth.decorators import login_required
from . import APP_NAME, __version__

from geonode.layers.views import _resolve_layer, _PERMISSION_MSG_MODIFY
from geonode.geoserver.helpers import ogc_server_settings, set_styles
from django.http import QueryDict
from geoserver.catalog import Catalog

@login_required
def index(request):
    context = {
        "v": __version__
    }
    return render(request, "%s/index.html" % APP_NAME, context)

@login_required
def layer_styles(request, layername):
    layer = _resolve_layer(request, layername, 'base.view_resourcebase')
    styles = []
    for style in layer.styles.all():
        styles.append({
            'name': style.name,
            'url': style.absolute_url(),
            'title': style.sld_title or style.name
        })
    return HttpResponse(json.dumps(styles), content_type="text/json")


username, password = ogc_server_settings.credentials
gs_catalog = Catalog(ogc_server_settings.internal_rest, username, password)

@login_required
def save_style(request, layer_name, style_name):
    layer = _resolve_layer(
        request,
        layer_name,
        'base.change_resourcebase',
        _PERMISSION_MSG_MODIFY)
    res = dict(success=True)
    # try:
    style = gs_catalog.get_style(style_name)
    new = style is None
    xml = request.body
    gs_catalog.create_style(style_name, xml, True)
    if new:
        style = gs_catalog.get_style(style_name)
        gs_layer = gs_catalog.get_layer(layer_name)
        gs_layer.styles += [style,]
        gs_catalog.save(gs_layer)
    set_styles(layer, gs_catalog)
    # except:
    #     res["success"] = False
    return HttpResponse(json.dumps(res), content_type="text/json")
