import { Hero } from "@/components/sections/Hero";
import { Installations } from "@/components/sections/Installations";
import { PadelSlotCTA } from "@/components/sections/PadelSlotCTA";
import { Ecole } from "@/components/sections/Ecole";
import { TarifsTeaser } from "@/components/sections/TarifsTeaser";
import { DecouverteEte } from "@/components/sections/DecouverteEte";
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
      <DecouverteEte />
      <Equipe />
      <Labels />
      <Partenaires />
      <Contact />
    </>
  );
}
