import Hero from "../components/Hero.jsx";
import ProjectStack from "../components/ProjectStack.jsx";
import { About, CertsPreview, Contact, Experience, Skills } from "../components/HomeSections.jsx";

export default function Home({ theme }) {
  return (
    <>
      <Hero theme={theme} />
      <ProjectStack />
      <Experience />
      <About />
      <Skills />
      <CertsPreview />
      <Contact />
    </>
  );
}
