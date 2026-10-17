import Hero from "@/components/Hero";
import Physics from "@/components/Physics";
import ModelViewer from "@/components/ModelViewer";
import SpecSheet from "@/components/SpecSheet";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main>
      <Hero />
      <Physics />
      <ModelViewer />
      <SpecSheet />
      <Footer />
    </main>
  );
}
