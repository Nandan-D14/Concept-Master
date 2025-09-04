import React from 'react';
import { Card, CardContent, CardTitle } from './ui/card';
import { Award } from 'lucide-react';
// --- Start of copied cn function ---
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- End of copied cn function ---

interface BadgeCardProps {
  name: string;
  description: string;
  earned?: boolean;
  icon?: React.ReactNode; // Optional custom icon
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  earned = false,
  icon,
}) => {
  return (
    <Card className={cn(
      "w-full text-center",
      earned ? "border-primary shadow-md" : "border-muted-foreground/20 opacity-60 grayscale"
    )}>
      <CardContent className="flex flex-col items-center justify-center p-4">
        <div className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center mb-2",
          earned ? "bg-primary/10 text-primary" : "bg-muted-foreground/10 text-muted-foreground"
        )}>
          {icon ? icon : <Award className="h-8 w-8" />}
        </div>
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
        {earned && (
          <span className="mt-2 text-xs font-medium text-green-600">Earned!</span>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeCard;
