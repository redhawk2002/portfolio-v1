import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Project Data
const PROJECTS = [
  {
    title: "Enterprise Parking Management",
    category: "System Architecture",
    description: "Enterprise-grade backend utilizing Strategy Design patterns to handle complex, dynamic payment routing and parking flows.",
    tags: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
    live: "",
    github: "https://github.com",
    color: "from-blue-500/20 to-indigo-500/20"
  },
  {
    title: "Gmail Auto Replier",
    category: "Automation Pipeline",
    description: "Automated vacation responses and label organization using the official APIs.",
    tags: ["Node.js", "Express.js", "Gmail APIs", "OAuth2"],
    live: "",
    github: "https://github.com/redhawk2002/GmailAutoReplier",
    color: "from-red-500/20 to-amber-500/20"
  },
  {
    title: "Intent Detection for Bank Query",
    category: "Machine Learning / NLP",
    description: "Voice-assisted web application for banking intent detection, fine-tuning BERT Base Uncased on the BANKING77 dataset.",
    tags: ["Python", "BERT", "NLP", "Web Speech API"],
    live: "",
    github: "https://github.com/redhawk2002/IntentDetectionForBankQuery",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    title: "Aesthetic Portfolio V1",
    category: "Frontend Experience",
    description: "Highly immersive developer portfolio focused on 'First Principles' architecture and modern cinematic UX.",
    tags: ["React", "Next.js", "Framer Motion", "Tailwind CSS"],
    live: "#",
    github: "https://github.com/redhawk2002/PortfolioWithAI",
    color: "from-slate-500/20 to-slate-400/20"
  }
];

// Experience Data
const EXPERIENCES = [
  {
    id: "EXP-01",
    role: "Project Intern",
    company: "IIT Guwahati",
    date: "05/2023 - 07/2023",
    status: "COMPLETED",
    details: [
      "Built a voice-assisted web application for banking intent detection using the Web Speech API.",
      "Fine-tuned BERT Base Uncased on the BANKING77 dataset for natural language understanding.",
      "Implemented the inference pipeline and evaluated model performance using confusion-matrix based analysis."
    ]
  },
  {
    id: "EXP-02",
    role: "System Engineer",
    company: "Tata Consultancy Services",
    client: "TCSiON, a large-scale digital examination system used for nationwide exams such as JEE Main, supporting lakhs of concurrent candidates with high availability, scalability, and secure assessment delivery.",
    date: "11/2024 - Present",
    status: "ACTIVE",
    details: [
      "Contributed to building a transaction-level monitoring framework from scratch using Java, MySQL, and an internal job scheduler, enabling hourly visibility across multiple applications and faster detection of transaction failures.",
      "Developed a configurable silent-period module supporting one-time and recurring schedules (weekly, monthly, etc.), reducing alert fatigue by 40%.",
      "Re-architected the analytics pipeline by replacing a SQL ETL datamart with Kafka–Cassandra architecture to improve scalability.",
      "Implemented severity-based email alerting with CSV reports for detailed incident insights.",
      "Implemented admin-bypass audit logging in the AEC module to capture candidate-level overrides applied by admins even when a global bypass was active, improving traceability and monitoring during assessments."
    ]
  }
];

// Skills Data
const SKILL_DOMAINS = [
  { 
    id: "01",
    title: "Core Engineering", 
    description: "Languages and server-side logic driving the system.",
    skills: ["Java", "Spring Boot", "C++", "Python", "Node.js", "Express.js", "Servlet", "JSP"] 
  },
  { 
    id: "02",
    title: "Data & Architecture", 
    description: "Handling scale, events, and persistence.",
    skills: ["Apache Kafka", "Apache Cassandra", "MongoDB", "MySQL"] 
  },
  { 
    id: "03",
    title: "Client & Infrastructure", 
    description: "Interfaces and deployment pipelines.",
    skills: ["React", "Docker", "Jenkins", "Git", "Postman", "TortoiseSVN"] 
  },
];

async function main() {
  console.log('Start seeding...');

  // Reset database arrays explicitly for a clean slate
  await prisma.sectionItem.deleteMany();
  await prisma.section.deleteMany();
  await prisma.profile.deleteMany();

  // Profile data
  const profile = await prisma.profile.create({
    data: {
      name: "Sandeepan Kalita",
      title: "Full Stack Developer",
      email: "kalitasandeepan@gmail.com",
      location: "India",
      currentCompany: "Tata Consultancy Services",
      bio: "Highly immersive developer portfolio focused on 'First Principles' architecture and modern cinematic UX.",
    }
  });

  // Create Projects Section
  const projectsSection = await prisma.section.create({
    data: {
      type: "projects",
      title: "Featured Projects",
      subtitle: "My recent work",
      displayOrder: 1,
      items: {
        create: PROJECTS.map((proj, idx) => ({
          content: proj,
          displayOrder: idx + 1
        }))
      }
    }
  });
  console.log(`Created projects section...`);

  // Create Experience Section
  const experienceSection = await prisma.section.create({
    data: {
      type: "experience",
      title: "Work Experience",
      subtitle: "My career journey",
      displayOrder: 2,
      items: {
        create: EXPERIENCES.map((exp, idx) => ({
          content: exp,
          displayOrder: idx + 1
        }))
      }
    }
  });
  console.log(`Created experience section...`);

  // Create Skills Section
  const skillsSection = await prisma.section.create({
    data: {
      type: "skills",
      title: "Technical Arsenal",
      subtitle: "My core competencies",
      displayOrder: 3,
      items: {
        create: SKILL_DOMAINS.map((skill, idx) => ({
          content: skill,
          displayOrder: idx + 1
        }))
      }
    }
  });
  console.log(`Created skills section...`);

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
