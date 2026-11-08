import { certCats } from "../data.js";
import { CertGrid, earned } from "../components/Certs.jsx";
import PageShell from "../components/PageShell.jsx";
import { pad } from "../components/ui.jsx";

export default function CertificatesPage() {
  return (
    <PageShell crumb="Achievements / certificates">
      <header className="page-head">
        <h1 className="page-h1">Achievements <span className="count">{pad(earned.length)}</span></h1>
        <p className="prose">Courses, programs and credentials I've completed. Open any certificate to see the original and verify it.</p>
      </header>
      <CertGrid filters cats={certCats} />
    </PageShell>
  );
}
