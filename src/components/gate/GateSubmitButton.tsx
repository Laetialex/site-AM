"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function GateSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "..." : "Entrer"}
    </Button>
  );
}
