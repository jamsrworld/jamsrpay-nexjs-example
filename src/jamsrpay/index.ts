import crypto from "crypto";
import {
  CreatePaymentInput,
  JamsrPayConfig,
  CreatePaymentResponse,
} from "./types";

export class Jamsrpay {
  private readonly ENVIRONMENT: "test" | "live";
  private readonly API_KEY: string;

  constructor(config: JamsrPayConfig) {
    const { ENVIRONMENT, API_KEY } = config;
    this.ENVIRONMENT = ENVIRONMENT;
    this.API_KEY = API_KEY;
  }

  private getApiBaseUrl() {
    return this.ENVIRONMENT === "test"
      ? "https://jamsrpay-api-sandbox.jamsrworld.com/web"
      : "https://jamsrpay-api.jamsrworld.com/web";
  }

  private getAppBaseUrl() {
    return this.ENVIRONMENT === "test"
      ? "https://jamsrpay-sandbox.jamsrworld.com"
      : "https://jamsrpay.jamsrworld.com";
  }

  private getCreatePaymentUrl() {
    const path = "/payments";
    return `${this.getApiBaseUrl()}${path}`;
  }

  private getPaymentUrl(id: string) {
    const path = `/payments/${id}`;
    return `${this.getAppBaseUrl()}${path}`;
  }

  public async createInvoice(input: CreatePaymentInput) {
    const { amount, orderId, successUrl, cancelUrl } = input;
    const url = this.getCreatePaymentUrl();
    const payload = {
      amount,
      currency: "USD",
      orderId,
      successUrl,
      cancelUrl,
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const error: { message?: string } = await response.json();
      throw new Error(
        error.message ?? "Something went wrong is creating payment"
      );
    }
    const data: CreatePaymentResponse = await response.json();
    const { id } = data;
    return { id, paymentUrl: this.getPaymentUrl(id) };
  }

  /**
   * Generate an HMAC-SHA256 signature for the payload using the merchant's secret key.
   * @param payload The JSON payload to send in the webhook.
   * @param secretKey The merchant's secret key.
   */
  static generateSignature(payload: unknown, secretKey: string): string {
    const hmac = crypto.createHmac("sha256", secretKey);
    const payloadString = JSON.stringify(payload);
    hmac.update(payloadString);
    return hmac.digest("hex");
  }

  /**
   * Verify the HMAC signature of the incoming webhook request.
   * @param payload The received payload.
   * @param receivedSignature The signature received in the webhook headers.
   * @param secretKey The secret key to verify the signature.
   */
  static verifySignature(
    payload: unknown,
    receivedSignature: string,
    secretKey: string
  ): boolean {
    const generatedSignature = this.generateSignature(payload, secretKey);
    return crypto.timingSafeEqual(
      Buffer.from(receivedSignature),
      Buffer.from(generatedSignature)
    );
  }
}
