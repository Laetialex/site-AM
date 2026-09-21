import { siteConfig } from "@/config/site.config";
import { ProsePage } from "@/components/content/ProsePage";
import { ContactForm } from "@/components/content/ContactForm";

export default function ContactPage() {
  return (
    <ProsePage
      title="Contact"
      subtitle={`Une question ? Écris-nous — on répond en général sous 48h. Tu peux aussi nous écrire directement à ${siteConfig.brand.contactEmail}.`}
    >
      <ContactForm />
    </ProsePage>
  );
}
