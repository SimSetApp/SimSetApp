import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
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