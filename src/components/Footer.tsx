import { Train } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card">
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-lg font-bold text-primary">
          <Train className="h-5 w-5" />
          RailBook
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} RailBook. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
