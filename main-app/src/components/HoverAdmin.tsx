"use client";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ShieldCheck } from "lucide-react";

function HoverAdmin() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger >
        <ShieldCheck className="w-4 h-4" />
      </HoverCardTrigger>
      <HoverCardContent>
        Eres administrador de esta marca
      </HoverCardContent>
    </HoverCard>
  );
}

export default HoverAdmin;
