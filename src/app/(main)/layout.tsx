import { AppHeader } from "@/components/header";
import { ToastProvider, UIProvider } from "@jamsr-ui/react";

type Props = {
  children: React.ReactNode;
};

const MainLayout = (props: Props) => {
  const { children } = props;
  return (
    <UIProvider>
      <ToastProvider />
      <AppHeader />
      {children}
    </UIProvider>
  );
};

export default MainLayout;
