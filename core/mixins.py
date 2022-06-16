class CustomListModelMixin:
    """
    List a queryset.
    Use to pass the queryset to the self.get_paginated_response method
    """
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data, queryset)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)