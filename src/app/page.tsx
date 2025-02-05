import { PaymentForm } from "@/components/payment-form";
import { Card, CardContent, CardHeader } from "@jamsr-ui/react";

const Page = () => {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader heading="Make Payment" />
          <CardContent>
            <PaymentForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
