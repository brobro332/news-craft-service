import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  bgImage: string;
}

const Layout = ({ children, bgImage }: LayoutProps) => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {children}
    </div>
  );
};

export default Layout;
