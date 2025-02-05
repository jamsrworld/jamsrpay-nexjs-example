"use client";

import { createPayment } from "@/actions/payment";
import { CreatePaymentFormValues } from "@/types";
import { paymentSchema } from "@/validation/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, RHFInput, RHFProvider, toast } from "@jamsr-ui/react";
import { useForm } from "react-hook-form";

type FormValues = CreatePaymentFormValues;
export const PaymentForm = () => {
  const defaultValues: FormValues = {
    amount: 1,
  };
  const methods = useForm({
    defaultValues,
    resolver: zodResolver(paymentSchema),
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const response = await createPayment(data);
    if (response.success === true) {
      window.open(response.paymentUrl);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  });
  return (
    <RHFProvider
      methods={methods}
      className="flex flex-col gap-6"
      onSubmit={onSubmit}
      isPending={isSubmitting}
    >
      <RHFInput<FormValues>
        name="amount"
        variant="outlined"
        label="Enter amount"
        isNumberInput
      />
      <Button
        color="primary"
        radius="xl"
        type="submit"
        isLoading={isSubmitting}
      >
        Submit
      </Button>
    </RHFProvider>
  );
};
