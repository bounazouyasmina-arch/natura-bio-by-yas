"use client";

import { PayPalButtons, PayPalButtonsComponentProps } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PayPalPurchaseButtonProps {
  amount: string;           // "9.99" or "299.99"
  productName: string;      // "Ebook Ménopause au Naturel" or "Coaching 4 semaines"
  successUnlocked: "ebook" | "coaching";
  className?: string;
}

export default function PayPalPurchaseButton({
  amount,
  productName,
  successUnlocked,
  className = "",
}: PayPalPurchaseButtonProps) {
  const router = useRouter();

  const createOrder: PayPalButtonsComponentProps["createOrder"] = (data, actions) => {
    return actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          description: productName,
          amount: {
            currency_code: "EUR",
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove: PayPalButtonsComponentProps["onApprove"] = async (data, actions) => {
    if (!actions.order) return;

    try {
      const details = await actions.order.capture();
      
      toast.success(`Paiement réussi !`, {
        description: `Merci pour ton achat de "${productName}". Redirection vers ton espace...`,
      });

      // Redirige vers l'espace avec le flag de déblocage
      // (en vrai plus tard on stockera l'achat via email/orderID dans Supabase)
      const redirectUrl = `/espace?unlocked=${successUnlocked}&paid=true&order=${details.id || ""}`;
      
      // Petit délai pour voir le toast
      setTimeout(() => {
        router.push(redirectUrl);
      }, 800);
    } catch (error) {
      console.error("PayPal capture error:", error);
      toast.error("Erreur lors de la validation du paiement", {
        description: "Réessaie ou contacte-moi directement.",
      });
    }
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    toast.error("Une erreur PayPal est survenue", {
      description: "Vérifie ta connexion ou contacte le support.",
    });
  };

  return (
    <div className={`w-full ${className}`}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
          height: 48,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        fundingSource={undefined} // permet PayPal + cartes
      />
      <p className="text-center text-[11px] text-[#5A6B62] mt-2">
        Paiement sécurisé par PayPal • Annulation possible selon CGV
      </p>
    </div>
  );
}
