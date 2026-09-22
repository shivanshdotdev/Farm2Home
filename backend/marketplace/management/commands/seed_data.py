from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from authentication.models import CustomUser, compute_sha256_hash
from farmer_verification.models import FarmerProfile
from marketplace.models import GovernmentMSP, ProductListing, CropCategoryChoices
from support_and_schemes.models import GovernmentScheme, GovernmentSchemeCategory


class Command(BaseCommand):
    help = "Seeds database with official MSP rates, verified farmers, consumer test accounts, sample listings, and schemes."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("[+] Starting Dhwaj SIH 2026 data seeding..."))

        # 1. Seed Government MSP Master Records
        msp_data = [
            {"crop": "Wheat", "category": CropCategoryChoices.GRAINS, "quintal": Decimal('2275.00')},
            {"crop": "Paddy (Common)", "category": CropCategoryChoices.GRAINS, "quintal": Decimal('2183.00')},
            {"crop": "Paddy (Grade A)", "category": CropCategoryChoices.GRAINS, "quintal": Decimal('2203.00')},
            {"crop": "Mustard", "category": CropCategoryChoices.OILSEEDS, "quintal": Decimal('5650.00')},
            {"crop": "Gram (Chana)", "category": CropCategoryChoices.PULSES, "quintal": Decimal('5440.00')},
            {"crop": "Maize", "category": CropCategoryChoices.GRAINS, "quintal": Decimal('2090.00')},
            {"crop": "Soybean (Yellow)", "category": CropCategoryChoices.OILSEEDS, "quintal": Decimal('4600.00')},
            {"crop": "Cotton (Medium Staple)", "category": CropCategoryChoices.COMMERCIAL, "quintal": Decimal('6620.00')},
            {"crop": "Tur (Arhar)", "category": CropCategoryChoices.PULSES, "quintal": Decimal('7000.00')},
            {"crop": "Potato", "category": CropCategoryChoices.VEGETABLES, "quintal": Decimal('1500.00')},
            {"crop": "Tomato", "category": CropCategoryChoices.VEGETABLES, "quintal": Decimal('1800.00')},
            {"crop": "Onion", "category": CropCategoryChoices.VEGETABLES, "quintal": Decimal('2000.00')},
        ]

        for item in msp_data:
            kg_rate = (item["quintal"] / Decimal('100.00')).quantize(Decimal('0.01'))
            GovernmentMSP.objects.update_or_create(
                crop_name=item["crop"],
                defaults={
                    "category": item["category"],
                    "msp_per_quintal": item["quintal"],
                    "msp_per_kg": kg_rate,
                    "marketing_season": "2025-2026",
                    "is_active": True
                }
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(msp_data)} Government MSP crop records."))

        # 2. Seed Verified Farmers
        # Farmer 1: AgriStack Verified
        f1_phone = "+919876500001"
        farmer1, _ = CustomUser.objects.get_or_create(
            phone_number=f1_phone,
            defaults={
                "username": f1_phone,
                "role": CustomUser.RoleChoices.FARMER,
                "full_name": "Ramesh Singh Kumar",
                "identity_hash": compute_sha256_hash("123456789012"),
                "aadhaar_last4": "9012",
                "is_identity_verified": True,
                "verification_source": "AGRISTACK",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "pincode": "221001",
                "address": "Village Chiraigaon, Post Shivpur",
                "latitude": Decimal('25.352100'),
                "longitude": Decimal('82.998400'),
            }
        )
        farmer1.set_password("Farmer@123")
        farmer1.save()

        profile1, _ = FarmerProfile.objects.get_or_create(user=farmer1)
        profile1.mark_as_verified(
            method=FarmerProfile.VerificationTypeChoices.AGRISTACK,
            meta={
                "registry": "AgriStack State Registry",
                "agristack_id": "AGRI-UP-2026-9812",
                "state_database": "Uttar Pradesh",
                "crop_survey_eligible": True
            }
        )
        profile1.agristack_id = "AGRI-UP-2026-9812"
        profile1.land_holding_acres = Decimal('4.5')
        profile1.save()

        # Farmer 2: KCC Verified
        f2_phone = "+919876500002"
        farmer2, _ = CustomUser.objects.get_or_create(
            phone_number=f2_phone,
            defaults={
                "username": f2_phone,
                "role": CustomUser.RoleChoices.FARMER,
                "full_name": "Suresh Bhai Patel",
                "identity_hash": compute_sha256_hash("234567890123"),
                "aadhaar_last4": "0123",
                "is_identity_verified": True,
                "verification_source": "KCC",
                "state": "Gujarat",
                "district": "Anand",
                "pincode": "388001",
                "address": "Boriavi Road, Anand",
                "latitude": Decimal('22.564500'),
                "longitude": Decimal('72.928900'),
            }
        )
        farmer2.set_password("Farmer@123")
        farmer2.save()

        profile2, _ = FarmerProfile.objects.get_or_create(user=farmer2)
        profile2.mark_as_verified(
            method=FarmerProfile.VerificationTypeChoices.KCC,
            meta={"registry": "JanSamarth KCC (NABARD)", "kcc_number": "KCC-SBIN-77621"}
        )
        profile2.kcc_number = "KCC-SBIN-77621"
        profile2.land_holding_acres = Decimal('6.0')
        profile2.save()

        # 3. Seed Verified Consumer
        c_phone = "+919876500004"
        consumer, _ = CustomUser.objects.get_or_create(
            phone_number=c_phone,
            defaults={
                "username": c_phone,
                "role": CustomUser.RoleChoices.CONSUMER,
                "full_name": "Priya Sharma",
                "identity_hash": compute_sha256_hash("345678901234"),
                "aadhaar_last4": "1234",
                "is_identity_verified": True,
                "verification_source": "AADHAAR_OTP",
                "state": "Uttar Pradesh",
                "district": "Varanasi",
                "pincode": "221005",
                "address": "B-12, Lanka, Varanasi",
                "latitude": Decimal('25.281500'),
                "longitude": Decimal('82.999500'),
            }
        )
        consumer.set_password("Consumer@123")
        consumer.save()

        self.stdout.write(self.style.SUCCESS("[OK] Seeded verified farmer and consumer test profiles."))

        # 4. Seed Product Listings (above MSP floor!)
        listings = [
            {
                "farmer": farmer1,
                "crop_name": "Wheat",
                "category": CropCategoryChoices.GRAINS,
                "variety": "Sharbati Golden Grain",
                "description": "Premium Sharbati wheat, hand-harvested and naturally sun-dried. High protein content.",
                "qty": Decimal('2500.00'),
                "price": Decimal('26.50'),  # MSP is 22.75 -> Valid!
                "farm_pincode": "221001",
                "farm_state": "Uttar Pradesh",
                "farm_district": "Varanasi",
                "farm_lat": Decimal('25.352100'),
                "farm_lon": Decimal('82.998400'),
                "image_url": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b",
                "organic": True
            },
            {
                "farmer": farmer1,
                "crop_name": "Mustard",
                "category": CropCategoryChoices.OILSEEDS,
                "variety": "Pusa Bold Black Mustard",
                "description": "High oil-content mustard direct from farm. Cleaned and graded.",
                "qty": Decimal('1200.00'),
                "price": Decimal('62.00'),  # MSP is 56.50 -> Valid!
                "farm_pincode": "221001",
                "farm_state": "Uttar Pradesh",
                "farm_district": "Varanasi",
                "farm_lat": Decimal('25.352100'),
                "farm_lon": Decimal('82.998400'),
                "image_url": "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed",
                "organic": False
            },
            {
                "farmer": farmer2,
                "crop_name": "Tomato",
                "category": CropCategoryChoices.VEGETABLES,
                "variety": "Hybrid Red Farm Fresh",
                "description": "Freshly plucked vine-ripened tomatoes. Immediate transit available.",
                "qty": Decimal('800.00'),
                "price": Decimal('24.00'),  # MSP is 18.00 -> Valid!
                "farm_pincode": "388001",
                "farm_state": "Gujarat",
                "farm_district": "Anand",
                "farm_lat": Decimal('22.564500'),
                "farm_lon": Decimal('72.928900'),
                "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea",
                "organic": True
            }
        ]

        for item in listings:
            ProductListing.objects.update_or_create(
                farmer=item["farmer"],
                crop_name=item["crop_name"],
                variety=item["variety"],
                defaults={
                    "category": item["category"],
                    "description": item["description"],
                    "quantity_available_kg": item["qty"],
                    "price_per_kg": item["price"],
                    "harvest_date": timezone.now().date(),
                    "farm_pincode": item["farm_pincode"],
                    "farm_state": item["farm_state"],
                    "farm_district": item["farm_district"],
                    "farm_latitude": item["farm_lat"],
                    "farm_longitude": item["farm_lon"],
                    "image_url": item["image_url"],
                    "is_organic": item["organic"],
                    "is_active": True
                }
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] Seeded {len(listings)} sample produce listings with MSP floor."))

        # 5. Seed Government Agricultural Schemes
        schemes = [
            {
                "title": "PM-KISAN Samman Nidhi Yojana",
                "category": GovernmentSchemeCategory.FINANCIAL_SUPPORT,
                "description": "Direct financial assistance of Rs. 6,000 per year transferred into bank accounts of eligible landholder farmers.",
                "eligibility": "All landholding farmer families with cultivable land holdings in their names.",
                "benefits_summary": "Rs. 2,000 direct benefit transferred three times annually via Aadhaar-linked DBT.",
                "portal_url": "https://pmkisan.gov.in"
            },
            {
                "title": "AgriStack - Digital Public Infrastructure",
                "category": GovernmentSchemeCategory.DIGITIZATION,
                "description": "Government initiative creating digital Farmer Registry, Geo-referenced crop sowing registry, and digital land integration.",
                "eligibility": "All farmers nationwide.",
                "benefits_summary": "Pre-approved institutional credit, seamless insurance claims, and government subsidy access.",
                "portal_url": "https://agristack.gov.in"
            },
            {
                "title": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "category": GovernmentSchemeCategory.INSURANCE,
                "description": "Comprehensive risk insurance covering yield losses due to non-preventable natural risks.",
                "eligibility": "All farmers including sharecroppers and tenant farmers growing notified crops.",
                "benefits_summary": "Low premium of 1.5% - 2% for food crops with prompt claim settlement directly to bank accounts.",
                "portal_url": "https://pmfby.gov.in"
            },
        ]

        for s in schemes:
            GovernmentScheme.objects.update_or_create(
                title=s["title"],
                defaults=s
            )
        self.stdout.write(self.style.SUCCESS("[OK] Seeded Government Agricultural Schemes."))
        self.stdout.write(self.style.SUCCESS("[SUCCESS] Seeding complete successfully!"))
