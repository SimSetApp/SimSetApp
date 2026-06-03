import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <a
          href="https://www.instagram.com/simsetapp"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-4"
        >
          <Instagram className="w-4 h-4" />
          @simsetapp
        </a>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SimSetApp. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Built for sim racers, by sim racers.
        </p>
      </div>
    </footer>
  );
}