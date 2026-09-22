import math
from decimal import Decimal


class GeoMatchingService:
    """
    Geo-matching service calculating haversine distance between consumer and farmer listings.
    Reduces transit time and guarantees fresher produce directly from local farms.
    """

    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance in kilometers between two points."""
        R = 6371.0  # Earth radius in kilometers

        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = math.sin(delta_phi / 2.0) ** 2 + \
            math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

        return round(R * c, 2)

    @classmethod
    def annotate_distance(cls, queryset, user_lat: float, user_lon: float, max_radius_km: float = None):
        listings_with_dist = []
        for listing in queryset:
            if listing.farm_latitude is not None and listing.farm_longitude is not None:
                dist = cls.haversine_distance(
                    float(user_lat), float(user_lon),
                    float(listing.farm_latitude), float(listing.farm_longitude)
                )
            else:
                dist = 50.0  # Default regional estimate if coordinates unassigned

            if max_radius_km is None or dist <= max_radius_km:
                listing.distance_km = dist
                listings_with_dist.append(listing)

        listings_with_dist.sort(key=lambda x: getattr(x, 'distance_km', 9999))
        return listings_with_dist
