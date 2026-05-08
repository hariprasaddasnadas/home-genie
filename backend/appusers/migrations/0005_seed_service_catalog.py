from django.db import migrations


SERVICES = [
    {
        "slug": "ac-deep-cleaning",
        "name": "AC Deep Cleaning",
        "price": 599,
        "rating": 4.8,
        "description": "Jet-cleaned coils, filter wash, airflow check, and indoor unit hygiene.",
        "image": "https://images.pexels.com/photos/9242831/pexels-photo-9242831.jpeg?auto=compress&cs=tinysrgb&w=800",
        "keywords": ["ac", "air conditioner", "repairing", "cleaning", "servicing", "repair"],
        "details": "Ideal for homes that need better cooling performance, cleaner airflow, and routine maintenance for indoor AC units.",
        "duration": "60 to 90 minutes",
        "category": "Cooling Care",
        "available_pincodes": ["500001", "500032", "560001", "560037", "600001", "600100"],
        "questions": [
            {"id": "q1", "type": "number", "label": "How many ACs?", "min": 1, "max": 10, "default": 1, "isMultiplier": True},
            {"id": "q2", "type": "select", "label": "Type of ACs", "options": [{"label": "Split AC", "extra": 0}, {"label": "Window AC", "extra": -100}, {"label": "Both", "extra": 50}], "default": "Split AC"},
        ],
    },
    {
        "slug": "home-sanitization",
        "name": "Home Sanitization",
        "price": 1499,
        "rating": 4.9,
        "description": "Whole-home disinfection for kitchens, bedrooms, high-touch points, and surfaces.",
        "image": "https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=800",
        "keywords": ["home", "cleaning", "sanitization", "disinfection", "house"],
        "details": "A deeper hygiene-focused service for households that want high-touch and room-by-room sanitization support.",
        "duration": "2 to 3 hours",
        "category": "Home Hygiene",
        "available_pincodes": ["500001", "500032", "110001", "560001", "600001", "700001"],
        "questions": [
            {"id": "q1", "type": "select", "label": "Number of rooms", "options": [{"label": "1 RK", "extra": -500}, {"label": "1 BHK", "extra": 0}, {"label": "2 BHK", "extra": 500}, {"label": "3 BHK+", "extra": 1000}, {"label": "Villa/Independent House", "extra": 2000}], "default": "1 BHK"}
        ],
    },
    {
        "slug": "salon-at-home",
        "name": "Salon at Home",
        "price": 899,
        "rating": 4.7,
        "description": "Professional beauty services with premium products and hygienic setup.",
        "image": "https://images.pexels.com/photos/3993311/pexels-photo-3993311.jpeg?auto=compress&cs=tinysrgb&w=800",
        "keywords": ["salon", "hair styling", "beauty", "makeup", "facial", "spa", "haircut", "hair"],
        "details": "Convenient at-home salon support for grooming, styling, and self-care without visiting a salon.",
        "duration": "60 to 120 minutes",
        "category": "Beauty & Wellness",
        "available_pincodes": ["110001", "110048", "560001", "560037", "700001", "700091"],
        "questions": [
            {"id": "q1", "type": "select", "label": "Service For", "options": [{"label": "Women", "extra": 0}, {"label": "Men", "extra": -100}], "default": "Women"},
            {"id": "q2", "type": "select", "label": "Preference", "options": ["Women", "Men"], "default": "Women"},
            {"id": "q3", "type": "select", "label": "Service Type", "options": [{"label": "Only Cutting", "extra": -300}, {"label": "Haircut + Shampoo", "extra": 0}, {"label": "Full Grooming Package", "extra": 500}], "default": "Only Cutting"},
        ],
    },
    {
        "slug": "expert-electrician",
        "name": "Expert Electrician",
        "price": 149,
        "rating": 4.8,
        "description": "Quick fixes, safe diagnostics, fittings, switches, fans, and smart upgrades.",
        "image": "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=800",
        "keywords": ["electrician", "electrical", "repair", "fixing", "wiring", "switches", "lights", "fan"],
        "details": "Electrical troubleshooting and fitting support for homes that need fast, reliable technical assistance.",
        "duration": "30 to 60 minutes",
        "category": "Repair & Install",
        "available_pincodes": ["500001", "110001", "560001", "560037", "600001", "700001"],
        "questions": [
            {"id": "q1", "type": "select", "label": "Type of Service Needed", "options": [{"label": "Wiring Issue", "extra": 0}, {"label": "Switch Board Repair/Install", "extra": 50}, {"label": "Fan Repair/Install", "extra": 200}, {"label": "Lighting Install", "extra": 100}, {"label": "General Diagnostics", "extra": 50}], "default": "Wiring Issue"}
        ],
    },
]


def seed_services(apps, schema_editor):
    ServiceCatalog = apps.get_model("appusers", "ServiceCatalog")
    for service in SERVICES:
        ServiceCatalog.objects.update_or_create(slug=service["slug"], defaults=service)


def unseed_services(apps, schema_editor):
    ServiceCatalog = apps.get_model("appusers", "ServiceCatalog")
    ServiceCatalog.objects.filter(slug__in=[service["slug"] for service in SERVICES]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("appusers", "0004_servicecatalog_partnerserviceoffering_customerbooking"),
    ]

    operations = [
        migrations.RunPython(seed_services, unseed_services),
    ]
