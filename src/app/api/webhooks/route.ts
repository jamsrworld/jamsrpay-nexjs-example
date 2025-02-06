import { Jamsrpay } from "@/lib/jamsrpay";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { coerce, literal, object, string } from "zod";

export const GET = async () => {
  return NextResponse.json({
    message: "Listening for jamsrpay webhook",
  });
};

const bodyValidator = object({
  input_amount: coerce.number().positive(),
  input_currency: literal("USD"),
  invoice_id: string().min(1, "Invoice Id is required"),
  paid_amount: coerce.number().positive(),
  payment_currency: literal("TRX"),
  status: literal("Settled"),
  merchant_order_id: string().min(1, "Merchant Id is required"),
});

export const POST = async (req: Request) => {
  try {
    // paste your webhook secret here
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) {
      throw new Error("WEBHOOK_SECRET is not set in env");
    }

    const receivedSignature = req.headers.get("x-jamsrpay-signature");
    const receivedTimestamp = req.headers.get("x-jamsrpay-timestamp");
    const reqPayload = await req.json();
    const parsedData = bodyValidator.parse(reqPayload);

    if (!receivedSignature || !receivedTimestamp) {
      throw new Error("Missing Signature or Timestamp");
    }

    const isSignatureValid = Jamsrpay.verifySignature(
      reqPayload,
      receivedSignature,
      WEBHOOK_SECRET
    );
    if (!isSignatureValid) {
      throw new Error("Signature Mismatched");
    }

    const { input_amount, input_currency, merchant_order_id, status } =
      parsedData;

    // find transaction
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: merchant_order_id,
      },
    });
    if (!transaction) {
      return NextResponse.json(
        {
          message: "Transaction not found",
        },
        {
          status: 404,
        }
      );
    }

    // validate amount
    if (Number(transaction.amount) !== Number(input_amount)) {
      return NextResponse.json(
        {
          message: "Amount does not match",
        },
        {
          status: 400,
        }
      );
    }

    // validate currency
    if (input_currency !== "USD") {
      return NextResponse.json(
        {
          message: "Currency does not match",
        },
        {
          status: 400,
        }
      );
    }

    if (status === "Settled") {
      // update transaction as paid
      await prisma.transaction.update({
        data: {
          status: "COMPLETED",
        },
        where: {
          id: merchant_order_id,
        },
      });
    }

    return NextResponse.json({
      message: "Success",
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Something went wrong";
    return NextResponse.json(
      {
        message,
      },
      {
        status: 500,
      }
    );
  }
};
