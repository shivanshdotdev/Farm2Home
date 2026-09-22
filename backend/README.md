# Dhwaj (ध्वज) - Smart India Hackathon 2026 Backend

> **Direct Farmer-to-Consumer Agricultural Platform** eliminating middlemen, enforcing Government Minimum Support Price (MSP) price floors, verifying citizen & farmer identities via national registries (Aadhaar, DigiLocker, AgriStack, KCC, Bhulekh DILRMP), securing transactions via Escrow (Tazapay / Razorpay), coordinating logistics (Delhivery & Porter), resolving disputes with mandatory unboxing video proof & automated fault matrix refunds, and providing automated WhatsApp bot support.

---

## 🏛️ Architecture & Core Components

```
Frontend (Web / Mobile / WhatsApp)
      │
      ▼ (REST API / JSON / JWT)
┌─────────────────────────────────────────────────────────────────────────────┐
│                       Django REST Framework Backend                         │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │ 1. Auth & Identity    │  │ 2. Farmer Verification│  │ 3. Marketplace  │  │
│  │  • Aadhaar OTP (Setu) │  │  • AgriStack State DB │  │  • MSP Floor    │  │
│  │  • DigiLocker OAuth   │  │  • JanSamarth KCC     │  │    Enforcement  │  │
│  │  • SHA-256 Unique DB  │  │  • Bhulekh Land Name  │  │  • Geo-matching │  │
│  │    Constraint         │  │    Cross-matching     │  │  • Search/Filter│  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │ 4. Orders & Escrow    │  │ 5. Disputes & Fault   │  │ 6. Support &    │  │
│  │  • Tazapay / Razorpay │  │    Matrix             │  │    Schemes      │  │
│  │    Escrow Vault       │  │  • Mandatory Video    │  │  • WhatsApp Bot │  │
│  │  • Delhivery & Porter │  │    Proof Check        │  │    AutoReply    │  │
│  │    Rate Calculator    │  │  • Partial / Full     │  │  • PM-KISAN,    │  │
│  │  • Order Lifecycle    │  │    Refund Matrix      │  │    AgriStack,   │  │
│  │    State Machine      │  │  • Carrier Insurance  │  │    PMFBY Feed   │  │
│  └───────────────────────┘  └───────────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                        Django ORM (Supabase PostgreSQL / SQLite)
```

---

## 📡 API Endpoint Reference (Handwritten Spec Implementation)

### 1. Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Standard registration with phone and role (`FARMER` or `CONSUMER`). |
| `POST` | `/api/auth/login/` | Phone/Password login returning JWT Access and Refresh tokens. |
| `POST` | `/api/auth/aadhaar/gen-otp/` | Generates 6-digit Aadhaar OTP via UIDAI/Setu sandbox. |
| `POST` | `/api/auth/aadhaar/verify-otp/` | Verifies Aadhaar OTP, generates SHA-256 identity hash with unique constraint, creates/links user UUID, and returns JWT. |
| `GET` | `/api/auth/digilocker/url/` | Returns consent URL for DigiLocker OAuth 2.0 sandbox login. |
| `POST` | `/api/auth/digilocker/callback/` | Exchanges auth code for verified citizen profile and logs in or creates user. |
| `GET` | `/api/auth/me/` | Retrieves authenticated user profile and verification status. |

### 2. Farmer Verification (`/api/farmer/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/farmer/verify/` | Verifies farmer identity via **AgriStack ID**, **Kisan Credit Card (KCC)**, or **Bhulekh (DILRMP)** land record name matching. Issues verified badge ID. |
| `GET` | `/api/farmer/profile/` | Retrieves farmer verification details, land acreage, and badge ID. |

