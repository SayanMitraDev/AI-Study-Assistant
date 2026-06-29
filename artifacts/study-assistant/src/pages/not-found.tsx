import { Link } from "wouter";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-6 animate-in zoom-in duration-500 max-w-md px-4">
        <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <BrainCircuit className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-foreground">
          Lost your train of thought?
        </h1>
        
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get back to studying.
        </p>
        
        <Link href="/">
          <Button size="lg" className="mt-4">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}