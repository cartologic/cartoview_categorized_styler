from geonode.api.resourcebase_api import LayerResource


class StylersResource(LayerResource):
    def apply_filters(self, request, applicable_filters):
        from guardian.shortcuts import get_objects_for_user
        filtered = super(StylersResource, self).apply_filters(
            request,
            applicable_filters)
        allowed = get_objects_for_user(request.user, "change_layer_style", filtered)
        return allowed

    class Meta(LayerResource.Meta):
        resource_name = "layers"
