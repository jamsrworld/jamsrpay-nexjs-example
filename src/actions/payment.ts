"use server";

import { Jamsrpay } from "@/jamsrpay";
import { JamsrPayConfig } from "@/jamsrpay/types";
import { CreatePaymentFormValues } from "@/types";

export const createPayment = async (data: CreatePaymentFormValues) => {
  try {
    const { amount } = data;
    const ENVIRONMENT: JamsrPayConfig["ENVIRONMENT"] = "test";
    const API_KEY = "JRHTABNB-WAFMAOQS-EMTKBQMR-3HLOTCGI";
    const jamsrpay = new Jamsrpay({ API_KEY, ENVIRONMENT });

    // create order
    const { id, paymentUrl } = await jamsrpay.createInvoice({
      amount,
      orderId: "ajdfl",
      cancelUrl: "https://jamsrworld.com",
      successUrl: "https://jamsrworld.com",
    });
    return {
      id,
      paymentUrl,
      success: true,
      message: "Payment has been created",
    } as const;
  } catch (e: unknown) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Something went wrong",
    } as const;
  }
};
