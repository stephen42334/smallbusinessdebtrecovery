import { JsonLd } from "@/components/JsonLd";
import { Header } from "@/components/Header";
import { MobileBar } from "@/components/MobileBar";
import { Faq, FinalCta, Footer, Hero, HowItWorks, Pricing, Problem, Services, WhyChoose } from "@/components/Sections";

export default function Page() {
  return (
    <>
      <JsonLd />
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Services />
        <HowItWorks />
        <Pricing />
        <WhyChoose />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
