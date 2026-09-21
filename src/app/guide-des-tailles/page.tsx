import { siteConfig } from "@/config/site.config";
import { ProsePage } from "@/components/content/ProsePage";

export default function GuideDesTaillesPage() {
  const { measurements, unit, adviceText } = siteConfig.sizeGuide;

  return (
    <ProsePage
      title="Guide des tailles"
      subtitle="Toutes les mesures sont en centimètres, à plat."
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-am-gold/20 text-am-offwhite uppercase">
              <th className="py-2 pr-4 font-normal">Taille</th>
              <th className="py-2 pr-4 font-normal">Tour de poitrine</th>
              <th className="py-2 pr-4 font-normal">Longueur</th>
              <th className="py-2 font-normal">Épaules</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((row) => (
              <tr key={row.size} className="border-b border-am-gold/10">
                <td className="py-2 pr-4 text-am-offwhite">{row.size}</td>
                <td className="py-2 pr-4">
                  {row.chest || "—"} {row.chest ? unit : ""}
                </td>
                <td className="py-2 pr-4">
                  {row.length || "—"} {row.length ? unit : ""}
                </td>
                <td className="py-2">
                  {row.shoulders || "—"} {row.shoulders ? unit : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Comment prendre tes mesures</h2>
      <p>{adviceText}</p>
    </ProsePage>
  );
}
