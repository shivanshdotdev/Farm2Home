import secrets
from decimal import Decimal
from django.utils import timezone
from .models import SupportTicket, GovernmentScheme
from marketplace.models import GovernmentMSP
from orders_and_logistics.models import Order
from authentication.models import CustomUser


class WhatsAppBotService:
    """
    WhatsApp Business Bot Engine:
    Assists farmers and consumers with low digital literacy through auto-replies,
    order status lookups, MSP price queries, and support ticketing.
    """

    MENU_TEXT = (
        "🌾 *Welcome to Dhwaj - Smart India Hackathon 2026 Support* 🌾\n"
        "Direct Farmer-to-Consumer Agricultural Platform\n\n"
        "Please reply with a number to choose an option:\n"
        "1️⃣ *Order Status* - Reply `1 <order_id>` to track your shipment\n"
        "2️⃣ *MSP Price Check* - Reply `2 <crop>` (e.g. `2 Wheat`) to see government minimum rates\n"
        "3️⃣ *Report an Issue* - Reply `3 <description>` to file a complaint or dispute\n"
        "4️⃣ *Government Schemes* - Reply `4` for PM-KISAN, AgriStack & PMFBY updates\n"
        "5️⃣ *Speak to Agent* - Reply `5` to connect with a support representative\n\n"
        "आप हिंदी में भी जानकारी ले सकते हैं। (Reply `HINDI` for Hindi menu)"
    )

    HINDI_MENU_TEXT = (
        "🌾 *ध्वज (Dhwaj) किसान सहायता सेवा में आपका स्वागत है* 🌾\n\n"
        "कृपया विकल्प चुनने के लिए संख्या लिखकर भेजें:\n"
        "1️⃣ *ऑर्डर की स्थिति* - `1 <order_id>` भेजें\n"
        "2️⃣ *न्यूनतम समर्थन मूल्य (MSP) जांचें* - `2 <फसल>` (उदा. `2 Gehu`) भेजें\n"
        "3️⃣ *शिकायत दर्ज करें* - `3 <विवरण>` भेजें\n"
        "4️⃣ *सरकारी योजनाएं* - `4` भेजें (पीएम किसान, एग्रीस्टैक)\n"
        "5️⃣ *अधिकारी से बात करें* - `5` भेजें"
    )

    @classmethod
    def process_incoming_message(cls, sender_phone: str, message_body: str) -> dict:
        clean_msg = message_body.strip()
        tokens = clean_msg.split(maxsplit=1)
        command = tokens[0].upper()
        arg = tokens[1].strip() if len(tokens) > 1 else ""

        # Find or link user
        user = CustomUser.objects.filter(phone_number__endswith=sender_phone[-10:]).first()

        # Ticket tracking
        ticket = SupportTicket.objects.filter(
            phone_number=sender_phone,
            status__in=[SupportTicket.StatusChoices.OPEN, SupportTicket.StatusChoices.ESCALATED_AGENT]
        ).first()

        if not ticket:
            ticket = SupportTicket.objects.create(
                ticket_number=f"TKT-{secrets.token_hex(4).upper()}",
                phone_number=sender_phone,
                user=user,
                channel=SupportTicket.ChannelChoices.WHATSAPP,
                subject=f"WhatsApp Inquiry from {sender_phone}",
                status=SupportTicket.StatusChoices.OPEN,
                conversation_log=[]
            )

        ticket.conversation_log.append({
            "sender": "USER",
            "message": clean_msg,
            "timestamp": timezone.now().isoformat()
        })

        # Decision tree
        if command in ('HINDI', 'HI'):
            reply = cls.HINDI_MENU_TEXT
        elif command == '1':
            reply = cls._handle_order_status(arg, sender_phone)
        elif command == '2':
            reply = cls._handle_msp_check(arg)
        elif command == '3':
            reply = cls._handle_complaint(arg, ticket)
        elif command == '4':
            reply = cls._handle_schemes()
        elif command == '5':
            ticket.status = SupportTicket.StatusChoices.ESCALATED_AGENT
            ticket.save()
            reply = (
                f"👨‍🌾 *Ticket #{ticket.ticket_number} Escalated*\n\n"
                "A customer support officer has been assigned to your query and will contact you shortly on WhatsApp or phone."
            )
        else:
            reply = cls.MENU_TEXT

        ticket.conversation_log.append({
            "sender": "BOT",
            "message": reply,
            "timestamp": timezone.now().isoformat()
        })
        ticket.save()

        return {
            "recipient": sender_phone,
            "reply_text": reply,
            "ticket_number": ticket.ticket_number,
            "status": ticket.status
        }

    @classmethod
    def _handle_order_status(cls, order_arg: str, phone: str) -> str:
        if not order_arg:
            # Look up recent order for this phone
            order = Order.objects.filter(buyer_phone__endswith=phone[-10:]).order_by('-created_at').first()
        else:
            order = Order.objects.filter(id__startswith=order_arg).first()

        if not order:
            return (
                "❌ *Order Not Found*\n"
                "Please provide a valid Order ID (e.g. `1 f3b8...`) or check if your phone number matches the order."
            )

        tracking_info = f"\n📦 Tracking No: `{order.tracking_number}` ({order.get_logistics_partner_display()})" if order.tracking_number else ""
        return (
            f"📦 *Order Status Update*\n\n"
            f"• Order ID: `#{str(order.id)[:8]}`\n"
            f"• Produce: *{order.listing.crop_name}* ({order.quantity_kg} kg)\n"
            f"• Current Status: *{order.get_status_display()}*\n"
            f"• Escrow State: *{order.escrow.get_status_display()}*{tracking_info}\n\n"
            "Funds remain securely held in Escrow until unboxing and delivery verification."
        )

    @classmethod
    def _handle_msp_check(cls, crop_arg: str) -> str:
        if not crop_arg:
            rates = GovernmentMSP.objects.filter(is_active=True)[:5]
            summary = "\n".join([f"• *{r.crop_name}*: ₹{r.msp_per_kg}/kg (₹{r.msp_per_quintal}/qtl)" for r in rates])
            return (
                "🌾 *Government Minimum Support Prices (MSP) 2025-26* 🌾\n\n"
                f"{summary}\n\n"
                "Reply `2 <crop_name>` (e.g. `2 Paddy`) for a specific crop."
            )

        match = GovernmentMSP.objects.filter(crop_name__icontains=crop_arg, is_active=True).first()
        if match:
            return (
                f"🏛️ *Official Government MSP for {match.crop_name}*\n\n"
                f"• Rate per Quintal: *₹{match.msp_per_quintal}*\n"
                f"• Rate per Kg: *₹{match.msp_per_kg}*\n"
                f"• Category: {match.get_category_display()}\n"
                f"• Season: {match.marketing_season}\n\n"
                "⚠️ *Protection Rule*: On Dhwaj, no buyer can purchase below this price floor."
            )
        return f"Could not find official MSP for '{crop_arg}'. Try 'Wheat', 'Paddy', 'Mustard', 'Cotton'."

    @classmethod
    def _handle_complaint(cls, description: str, ticket: SupportTicket) -> str:
        if not description:
            return (
                "⚠️ To file an issue, reply with your problem:\n"
                "Format: `3 Received spoiled produce, order #1234`\n\n"
                "Note: A continuous unboxing video is required for dispute refunds."
            )
        ticket.subject = description[:100]
        ticket.save()
        return (
            f"✅ *Grievance Registered - Ticket #{ticket.ticket_number}*\n\n"
            f"Issue: _{description}_\n\n"
            "If this pertains to a delivered package, please upload your unboxing video via the Dhwaj app "
            "or send the video link here to activate our Dispute Fault Matrix refund guarantee."
        )

    @classmethod
    def _handle_schemes(cls) -> str:
        schemes = GovernmentScheme.objects.filter(is_active=True)[:3]
        if not schemes:
            return "No active government scheme bulletins at this moment."
        
        items = []
        for s in schemes:
            items.append(f"📌 *{s.title}*\n{s.benefits_summary}\nPortal: {s.portal_url or 'https://agricoop.nic.in'}\n")
        return "🏛️ *Key Government Agricultural Schemes* 🏛️\n\n" + "\n".join(items)
