import { Link } from "@jamsr-ui/next";
import { Header } from "@jamsr-ui/react";
import { Route } from "next";

const navItems: { title: string; href: Route }[] = [
  {
    title: "Create Invoice",
    href: "/",
  },
  {
    title: "Transactions",
    href: "/transactions",
  },
];

export const AppHeader = () => {
  return (
    <Header>
      <ul className="flex gap-2 mx-auto">
        {navItems.map((item) => {
          return (
            <li key={item.href}>
              <Link href={item.href}>{item.title}</Link>
            </li>
          );
        })}
      </ul>
    </Header>
  );
};
