import type { StaticImageData } from "next/image";
import hackclubLogo from "@/assets/hackclub.png";
import codedayLogo from "@/assets/codeday.png";
import mlhLogo from "@/assets/mlh.png";
import projectVetaLogo from "@/assets/project-veta.png";
import scalerSchoolLogo from "@/assets/scaler-school.webp";
import newtonSchoolLogo from "@/assets/newton-school.png";
import kreoLogo from "@/assets/kreo.jpg";
import localFermentCoLogo from "@/assets/local-ferment-co.png";

export interface Partner {
  name: string;
  logo: StaticImageData;
  url: string;
  alt: string;
}

export const partners: Partner[] = [
  {
    name: "Hack Club",
    logo: hackclubLogo,
    url: "https://hackclub.com",
    alt: "Hack Club logo – red pennant flag with white text",
  },
  {
    name: "CodeDay",
    logo: codedayLogo,
    url: "https://www.codeday.org",
    alt: "CodeDay logo – red heart icon with the word CodeDay",
  },
  {
    name: "Major League Hacking",
    logo: mlhLogo,
    url: "https://mlh.io",
    alt: "Major League Hacking logo – M, L, H letters in red, blue and yellow",
  },
  {
    name: "Scaler School of Technology",
    logo: scalerSchoolLogo,
    url: "https://www.scaler.com/school-of-technology/",
    alt: "Scaler School of Technology logo",
  },
  {
    name: "Newton School of Technology",
    logo: newtonSchoolLogo,
    url: "https://www.newtonschool.co/",
    alt: "Newton School of Technology logo",
  },
  {
    name: "Kreo",
    logo: kreoLogo,
    url: "https://kreo-tech.com/",
    alt: "Kreo logo",
  },
  {
    name: "Local Ferment Co.",
    logo: localFermentCoLogo,
    url: "https://localfermentco.com/",
    alt: "Local Ferment Co. logo",
  },
  {
    name: "Project Veta",
    logo: projectVetaLogo,
    url: "https://projectveta.org",
    alt: "Project Veta logo – bold dark green wordmark",
  },
];

export default partners;
