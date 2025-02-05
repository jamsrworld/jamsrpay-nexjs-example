"use server";

import { Jamsrpay } from "@/lib/jamsrpay";
import { JamsrPayConfig } from "@/lib/jamsrpay/types";
import prisma from "@/lib/prisma";
import { CreatePaymentFormValues } from "@/types";

export const createPayment = async (data: CreatePaymentFormValues) => {
  try {
    const { amount } = data;
    const ENVIRONMENT: JamsrPayConfig["ENVIRONMENT"] = "test";
    const API_KEY = "JRHTABNB-WAFMAOQS-EMTKBQMR-3HLOTCGI";
    const jamsrpay = new Jamsrpay({ API_KEY, ENVIRONMENT });

    // create transaction
    const { id: transactionId } = await prisma.transaction.create({
      data: {
        amount,
      },
    });
    console.log(`Transaction created with id ${transactionId}`);

    // create order
    const { id, paymentUrl } = await jamsrpay.createInvoice({
      amount,
      orderId: transactionId,
      cancelUrl: "http://localhost:3000",
      successUrl: "http://localhost:3000",
    });
    console.log(`Invoice created with id ${id}`);
    console.log(`Invoice created with url ${paymentUrl}`);

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
