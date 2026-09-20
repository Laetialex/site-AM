import { Cormorant_Garamond, Jost } from "next/font/google";

// Titres — serif fin, esprit maison de luxe.
export const displaySerif = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Texte courant, navigation, boutons — sans-serif léger.
export const bodySans = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});
