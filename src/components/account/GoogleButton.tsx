import { signInWithGoogle } from "@/app/compte/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function GoogleButton({ next }: { next: string }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <SubmitButton variant="secondary" pendingLabel="..." className="w-full">
        Continuer avec Google
      </SubmitButton>
    </form>
  );
}
