"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Project Data
var PROJECTS = [
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
        github: "https://github.com/redhawk2002/portfolio-v1",
        color: "from-slate-500/20 to-slate-400/20"
    }
];
// Experience Data
var EXPERIENCES = [
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
var SKILL_DOMAINS = [
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
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var profile, projectsSection, experienceSection, skillsSection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Start seeding...');
                    // Reset database arrays explicitly for a clean slate
                    return [4 /*yield*/, prisma.sectionItem.deleteMany()];
                case 1:
                    // Reset database arrays explicitly for a clean slate
                    _a.sent();
                    return [4 /*yield*/, prisma.section.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.profile.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.profile.create({
                            data: {
                                name: "Sandeepan Kalita",
                                title: "Full Stack Developer",
                                email: "kalitasandeepan@gmail.com",
                                location: "India",
                                currentCompany: "Tata Consultancy Services",
                                bio: "Highly immersive developer portfolio focused on 'First Principles' architecture and modern cinematic UX.",
                            }
                        })];
                case 4:
                    profile = _a.sent();
                    return [4 /*yield*/, prisma.section.create({
                            data: {
                                type: "projects",
                                title: "Featured Projects",
                                subtitle: "My recent work",
                                displayOrder: 1,
                                items: {
                                    create: PROJECTS.map(function (proj, idx) { return ({
                                        content: proj,
                                        displayOrder: idx + 1
                                    }); })
                                }
                            }
                        })];
                case 5:
                    projectsSection = _a.sent();
                    console.log("Created projects section...");
                    return [4 /*yield*/, prisma.section.create({
                            data: {
                                type: "experience",
                                title: "Work Experience",
                                subtitle: "My career journey",
                                displayOrder: 2,
                                items: {
                                    create: EXPERIENCES.map(function (exp, idx) { return ({
                                        content: exp,
                                        displayOrder: idx + 1
                                    }); })
                                }
                            }
                        })];
                case 6:
                    experienceSection = _a.sent();
                    console.log("Created experience section...");
                    return [4 /*yield*/, prisma.section.create({
                            data: {
                                type: "skills",
                                title: "Technical Arsenal",
                                subtitle: "My core competencies",
                                displayOrder: 3,
                                items: {
                                    create: SKILL_DOMAINS.map(function (skill, idx) { return ({
                                        content: skill,
                                        displayOrder: idx + 1
                                    }); })
                                }
                            }
                        })];
                case 7:
                    skillsSection = _a.sent();
                    console.log("Created skills section...");
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .then(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })
    .catch(function (e) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.error(e);
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(1);
                return [2 /*return*/];
        }
    });
}); });
