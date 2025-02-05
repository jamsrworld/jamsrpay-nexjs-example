export type JamsrPayConfig = {
  ENVIRONMENT: "test" | "live";
  API_KEY: string;
};

export type CreatePaymentResponse = {
  id: string;
};

export type CreatePaymentInput = {
  amount: number;
  orderId: string;
  successUrl: string;
  cancelUrl: string;
};
