import { Container } from "@/components/ui/Container";
import { ResetPasswordForm } from "@/components/account/ResetPasswordForm";

export default function ReinitialiserPage() {
  return (
    <Container className="flex flex-col items-center gap-8 py-16 sm:py-20 text-center">
      <h1 className="text-4xl sm:text-5xl">Nouveau mot de passe</h1>
      <ResetPasswordForm />
    </Container>
  );
}
