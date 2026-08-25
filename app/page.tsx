import { Hero } from "@/components/sections/Hero";
import { Installations } from "@/components/sections/Installations";
import { PadelSlotCTA } from "@/components/sections/PadelSlotCTA";
import { Ecole } from "@/components/sections/Ecole";
import { TarifsTeaser } from "@/components/sections/TarifsTeaser";
import { Equipe } from "@/components/sections/Equipe";
import { Labels } from "@/components/sections/Labels";
import { Partenaires } from "@/components/sections/Partenaires";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Installations />
      <PadelSlotCTA />
      <Ecole />
      <TarifsTeaser />
      {/* 25/08/2026 (David) — bloc « Pour vos amis cet été » retiré de la home :
          il annonçait des offres découverte été 2027 pas encore ouvertes sur
          Ten'Up. Le composant est conservé (components/sections/DecouverteEte.tsx)
          pour être remis quand les offres existeront vraiment. */}
      <Equipe />
      <Labels />
      <Partenaires />
      <Contact />
    </>
  );
}
