import { NagiPage, ProjectGrid, ProjectsHead } from "../components/FieldWork.jsx";
import "./project.css";

// /projects/: the same project list as the home section, on its own page.
export default function ProjectsPage() {
  return (
    <NagiPage>
      <ProjectsHead as="h1" />
      <ProjectGrid />
    </NagiPage>
  );
}