### 3. Marketplace & MSP Floor (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/msp/` | Public master list of Government Minimum Support Prices (MSP) across seasons. |
| `POST` | `/api/listings/create/` | **Farmer listing creation**: Strictly rejects any listing priced below the official Government MSP rate! |
| `GET` | `/api/listings/my/` | Retrieves all listings published by the authenticated farmer. |
| `GET` | `/api/listings/` | **Consumer browse**: Supports filters (`crop`, `category`, `max_price`, `pincode`) and **Geo-matching** proximity distance calculation (`lat`, `lon`, `radius_km`). |
| `GET` | `/api/listings/<id>/` | Common detailed view of a produce listing with verified farmer badge. |

### 4. Orders & Escrow (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/logistics/quote/` | Real-time freight quote calculation comparing **Delhivery** and **Porter Mini Truck** based on weight and origin/destination pincodes. |
| `POST` | `/api/orders/create/` | **Consumer creates order**: Automatically calculates freight, deducts stock, creates **Tazapay / Razorpay Escrow** transaction, and locks funds. |
| `GET` | `/api/orders/my/` | Order history (sales orders for Farmers, purchase orders for Consumers). |
| `GET` | `/api/orders/<id>/` | Common order detail including escrow status and logistics tracking. |
| `PUT` | `/api/orders/<id>/status/` | Role-guarded lifecycle transitions (`DISPATCHED` -> `IN_TRANSIT` -> `DELIVERED` -> `COMPLETED`). Marking `COMPLETED` automatically releases Escrow funds to the farmer. |

### 5. Disputes & Fault Matrix (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/orders/<id>/dispute/` | **Raises dispute**: **Mandatory unboxing video proof URL is required**. Automatically triggers the **Dispute Fault Matrix** to calculate fault attribution (`FARMER`, `LOGISTICS`, `SPLIT`) and processes full/partial refund from Escrow. |
| `GET` | `/api/orders/<id>/dispute/detail/` | View dispute investigation notes, refund breakdown, and carrier insurance claim status. |

### 6. WhatsApp Support Bot & Schemes (`/api/`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/support/whatsapp/` | Meta WhatsApp Cloud Webhook challenge verification. |
| `POST` | `/api/support/whatsapp/` | Handles incoming WhatsApp messages with automated multi-lingual replies (Order tracking, MSP check, dispute filing, government schemes, human agent escalation). |
| `GET` | `/api/schemes/` | Public feed of Government Agricultural Schemes (PM-KISAN, AgriStack, PMFBY, Soil Health Card). |
| `GET` | `/api/support/tickets/` | Support tickets list for user or admin inspection. |

---

## 🚀 Setup & Execution Instructions (via `uv`)

This project is configured with **Astral `uv`** for ultra-fast dependency management, locking, and single-command execution.

### 1. One-Command Launch (Recommended)
You can launch the entire backend, auto-verify migrations, and start the development server with just:
```bash
uv run main.py
# or
uv run entrypoint.py
```

### 2. Configure Environment Variables
Edit `.env` as needed:
```env
# Leave blank to use local SQLite, or paste Supabase PostgreSQL URL:
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### 3. Run Migrations & Seed Data via `uv`
```bash
uv run python manage.py migrate
uv run python manage.py seed_data
```
The `seed_data` command seeds:
- 12 official Government MSP crop rates (Wheat ₹22.75/kg, Paddy ₹21.83/kg, Mustard ₹56.50/kg, Tomato ₹18.00/kg, etc.)
- Sample pre-verified farmers with AgriStack & KCC badges (`+919876500001`, `+919876500002` / `Farmer@123`)
- Sample verified consumer account (`+919876500004` / `Consumer@123`)
- Sample farm listings adhering to MSP floors
- Active Government Agricultural Schemes

### 4. Run Automated Test Suite via `uv`
```bash
uv run python manage.py test
```
*(Runs all 12 unit and integration tests with zero configuration!)*

### 5. Interactive Documentation & Endpoints
Once running, open your browser to:
- Interactive Swagger UI: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)
- ReDoc UI: [http://127.0.0.1:8000/api/redoc/](http://127.0.0.1:8000/api/redoc/)
- API Root Index: [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)
- OpenAPI Schema: [http://127.0.0.1:8000/api/schema/](http://127.0.0.1:8000/api/schema/)
