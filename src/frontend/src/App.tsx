import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  FileText,
  FlaskConical,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  Menu,
  PenLine,
  Phone,
  Trophy,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // --- Bar chart groups ---
    type BarGroup = {
      x: number;
      y: number;
      bars: number[];
      targets: number[];
      w: number;
      h: number;
    };
    const barGroups: BarGroup[] = [
      {
        x: 0.12,
        y: 0.25,
        bars: [0.4, 0.65, 0.5, 0.8, 0.55],
        targets: [0.4, 0.65, 0.5, 0.8, 0.55],
        w: 7,
        h: 60,
      },
      {
        x: 0.75,
        y: 0.6,
        bars: [0.7, 0.45, 0.9, 0.6, 0.35],
        targets: [0.7, 0.45, 0.9, 0.6, 0.35],
        w: 7,
        h: 55,
      },
      {
        x: 0.88,
        y: 0.2,
        bars: [0.55, 0.8, 0.4, 0.7, 0.6],
        targets: [0.55, 0.8, 0.4, 0.7, 0.6],
        w: 6,
        h: 50,
      },
    ];

    // --- Scatter dots ---
    type ScatterDot = {
      px: number;
      py: number;
      r: number;
      alpha: number;
      pulse: number;
    };
    const scatterDots: ScatterDot[] = Array.from({ length: 28 }, () => ({
      px: 0.55 + (Math.random() - 0.5) * 0.22,
      py: 0.35 + (Math.random() - 0.5) * 0.22,
      r: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));

    // --- Floating data labels ---
    type DataLabel = {
      text: string;
      x: number;
      y: number;
      vy: number;
      alpha: number;
      size: number;
    };
    const dataLabels: DataLabel[] = [
      { text: "87.3%", x: 0.3, y: 0.15, vy: -0.00008, alpha: 0.18, size: 11 },
      { text: "↑ 12.4", x: 0.63, y: 0.45, vy: -0.00006, alpha: 0.15, size: 10 },
      { text: "Q3", x: 0.82, y: 0.72, vy: -0.00007, alpha: 0.14, size: 12 },
      { text: "2024", x: 0.18, y: 0.65, vy: -0.00009, alpha: 0.16, size: 11 },
      { text: "94.1%", x: 0.48, y: 0.82, vy: -0.00005, alpha: 0.13, size: 10 },
      { text: "↓ 3.7", x: 0.07, y: 0.48, vy: -0.00008, alpha: 0.15, size: 11 },
      { text: "KPI", x: 0.93, y: 0.55, vy: -0.00006, alpha: 0.12, size: 10 },
      {
        text: "Σ 2,847",
        x: 0.37,
        y: 0.92,
        vy: -0.00007,
        alpha: 0.14,
        size: 10,
      },
    ];

    // --- Data cells ---
    type DataCell = {
      x: number;
      y: number;
      w: number;
      h: number;
      phase: number;
    };
    const dataCells: DataCell[] = [
      { x: 0.42, y: 0.55, w: 90, h: 26, phase: 0 },
      { x: 0.6, y: 0.75, w: 70, h: 22, phase: 1.2 },
      { x: 0.22, y: 0.38, w: 80, h: 24, phase: 2.4 },
      { x: 0.78, y: 0.42, w: 65, h: 20, phase: 0.8 },
    ];

    function drawGrid(w: number, h: number) {
      const cellSize = 45;
      ctx!.lineWidth = 0.3;
      // vertical
      for (let x = 0; x < w; x += cellSize) {
        const alpha = 0.06 + 0.03 * Math.sin(t * 0.3 + x * 0.01);
        ctx!.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      // horizontal
      for (let y = 0; y < h; y += cellSize) {
        const alpha = 0.06 + 0.03 * Math.sin(t * 0.3 + y * 0.01);
        ctx!.strokeStyle = `rgba(0, 200, 220, ${alpha})`;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
    }

    function drawBarGroups(w: number, h: number) {
      for (const g of barGroups) {
        // Slowly animate bar targets
        if (Math.random() < 0.005) {
          const idx = Math.floor(Math.random() * g.bars.length);
          g.targets[idx] = 0.2 + Math.random() * 0.75;
        }
        for (let i = 0; i < g.bars.length; i++) {
          g.bars[i] += (g.targets[i] - g.bars[i]) * 0.008;
        }

        const cx = g.x * w;
        const cy = g.y * h;
        const gap = 4;
        const totalW = g.bars.length * (g.w + gap);
        const startX = cx - totalW / 2;

        // axis line
        ctx!.strokeStyle = "rgba(0, 212, 255, 0.12)";
        ctx!.lineWidth = 0.8;
        ctx!.beginPath();
        ctx!.moveTo(startX - 4, cy);
        ctx!.lineTo(startX + totalW + 4, cy);
        ctx!.stroke();

        for (let i = 0; i < g.bars.length; i++) {
          const bh = g.bars[i] * g.h;
          const bx = startX + i * (g.w + gap);
          const by = cy - bh;

          const grad = ctx!.createLinearGradient(bx, by, bx, cy);
          grad.addColorStop(0, "rgba(0, 212, 255, 0.5)");
          grad.addColorStop(1, "rgba(50, 130, 255, 0.1)");
          ctx!.fillStyle = grad;
          ctx!.fillRect(bx, by, g.w, bh);

          ctx!.strokeStyle = "rgba(0, 212, 255, 0.3)";
          ctx!.lineWidth = 0.6;
          ctx!.strokeRect(bx, by, g.w, bh);
        }
      }
    }

    function drawSparkline(w: number, h: number) {
      const baseY = h * 0.78;
      const amplitude = 28;
      const freq = 0.018;
      const speed = 0.022;
      const lineLen = w * 0.55;
      const startX = w * 0.22;

      // Area fill
      ctx!.beginPath();
      ctx!.moveTo(startX, baseY);
      for (let x = 0; x <= lineLen; x += 2) {
        const y =
          baseY -
          amplitude * Math.sin(x * freq + t * speed) -
          10 * Math.sin(x * freq * 2.3 + t * speed * 0.7);
        ctx!.lineTo(startX + x, y);
      }
      ctx!.lineTo(startX + lineLen, baseY);
      ctx!.closePath();
      const areaGrad = ctx!.createLinearGradient(
        0,
        baseY - amplitude,
        0,
        baseY,
      );
      areaGrad.addColorStop(0, "rgba(0, 212, 255, 0.1)");
      areaGrad.addColorStop(1, "rgba(0, 212, 255, 0.01)");
      ctx!.fillStyle = areaGrad;
      ctx!.fill();

      // Line
      ctx!.beginPath();
      for (let x = 0; x <= lineLen; x += 2) {
        const y =
          baseY -
          amplitude * Math.sin(x * freq + t * speed) -
          10 * Math.sin(x * freq * 2.3 + t * speed * 0.7);
        x === 0 ? ctx!.moveTo(startX + x, y) : ctx!.lineTo(startX + x, y);
      }
      ctx!.strokeStyle = "rgba(0, 212, 255, 0.45)";
      ctx!.lineWidth = 1.5;
      ctx!.shadowBlur = 6;
      ctx!.shadowColor = "rgba(0, 212, 255, 0.4)";
      ctx!.stroke();
      ctx!.shadowBlur = 0;

      // Second sparkline
      const baseY2 = h * 0.55;
      ctx!.beginPath();
      for (let x = 0; x <= lineLen * 0.7; x += 2) {
        const y = baseY2 - 18 * Math.cos(x * freq * 1.4 + t * speed * 1.3);
        x === 0
          ? ctx!.moveTo(startX * 1.8 + x, y)
          : ctx!.lineTo(startX * 1.8 + x, y);
      }
      ctx!.strokeStyle = "rgba(50, 130, 255, 0.35)";
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
    }

    function drawScatterDots(w: number, h: number) {
      for (const d of scatterDots) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.04 + d.pulse);
        const alpha = d.alpha * (0.6 + 0.4 * pulse);
        const r = d.r * (0.9 + 0.2 * pulse);

        ctx!.beginPath();
        ctx!.arc(d.px * w, d.py * h, r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0, 180, 220, ${alpha})`;
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = "rgba(0, 212, 255, 0.5)";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }
    }

    function drawDataCells(w: number, h: number) {
      for (const c of dataCells) {
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.035 + c.phase);
        const alpha = 0.06 + 0.06 * pulse;
        const borderAlpha = 0.15 + 0.15 * pulse;

        ctx!.fillStyle = `rgba(0, 180, 220, ${alpha})`;
        ctx!.fillRect(c.x * w, c.y * h, c.w, c.h);

        ctx!.strokeStyle = `rgba(0, 212, 255, ${borderAlpha})`;
        ctx!.lineWidth = 0.8;
        ctx!.strokeRect(c.x * w, c.y * h, c.w, c.h);

        // inner highlight line
        ctx!.strokeStyle = `rgba(150, 240, 255, ${borderAlpha * 0.5})`;
        ctx!.lineWidth = 0.4;
        ctx!.beginPath();
        ctx!.moveTo(c.x * w + 3, c.y * h + 3);
        ctx!.lineTo(c.x * w + c.w - 3, c.y * h + 3);
        ctx!.stroke();
      }
    }

    function drawDataLabels(w: number, h: number) {
      ctx!.font = "bold 10px 'Courier New', monospace";
      ctx!.textBaseline = "top";
      for (const lbl of dataLabels) {
        lbl.y -= lbl.vy;
        if (lbl.y < -0.05) lbl.y = 1.05;
        const flicker = 0.7 + 0.3 * Math.sin(t * 0.06 + lbl.x * 10);
        ctx!.fillStyle = `rgba(0, 212, 255, ${lbl.alpha * flicker})`;
        ctx!.font = `bold ${lbl.size}px 'Courier New', monospace`;
        ctx!.fillText(lbl.text, lbl.x * w, lbl.y * h);
      }
    }

    function draw() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      drawGrid(w, h);
      drawBarGroups(w, h);
      drawSparkline(w, h);
      drawScatterDots(w, h);
      drawDataCells(w, h);
      drawDataLabels(w, h);

      t += 1;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.85,
      }}
    />
  );
}

const NAV_LINKS = [
  { label: "Home", id: "hero" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Internship", id: "internship" },
  { label: "Certificates", id: "certificates" },
  { label: "Competitive", id: "competitive" },
  { label: "Blog", id: "blog" },
  { label: "Research", id: "research" },
  { label: "Education", id: "education" },
  { label: "Contact", id: "contact" },
];

const SKILL_GROUPS = [
  {
    category: "Languages & Libraries",
    icon: Code2,
    skills: ["Python", "C", "C++", "NumPy", "Pandas", "Matplotlib"],
  },
  {
    category: "ML & Analytics",
    icon: Brain,
    skills: ["Machine Learning", "Data Analysis"],
  },
  {
    category: "Tools",
    icon: Wrench,
    skills: ["Power BI", "Jupyter Notebook", "Git"],
  },
];

interface ProjectDetail {
  id: number;
  title: string;
  description: string;
  tags: string[];
  status: string;
  statusColor: "emerald" | "yellow" | "gray";
  image: string;
  link: string;
  overview: string;
  techStack: string[];
  workflow: { step: string; detail: string }[];
  results: string;
  github: string;
}

const PROJECTS: ProjectDetail[] = [
  {
    id: 1,
    title: "Heart Disease Prediction Model",
    description:
      "Built an ML model to predict heart disease likelihood using patient data. Applied feature engineering and cross-validation for robust accuracy.",
    tags: ["Python", "Pandas", "Matplotlib"],
    status: "Completed",
    statusColor: "emerald",
    image: "/assets/generated/project-heart-disease.dim_600x340.jpg",
    link: "#",
    overview:
      "A machine learning model that predicts the risk of heart disease based on patient health attributes such as age, cholesterol, blood pressure, and more.",
    techStack: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Streamlit",
    ],
    workflow: [
      {
        step: "Data Collection",
        detail:
          "Collected dataset with patient health attributes (age, cholesterol, BP, etc.)",
      },
      {
        step: "Data Preprocessing",
        detail: "Handled missing values, performed normalization and encoding",
      },
      {
        step: "Exploratory Data Analysis (EDA)",
        detail:
          "Visualized correlations using graphs, identified key influencing features",
      },
      {
        step: "Feature Engineering",
        detail: "Selected important features, reduced noise and redundancy",
      },
      {
        step: "Model Building",
        detail: "Applied Logistic Regression and Random Forest algorithms",
      },
      {
        step: "Model Evaluation",
        detail:
          "Used accuracy, precision, recall; cross-validation for reliability",
      },
      {
        step: "Prediction System",
        detail:
          "Built Streamlit interface that accepts user input and predicts risk",
      },
    ],
    results:
      "Achieved reliable prediction accuracy using Random Forest; cross-validation confirmed model generalization. Streamlit interface allows real-time risk prediction.",
    github: "https://github.com/Yaswanthhh1432",
  },
  {
    id: 2,
    title: "Student Course Completion Analysis",
    description:
      "Analyzed student engagement and completion patterns across online courses using data analytics and visualization to identify key dropout factors.",
    tags: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    status: "Completed",
    statusColor: "emerald",
    image: "/assets/generated/project-student-course.dim_600x340.jpg",
    link: "#",
    overview:
      "A data analysis project that examines student activity and course completion patterns to identify dropout factors and improve engagement.",
    techStack: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Power BI",
      "Excel",
    ],
    workflow: [
      {
        step: "Data Collection",
        detail: "Gathered student activity and course completion dataset",
      },
      {
        step: "Data Cleaning",
        detail: "Removed duplicates, handled missing/inconsistent values",
      },
      {
        step: "Data Transformation",
        detail:
          "Converted raw data into structured format, created meaningful columns (completion rate, engagement score)",
      },
      {
        step: "Exploratory Data Analysis",
        detail:
          "Analyzed patterns in course completion, dropout rates, engagement trends",
      },
      {
        step: "Data Visualization",
        detail: "Used bar graphs, pie charts, and heatmaps",
      },
      {
        step: "Insights Generation",
        detail:
          "Identified key factors affecting dropout, compared course performances",
      },
      {
        step: "Conclusion",
        detail: "Suggested improvements for student engagement",
      },
    ],
    results:
      "Identified key dropout triggers and engagement patterns. Visualizations clearly highlighted underperforming courses and suggested targeted interventions.",
    github: "https://github.com/Yaswanthhh1432",
  },
  {
    id: 3,
    title: "Social Media News Feed Algorithm",
    description:
      "Designed and simulated a personalized news feed ranking algorithm using engagement signals, user preferences, and content scoring.",
    tags: ["Python", "Machine Learning", "Algorithms", "NLP"],
    status: "Completed",
    statusColor: "emerald",
    image: "/assets/generated/project-social-feed.dim_600x340.jpg",
    link: "#",
    overview:
      "A ranking algorithm that generates personalized social media news feeds based on user engagement signals like likes, shares, comments, and preferences.",
    techStack: ["Python", "Pandas", "NumPy", "Matplotlib"],
    workflow: [
      {
        step: "Data Input",
        detail: "Collected user data: likes, shares, comments, preferences",
      },
      {
        step: "Feature Extraction",
        detail: "Extracted engagement signals, analyzed content relevance",
      },
      {
        step: "Scoring Mechanism",
        detail:
          "Assigned scores based on user interaction, content popularity, recency",
      },
      {
        step: "Algorithm Design",
        detail:
          "Built ranking logic using ML concepts, prioritized relevant content",
      },
      {
        step: "Feed Generation",
        detail: "Sorted posts based on score, generated personalized feed",
      },
      {
        step: "Simulation & Testing",
        detail:
          "Tested algorithm with sample data, compared ranking performance",
      },
      {
        step: "Optimization",
        detail: "Improved accuracy using feedback loops",
      },
    ],
    results:
      "Successfully ranked posts by relevance score. Personalized feeds showed improved content relevance compared to chronological ordering.",
    github: "https://github.com/Yaswanthhh1432",
  },
  {
    id: 4,
    title: "Financial Analysis Dashboard",
    description:
      "Built an interactive financial dashboard to analyze revenue trends, profit margins, and expense breakdowns using Python and Power BI.",
    tags: ["Python", "Power BI", "Excel", "Pandas"],
    status: "Completed",
    statusColor: "emerald",
    image: "/assets/generated/project-financial-dashboard.dim_600x340.jpg",
    link: "#",
    overview:
      "An interactive dashboard that consolidates financial data to provide insights into revenue trends, profit margins, expense distribution, and KPI tracking for data-driven decision making.",
    techStack: [
      "Python",
      "Pandas",
      "NumPy",
      "Matplotlib",
      "Seaborn",
      "Power BI",
      "Excel",
    ],
    workflow: [
      {
        step: "Data Collection",
        detail:
          "Gathered financial datasets including revenue, expenses, and profit records across multiple periods",
      },
      {
        step: "Data Cleaning",
        detail:
          "Removed inconsistencies, handled missing entries, and standardized date formats and currency values",
      },
      {
        step: "Data Transformation",
        detail:
          "Created calculated columns for profit margins, growth rates, and expense ratios",
      },
      {
        step: "Exploratory Data Analysis",
        detail:
          "Identified revenue trends, seasonal patterns, and top expense categories",
      },
      {
        step: "Dashboard Design",
        detail:
          "Designed interactive Power BI dashboard with KPI cards, bar charts, line graphs, and pie charts",
      },
      {
        step: "Insights Generation",
        detail:
          "Highlighted underperforming periods, high-cost segments, and revenue growth opportunities",
      },
      {
        step: "Reporting",
        detail:
          "Exported visual reports and summary for stakeholder presentation",
      },
    ],
    results:
      "Delivered a comprehensive financial overview dashboard with real-time KPI tracking. Identified a 15% cost reduction opportunity through expense analysis.",
    github: "https://github.com/Yaswanthhh1432",
  },
];

const STATUS_STYLES: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  gray: "bg-white/5 text-muted-foreground border border-white/10",
};

const PHOTO_SRC =
  "/assets/uploads/SmartBG_2026-03-22_36f7a0b7-af0a-4d3a-80f6-72dac452858b-1.png";

const INTERNSHIP_BULLETS = [
  "Gained practical exposure to telecommunication systems and network infrastructure.",
  "Assisted in understanding the working of broadband, fiber optic communication, and switching systems.",
  "Learned about network configuration, troubleshooting, and maintenance of communication systems.",
  "Observed real-time operations and support activities in a telecom environment.",
  "Developed basic knowledge of data communication protocols and networking concepts.",
  "Strengthened problem-solving and technical analysis skills through hands-on learning.",
];

const CERTIFICATES = [
  {
    name: "Certificate 1",
    file: "/assets/uploads/1-749f9d35-0fa2-40d7-9a3f-aa51beb2209c-019d1bc5-3d09-71a0-838f-031b966199dd-1.pdf",
  },
  {
    name: "Certificate 2",
    file: "/assets/uploads/1-62c6a4c0-a820-41c8-8b3c-3c70f2717623-019d1bc5-3ebe-7633-8746-4ec853b14113-2.pdf",
  },
  {
    name: "Certificate 3",
    file: "/assets/uploads/4961046_1710657901-019d1bc5-4258-702f-9878-45450920c9bc-3.pdf",
  },
  {
    name: "Certificate 4",
    file: "/assets/uploads/coursera_bm41s4il3vwu-019d1bc5-42c5-7679-a2a7-60e91e23df64-4.pdf",
  },
];

// Floating particles config
const PARTICLES = [
  {
    top: "14%",
    left: "7%",
    size: 3,
    cls: "animate-particle-1",
    color: "oklch(0.82 0.15 195 / 0.7)",
  },
  {
    top: "22%",
    left: "91%",
    size: 2,
    cls: "animate-particle-2",
    color: "oklch(0.68 0.14 195 / 0.65)",
  },
  {
    top: "68%",
    left: "88%",
    size: 3.5,
    cls: "animate-particle-3",
    color: "oklch(0.82 0.15 195 / 0.55)",
  },
  {
    top: "78%",
    left: "10%",
    size: 2.5,
    cls: "animate-particle-4",
    color: "oklch(0.68 0.14 195 / 0.6)",
  },
  {
    top: "42%",
    left: "96%",
    size: 2,
    cls: "animate-particle-5",
    color: "oklch(0.82 0.15 195 / 0.5)",
  },
  {
    top: "8%",
    left: "52%",
    size: 2,
    cls: "animate-particle-6",
    color: "oklch(0.68 0.14 195 / 0.5)",
  },
  {
    top: "55%",
    left: "3%",
    size: 3,
    cls: "animate-particle-7",
    color: "oklch(0.82 0.15 195 / 0.6)",
  },
];

function Navbar({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        background: "oklch(0.12 0.013 240 / 0.85)",
        backdropFilter: "blur(16px)",
        borderColor: "oklch(0.94 0.01 220 / 0.08)",
        boxShadow: "0 1px 0 oklch(0.82 0.15 195 / 0.05)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          data-ocid="nav.brand.button"
          className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="text-foreground">Yaswanth</span>
          <span style={{ color: "oklch(0.82 0.15 195)" }}> / DS</span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              data-ocid={`nav.${link.id}.link`}
              className="relative px-3 py-2 text-sm font-medium transition-all duration-200"
              style={{
                color:
                  activeSection === link.id
                    ? "oklch(0.82 0.15 195)"
                    : "oklch(0.72 0.02 220)",
              }}
            >
              {link.label}
              {activeSection === link.id && (
                <span
                  className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: "oklch(0.82 0.15 195)" }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="md:hidden p-2 text-muted-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          data-ocid="nav.menu.toggle"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-1"
          style={{
            background: "oklch(0.12 0.013 240 / 0.95)",
            borderColor: "oklch(0.94 0.01 220 / 0.08)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              type="button"
              key={link.id}
              onClick={() => scrollTo(link.id)}
              data-ocid={`nav.mobile.${link.id}.link`}
              className="text-left px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-white/5"
              style={{
                color:
                  activeSection === link.id
                    ? "oklch(0.82 0.15 195)"
                    : "oklch(0.72 0.02 220)",
              }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Top radial glow — bleeds from top */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: "-120px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.82 0.15 195 / 0.12) 0%, oklch(0.68 0.14 195 / 0.06) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Blob 1 — large cyan left */}
      <div
        className="animate-blob absolute pointer-events-none"
        aria-hidden
        style={{
          width: "820px",
          height: "580px",
          left: "-160px",
          top: "50%",
          transform: "translateY(-55%)",
          background:
            "radial-gradient(ellipse at center, oklch(0.82 0.15 195 / 0.22) 0%, oklch(0.68 0.14 195 / 0.10) 50%, transparent 70%)",
          filter: "blur(45px)",
          borderRadius: "50%",
        }}
      />

      {/* Blob 2 — medium cyan bottom-right */}
      <div
        className="animate-blob absolute pointer-events-none"
        aria-hidden
        style={{
          animationDelay: "3s",
          width: "500px",
          height: "500px",
          right: "2%",
          bottom: "8%",
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.15 195 / 0.18) 0%, transparent 65%)",
          filter: "blur(55px)",
          borderRadius: "50%",
        }}
      />

      {/* Blob 3 — violet/purple top-right (new) */}
      <div
        className="animate-blob-alt absolute pointer-events-none"
        aria-hidden
        style={{
          animationDelay: "1.5s",
          width: "560px",
          height: "420px",
          right: "-80px",
          top: "8%",
          background:
            "radial-gradient(ellipse at center, oklch(0.68 0.14 195 / 0.18) 0%, oklch(0.60 0.12 145 / 0.08) 50%, transparent 70%)",
          filter: "blur(50px)",
          borderRadius: "50%",
        }}
      />

      {/* Blob 4 — smaller violet mid-left (new) */}
      <div
        className="animate-blob absolute pointer-events-none"
        aria-hidden
        style={{
          animationDelay: "5s",
          width: "320px",
          height: "320px",
          left: "30%",
          top: "12%",
          background:
            "radial-gradient(ellipse at center, oklch(0.68 0.14 195 / 0.10) 0%, transparent 65%)",
          filter: "blur(40px)",
          borderRadius: "50%",
        }}
      />

      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.cls}
          aria-hidden
          className={`absolute pointer-events-none rounded-full ${p.cls}`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-center">
          {/* Left: text */}
          <div className="text-center">
            <div className="animate-fade-up">
              <span
                className="inline-block text-sm font-medium tracking-widest uppercase mb-6 px-4 py-2 rounded-full border"
                style={{
                  color: "oklch(0.82 0.15 195)",
                  borderColor: "oklch(0.82 0.15 195 / 0.2)",
                  background: "oklch(0.82 0.15 195 / 0.06)",
                }}
              >
                Welcome to my portfolio
              </span>
            </div>

            <h1 className="animate-fade-up-delay-1 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-4">
              Hi, I&apos;m{" "}
              <span style={{ color: "oklch(0.82 0.15 195)" }}>Yaswanth</span>
              <br />
              <span className="text-foreground">Jayamangala</span>
            </h1>

            <p
              className="animate-fade-up-delay-2 text-lg md:text-xl font-medium mb-4"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              Data Science Enthusiast | Data Analyst
            </p>

            <p
              className="animate-fade-up-delay-3 text-base md:text-lg max-w-xl mb-10 leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              Turning raw data into meaningful insights, one model at a time.
            </p>

            <div className="animate-fade-up-delay-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                data-ocid="hero.view_projects.button"
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group font-semibold px-8 gap-2 transition-all duration-200"
                style={{
                  background: "oklch(0.82 0.15 195)",
                  color: "oklch(0.12 0.013 240)",
                }}
              >
                View Projects
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                data-ocid="hero.download_cv.button"
                asChild
                className="font-semibold px-8 gap-2 transition-all duration-200"
                style={{
                  borderColor: "oklch(0.82 0.15 195 / 0.3)",
                  color: "oklch(0.82 0.15 195)",
                  background: "transparent",
                }}
              >
                <a
                  href="/assets/uploads/12403537-CV-1--1.pdf"
                  download="Yaswanth_CV.pdf"
                >
                  <Download size={16} />
                  Download CV
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "oklch(0.50 0.02 220)" }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div
          className="w-px h-8"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0.50 0.02 220), transparent)",
          }}
        />
      </div>
    </section>
  );
}

/** Glowing gradient divider line between sections */
function SectionDivider() {
  return <div className="section-divider" aria-hidden />;
}

function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.135 0.015 238 / 0.9) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="About Me" subtitle="A little about myself" />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-12">
          {/* Portrait card */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: "oklch(0.82 0.15 195 / 0.1)",
                  filter: "blur(24px)",
                  transform: "scale(0.94) translateY(10px)",
                }}
              />
              <div
                className="relative overflow-hidden"
                style={{
                  width: "300px",
                  height: "400px",
                  borderRadius: "1.5rem",
                  border: "1px solid oklch(0.82 0.15 195 / 0.2)",
                  boxShadow: "0 0 40px oklch(0.82 0.15 195 / 0.08)",
                }}
              >
                <img
                  src={PHOTO_SRC}
                  alt="Yaswanth Jayamangala"
                  className="w-full h-full object-cover object-center"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.15 195 / 0.06) 0%, transparent 55%)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Text block */}
          <div className="space-y-5">
            <h3
              className="text-2xl font-bold"
              style={{ color: "oklch(0.94 0.01 220)" }}
            >
              B.Tech CSE Student &amp;{" "}
              <span style={{ color: "oklch(0.82 0.15 195)" }}>
                Data Science Minor
              </span>
            </h3>
            <p
              className="leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              I&apos;m a 3rd-year Computer Science Engineering student at Lovely
              Professional University (LPU), pursuing a minor in Data Science.
              I&apos;m passionate about transforming complex datasets into
              actionable insights.
            </p>
            <p
              className="leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              My journey spans predictive modeling, data analytics, and building
              machine learning pipelines — from raw preprocessing to model
              deployment. I love tackling real-world problems through the lens
              of data.
            </p>
            <p
              className="leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              When I&apos;m not training models or wrangling data, I&apos;m
              exploring the latest in AI research and contributing to
              open-source data science projects.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {[
                "Problem Solving",
                "Machine Learning",
                "Data Analytics",
                "Python",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    color: "oklch(0.82 0.15 195)",
                    borderColor: "oklch(0.82 0.15 195 / 0.25)",
                    background: "oklch(0.82 0.15 195 / 0.07)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6">
      <div
        className="max-w-6xl mx-auto"
        style={{
          background: "oklch(0.14 0.014 240)",
          borderRadius: "1.5rem",
          border: "1px solid oklch(0.94 0.01 220 / 0.07)",
          padding: "3rem 2.5rem",
        }}
      >
        <SectionHeading
          title="Skills & Tech Stack"
          subtitle="Technologies I work with"
        />

        <div className="mt-12 space-y-10">
          {SKILL_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.category}>
                <div
                  className="flex items-center gap-2 mb-5"
                  style={{ color: "oklch(0.82 0.15 195)" }}
                >
                  <Icon size={18} />
                  <h3 className="font-semibold text-sm tracking-wide uppercase">
                    {group.category}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2.5 rounded-full text-sm font-medium border cursor-default transition-all duration-200 hover:scale-105"
                      style={{
                        background: "oklch(0.18 0.015 240)",
                        borderColor: "oklch(0.94 0.01 220 / 0.1)",
                        color: "oklch(0.86 0.01 220)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "oklch(0.82 0.15 195 / 0.4)";
                        (e.currentTarget as HTMLDivElement).style.color =
                          "oklch(0.82 0.15 195)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "0 0 12px oklch(0.82 0.15 195 / 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.borderColor =
                          "oklch(0.94 0.01 220 / 0.1)";
                        (e.currentTarget as HTMLDivElement).style.color =
                          "oklch(0.86 0.01 220)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow =
                          "none";
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectDetail;
  onClose: () => void;
}) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "oklch(0.08 0.01 240 / 0.85)" }}
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      data-ocid="projects.modal"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl"
        style={{
          background: "oklch(0.14 0.015 240)",
          borderColor: "oklch(0.82 0.15 195 / 0.2)",
          boxShadow: "0 0 60px oklch(0.82 0.15 195 / 0.12)",
        }}
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Header image */}
        {project.image && (
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, oklch(0.14 0.015 240) 100%)",
              }}
            />
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="projects.close_button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            background: "oklch(0.20 0.015 240)",
            border: "1px solid oklch(0.94 0.01 220 / 0.15)",
            color: "oklch(0.75 0.02 220)",
          }}
        >
          <X size={16} />
        </button>

        <div className="p-6 pt-4">
          {/* Title & status */}
          <div className="flex items-start gap-3 mb-2">
            <h2
              className="font-bold text-xl leading-tight flex-1"
              style={{ color: "oklch(0.94 0.01 220)" }}
            >
              {project.title}
            </h2>
            <span
              className={`mt-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_STYLES[project.statusColor]}`}
            >
              {project.status}
            </span>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full mb-5"
            style={{ background: "oklch(0.94 0.01 220 / 0.08)" }}
          />

          {/* Overview */}
          <section className="mb-5">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              Overview
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              {project.overview}
            </p>
          </section>

          {/* Tech Stack */}
          <section className="mb-5">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="text-xs font-medium"
                  style={{
                    background: "oklch(0.82 0.15 195 / 0.1)",
                    color: "oklch(0.82 0.15 195)",
                    border: "1px solid oklch(0.82 0.15 195 / 0.25)",
                  }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section className="mb-5">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              Workflow
            </h3>
            <ol className="space-y-3">
              {project.workflow.map((item, idx) => (
                <li key={item.step} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: "oklch(0.82 0.15 195 / 0.15)",
                      color: "oklch(0.82 0.15 195)",
                      border: "1px solid oklch(0.82 0.15 195 / 0.3)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.88 0.01 220)" }}
                    >
                      {item.step}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "oklch(0.62 0.02 220)" }}
                    >
                      {" "}
                      – {item.detail}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* Results */}
          <section className="mb-6">
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              Results / Output
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "oklch(0.72 0.02 220)" }}
            >
              {project.results}
            </p>
          </section>

          {/* GitHub Link */}
          <section>
            <h3
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "oklch(0.82 0.15 195)" }}
            >
              GitHub
            </h3>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="projects.link"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{
                background: "oklch(0.82 0.15 195 / 0.1)",
                color: "oklch(0.82 0.15 195)",
                border: "1px solid oklch(0.82 0.15 195 / 0.25)",
              }}
            >
              <Github size={15} />
              View on GitHub
              <ExternalLink size={13} />
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(
    null,
  );

  return (
    <>
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
      <section
        id="projects"
        className="py-24 px-6 relative"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.13 0.014 236 / 0.85) 0%, oklch(0.12 0.013 240) 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            title="Projects"
            subtitle="Things I've built and exploring"
          />

          <div className="mt-12 grid sm:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <article
                key={project.id}
                data-ocid={`projects.item.${i + 1}`}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "oklch(0.16 0.015 240)",
                  borderColor: "oklch(0.94 0.01 220 / 0.08)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.82 0.15 195 / 0.25)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 40px oklch(0.82 0.15 195 / 0.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "oklch(0.94 0.01 220 / 0.08)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className="relative h-44 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.18 0.02 240), oklch(0.20 0.025 210))",
                      }}
                    >
                      <BarChart3
                        size={40}
                        style={{ color: "oklch(0.82 0.15 195 / 0.3)" }}
                      />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[project.statusColor]}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3
                    className="font-bold text-lg mb-2"
                    style={{ color: "oklch(0.94 0.01 220)" }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "oklch(0.65 0.02 220)" }}
                  >
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-xs font-medium"
                        style={{
                          background: "oklch(0.20 0.018 240)",
                          color: "oklch(0.72 0.02 220)",
                          border: "1px solid oklch(0.94 0.01 220 / 0.08)",
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    data-ocid={`projects.view.button.${i + 1}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group/link hover:gap-2"
                    style={{ color: "oklch(0.82 0.15 195)" }}
                  >
                    View Details
                    <ExternalLink
                      size={14}
                      className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200"
                    />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InternshipSection() {
  return (
    <section
      id="internship"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.135 0.015 238 / 0.8) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Internship Experience"
          subtitle="Real-world exposure"
        />

        <div
          className="mt-12 rounded-2xl border p-8 transition-all duration-300"
          style={{
            background: "oklch(0.16 0.015 240)",
            borderColor: "oklch(0.82 0.15 195 / 0.18)",
            boxShadow: "0 0 40px oklch(0.82 0.15 195 / 0.05)",
          }}
          data-ocid="internship.card"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border"
                style={{
                  background: "oklch(0.82 0.15 195 / 0.1)",
                  borderColor: "oklch(0.82 0.15 195 / 0.25)",
                }}
              >
                <Briefcase
                  size={22}
                  style={{ color: "oklch(0.82 0.15 195)" }}
                />
              </div>
              <div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: "oklch(0.94 0.01 220)" }}
                >
                  BSNL (Bharat Sanchar Nigam Limited)
                </h3>
                <p
                  className="text-sm mt-0.5"
                  style={{ color: "oklch(0.65 0.02 220)" }}
                >
                  Eluru, Andhra Pradesh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  background: "oklch(0.82 0.15 195 / 0.1)",
                  borderColor: "oklch(0.82 0.15 195 / 0.25)",
                  color: "oklch(0.82 0.15 195)",
                }}
              >
                Intern
              </span>
              <span
                className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  background: "oklch(0.68 0.15 195 / 0.1)",
                  borderColor: "oklch(0.68 0.15 195 / 0.25)",
                  color: "oklch(0.68 0.15 195)",
                }}
              >
                6 Months
              </span>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{
              background:
                "linear-gradient(to right, oklch(0.82 0.15 195 / 0.2), transparent)",
            }}
          />

          {/* Bullet points */}
          <ul className="space-y-4">
            {INTERNSHIP_BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: "oklch(0.82 0.15 195)" }}
                />
                <span
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(0.72 0.02 220)" }}
                >
                  {bullet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CertificatesSection() {
  return (
    <section
      id="certificates"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.13 0.014 236 / 0.85) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Certificates"
          subtitle="Achievements & Credentials"
        />

        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {CERTIFICATES.map((cert, i) => (
            <div
              key={cert.name}
              data-ocid={`certificates.item.${i + 1}`}
              className="rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "oklch(0.16 0.015 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 195 / 0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 40px oklch(0.82 0.15 195 / 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.94 0.01 220 / 0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              {/* Icon + name */}
              <div className="flex items-center gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border"
                  style={{
                    background: "oklch(0.82 0.15 195 / 0.1)",
                    borderColor: "oklch(0.82 0.15 195 / 0.2)",
                  }}
                >
                  <Award size={22} style={{ color: "oklch(0.82 0.15 195)" }} />
                </div>
                <div>
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.94 0.01 220)" }}
                  >
                    {cert.name}
                  </h3>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "oklch(0.55 0.02 220)" }}
                  >
                    PDF Certificate
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid={`certificates.view.button.${i + 1}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.82 0.15 195 / 0.08)",
                    borderColor: "oklch(0.82 0.15 195 / 0.25)",
                    color: "oklch(0.82 0.15 195)",
                  }}
                >
                  <ExternalLink size={14} />
                  View
                </a>
                <a
                  href={cert.file}
                  download={`${cert.name}.pdf`}
                  data-ocid={`certificates.download.button.${i + 1}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: "oklch(0.16 0.015 240)",
                    borderColor: "oklch(0.94 0.01 220 / 0.12)",
                    color: "oklch(0.72 0.02 220)",
                  }}
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CompetitiveSection() {
  const platforms = [
    {
      name: "HackerRank",
      detail: "5★ Python · 4★ Problem Solving",
      color: "oklch(0.72 0.18 145)",
      bg: "oklch(0.72 0.18 145 / 0.12)",
      border: "oklch(0.72 0.18 145 / 0.25)",
    },
    {
      name: "LeetCode",
      detail: "120+ Problems · Easy 60 · Med 45 · Hard 15",
      color: "oklch(0.80 0.18 55)",
      bg: "oklch(0.80 0.18 55 / 0.12)",
      border: "oklch(0.80 0.18 55 / 0.25)",
    },
    {
      name: "HackerEarth",
      detail: "3+ Coding Contests Participated",
      color: "oklch(0.70 0.18 250)",
      bg: "oklch(0.70 0.18 250 / 0.12)",
      border: "oklch(0.70 0.18 250 / 0.25)",
    },
  ];
  const hackathons = [
    {
      name: "Smart India Hackathon (SIH) 2023",
      role: "Team Member",
      outcome:
        "College-level Participation — Data Analytics Solution for Agriculture",
      badge: "SIH 2023",
    },
    {
      name: "Internal Hackathon — LPU",
      role: "Team Lead",
      outcome: "Presented AI-powered Health Monitoring Dashboard",
      badge: "LPU Hack",
    },
  ];
  return (
    <section
      id="competitive"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.013 238 / 0.9) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Competitive Programming & Hackathons"
          subtitle="Coding Arenas & Challenges"
        />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {platforms.map((p, i) => (
            <div
              key={p.name}
              data-ocid={`competitive.item.${i + 1}`}
              className="rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
              style={{ background: p.bg, borderColor: p.border }}
            >
              <div className="flex items-center gap-3">
                <Trophy size={20} style={{ color: p.color }} />
                <span
                  className="font-bold text-base"
                  style={{ color: "oklch(0.94 0.01 220)" }}
                >
                  {p.name}
                </span>
              </div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.03 220)" }}>
                {p.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid sm:grid-cols-2 gap-5">
          {hackathons.map((h, i) => (
            <div
              key={h.name}
              data-ocid={`competitive.hackathon.item.${i + 1}`}
              className="rounded-2xl border p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "oklch(0.15 0.014 240)",
                borderColor: "oklch(0.82 0.15 195 / 0.12)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 195 / 0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 32px oklch(0.82 0.15 195 / 0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 195 / 0.12)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="font-bold text-base leading-snug"
                  style={{ color: "oklch(0.94 0.01 220)" }}
                >
                  {h.name}
                </h3>
                <span
                  className="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-lg"
                  style={{
                    background: "oklch(0.82 0.15 195 / 0.12)",
                    color: "oklch(0.82 0.15 195)",
                  }}
                >
                  {h.badge}
                </span>
              </div>
              <p
                className="text-xs font-semibold tracking-wider uppercase"
                style={{ color: "oklch(0.82 0.15 195)" }}
              >
                {h.role}
              </p>
              <p className="text-sm" style={{ color: "oklch(0.65 0.03 220)" }}>
                {h.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const articles = [
    {
      title: "Getting Started with Pandas for Data Analysis",
      platform: "Medium",
      platformColor: "oklch(0.94 0.01 220)",
      platformBg: "oklch(0.94 0.01 220 / 0.1)",
      desc: "A beginner-friendly guide covering DataFrames, data cleaning, groupby operations, and real-world data wrangling techniques using Pandas.",
      views: "Featured Article",
    },
    {
      title: "Power BI vs Excel: Which Tool is Right for Data Analysis?",
      platform: "LinkedIn Article",
      platformColor: "oklch(0.70 0.18 250)",
      platformBg: "oklch(0.70 0.18 250 / 0.1)",
      desc: "A practical comparison for aspiring data analysts — covering use-cases, visualization capabilities, performance, and when to use each tool.",
      views: "150+ Views",
    },
  ];
  return (
    <section
      id="blog"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.11 0.013 238 / 0.9) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Blog & Technical Writing"
          subtitle="Knowledge Sharing"
        />
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {articles.map((a, i) => (
            <div
              key={a.title}
              data-ocid={`blog.item.${i + 1}`}
              className="rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "oklch(0.15 0.014 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.82 0.15 195 / 0.25)";
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 32px oklch(0.82 0.15 195 / 0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.94 0.01 220 / 0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.82 0.15 195 / 0.1)" }}
                >
                  <PenLine
                    size={18}
                    style={{ color: "oklch(0.82 0.15 195)" }}
                  />
                </div>
                <h3
                  className="font-bold text-sm leading-snug"
                  style={{ color: "oklch(0.94 0.01 220)" }}
                >
                  {a.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{ background: a.platformBg, color: a.platformColor }}
                >
                  {a.platform}
                </span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "oklch(0.72 0.18 145 / 0.1)",
                    color: "oklch(0.72 0.18 145)",
                  }}
                >
                  {a.views}
                </span>
              </div>
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "oklch(0.65 0.03 220)" }}
              >
                {a.desc}
              </p>
              <a
                href="https://medium.com"
                target="_blank"
                rel="noopener noreferrer"
                data-ocid={`blog.link.${i + 1}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-70 mt-auto"
                style={{ color: "oklch(0.82 0.15 195)" }}
              >
                <BookOpen size={14} />
                Read More
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchSection() {
  const papers = [
    {
      title:
        "Predictive Analysis of Student Course Completion Using Machine Learning",
      status: "Under Review",
      statusColor: "oklch(0.80 0.18 55)",
      statusBg: "oklch(0.80 0.18 55 / 0.12)",
      venue: "International Journal of Educational Technology",
      abstract:
        "Explores ML-based models (Random Forest, Logistic Regression) to predict student dropout rates and course completion probabilities using engagement metrics and historical academic data.",
    },
    {
      title: "Social Media News Feed Algorithm: A Machine Learning Approach",
      status: "Published",
      statusColor: "oklch(0.72 0.18 145)",
      statusBg: "oklch(0.72 0.18 145 / 0.12)",
      venue:
        "Internal Publication — Lovely Professional University, Dept. of CSE",
      abstract:
        "Presents a scoring-based feed ranking algorithm using user interaction signals (likes, shares, comments) and content recency to generate personalized social media feeds.",
    },
  ];
  return (
    <section
      id="research"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.12 0.013 240) 0%, oklch(0.13 0.014 236 / 0.85) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Research & Publications"
          subtitle="Academic Contributions"
        />
        <div className="mt-12 flex flex-col gap-6">
          {papers.map((p, i) => (
            <div
              key={p.title}
              data-ocid={`research.item.${i + 1}`}
              className="rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: "oklch(0.15 0.014 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.08)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  p.statusColor.replace(")", " / 0.3)");
                (e.currentTarget as HTMLElement).style.boxShadow =
                  `0 8px 32px ${p.statusColor.replace(")", " / 0.07)")}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  "oklch(0.94 0.01 220 / 0.08)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: p.statusBg }}
                >
                  <FlaskConical size={20} style={{ color: p.statusColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <h3
                      className="font-bold text-base leading-snug"
                      style={{ color: "oklch(0.94 0.01 220)" }}
                    >
                      {p.title}
                    </h3>
                    <span
                      className="flex-shrink-0 text-xs font-bold px-3 py-1 rounded-full"
                      style={{ background: p.statusBg, color: p.statusColor }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <FileText
                      size={13}
                      style={{ color: "oklch(0.55 0.02 220)" }}
                    />
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.02 220)" }}
                    >
                      {p.venue}
                    </p>
                  </div>
                </div>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "oklch(0.65 0.03 220)" }}
              >
                {p.abstract}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EducationContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormState({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="education"
      className="py-24 px-6 relative"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.135 0.015 238 / 0.8) 0%, oklch(0.12 0.013 240) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
        {/* Education */}
        <div>
          <div
            className="flex items-center gap-3 mb-8"
            style={{ color: "oklch(0.82 0.15 195)" }}
          >
            <GraduationCap size={24} />
            <h2
              className="text-2xl font-bold"
              style={{ color: "oklch(0.94 0.01 220)" }}
            >
              Education
            </h2>
          </div>

          <div className="relative pl-8">
            {/* Vertical timeline line */}
            <div
              className="absolute left-2.5 top-0 bottom-0 w-px"
              style={{
                background:
                  "linear-gradient(to bottom, oklch(0.82 0.15 195 / 0.4), oklch(0.82 0.15 195 / 0.15) 60%, transparent)",
              }}
            />

            {/* Entry 1: 10th Class — Completed */}
            <div className="relative mb-8" data-ocid="education.item.1">
              <div
                className="absolute top-1.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: "oklch(0.60 0.08 200)",
                  background: "oklch(0.60 0.08 200 / 0.5)",
                  left: "-1.3rem",
                }}
              />
              <div
                className="rounded-xl p-5 border"
                style={{
                  background: "oklch(0.16 0.015 240)",
                  borderColor: "oklch(0.94 0.01 220 / 0.08)",
                }}
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.94 0.01 220)" }}
                  >
                    10th Class
                  </h3>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.68 0.15 195 / 0.12)",
                      color: "oklch(0.68 0.15 195)",
                    }}
                  >
                    Completed
                  </span>
                </div>
                <p
                  className="font-medium text-sm"
                  style={{ color: "oklch(0.72 0.05 200)" }}
                >
                  Sasi English Medium High School, Eluru, Andhra Pradesh
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.55 0.02 220)" }}
                >
                  Secondary School Certificate (SSC)
                </p>
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: "oklch(0.82 0.15 195)" }}
                >
                  CGPA: 10.0
                </p>
              </div>
            </div>

            {/* Entry 2: Diploma — Completed */}
            <div className="relative mb-8" data-ocid="education.item.2">
              <div
                className="absolute top-1.5 w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: "oklch(0.60 0.08 200)",
                  background: "oklch(0.60 0.08 200 / 0.5)",
                  left: "-1.3rem",
                }}
              />
              <div
                className="rounded-xl p-5 border"
                style={{
                  background: "oklch(0.16 0.015 240)",
                  borderColor: "oklch(0.94 0.01 220 / 0.08)",
                }}
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.94 0.01 220)" }}
                  >
                    Diploma in CSE
                  </h3>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.68 0.15 195 / 0.12)",
                      color: "oklch(0.68 0.15 195)",
                    }}
                  >
                    Completed
                  </span>
                </div>
                <p
                  className="font-medium text-sm"
                  style={{ color: "oklch(0.72 0.05 200)" }}
                >
                  AANM &amp; VVRSR College of Engineering, Gudlavalleru
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.55 0.02 220)" }}
                >
                  Diploma in Computer Science Engineering
                </p>
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: "oklch(0.82 0.15 195)" }}
                >
                  CGPA: 9.1
                </p>
              </div>
            </div>

            {/* Entry 3: B.Tech — Current (glowing dot) */}
            <div className="relative" data-ocid="education.item.3">
              <div
                className="absolute top-1.5 w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: "oklch(0.82 0.15 195)",
                  background: "oklch(0.82 0.15 195)",
                  boxShadow: "0 0 10px oklch(0.82 0.15 195 / 0.6)",
                  left: "-1.375rem",
                }}
              />
              <div
                className="rounded-xl p-5 border"
                style={{
                  background: "oklch(0.16 0.015 240)",
                  borderColor: "oklch(0.82 0.15 195 / 0.18)",
                  boxShadow: "0 0 20px oklch(0.82 0.15 195 / 0.05)",
                }}
              >
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <h3
                    className="font-bold text-base"
                    style={{ color: "oklch(0.94 0.01 220)" }}
                  >
                    B.Tech — Computer Science Engineering
                  </h3>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: "oklch(0.82 0.15 195 / 0.1)",
                      color: "oklch(0.82 0.15 195)",
                    }}
                  >
                    2022 – Present
                  </span>
                </div>
                <p
                  className="font-medium text-sm"
                  style={{ color: "oklch(0.82 0.15 195)" }}
                >
                  Lovely Professional University (LPU)
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.65 0.02 220)" }}
                >
                  Currently in 3rd Year
                </p>
                <p
                  className="text-sm mt-1 font-semibold"
                  style={{ color: "oklch(0.82 0.15 195)" }}
                >
                  CGPA: 7.5 (Present)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div id="contact">
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "oklch(0.94 0.01 220)" }}
          >
            Get In Touch
          </h2>
          <p className="mb-8 text-sm" style={{ color: "oklch(0.65 0.02 220)" }}>
            Open for internship opportunities. Let&apos;s connect!
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              {
                icon: Mail,
                label: "Email",
                href: "mailto:yaswanth234239@gmail.com",
                ocid: "contact.email.link",
              },
              {
                icon: Linkedin,
                label: "LinkedIn",
                href: "https://www.linkedin.com/in/yaswanthjayamangala/",
                ocid: "contact.linkedin.link",
              },
              {
                icon: Github,
                label: "GitHub",
                href: "https://github.com/Yaswanthhh1432",
                ocid: "contact.github.link",
              },
              {
                icon: Phone,
                label: "9440017129",
                href: "tel:+919440017129",
                ocid: "contact.phone.link",
              },
            ].map(({ icon: Icon, label, href, ocid }) => (
              <a
                key={label}
                href={href}
                target={
                  href.startsWith("mailto") || href.startsWith("tel")
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                data-ocid={ocid}
                title={label}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "oklch(0.16 0.015 240)",
                  borderColor: "oklch(0.94 0.01 220 / 0.1)",
                  color: "oklch(0.72 0.02 220)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "oklch(0.82 0.15 195 / 0.3)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "oklch(0.82 0.15 195)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 12px oklch(0.82 0.15 195 / 0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor =
                    "oklch(0.94 0.01 220 / 0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "oklch(0.72 0.02 220)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "none";
                }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </a>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            data-ocid="contact.form"
            className="space-y-4"
          >
            <Input
              type="text"
              placeholder="Your name"
              value={formState.name}
              onChange={(e) =>
                setFormState((p) => ({ ...p, name: e.target.value }))
              }
              data-ocid="contact.name.input"
              required
              className="border text-sm"
              style={{
                background: "oklch(0.16 0.015 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.12)",
                color: "oklch(0.94 0.01 220)",
              }}
            />
            <Input
              type="email"
              placeholder="Your email"
              value={formState.email}
              onChange={(e) =>
                setFormState((p) => ({ ...p, email: e.target.value }))
              }
              data-ocid="contact.email.input"
              required
              className="border text-sm"
              style={{
                background: "oklch(0.16 0.015 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.12)",
                color: "oklch(0.94 0.01 220)",
              }}
            />
            <Textarea
              placeholder="Your message..."
              value={formState.message}
              onChange={(e) =>
                setFormState((p) => ({ ...p, message: e.target.value }))
              }
              data-ocid="contact.message.textarea"
              required
              rows={4}
              className="border text-sm resize-none"
              style={{
                background: "oklch(0.16 0.015 240)",
                borderColor: "oklch(0.94 0.01 220 / 0.12)",
                color: "oklch(0.94 0.01 220)",
              }}
            />
            <Button
              type="submit"
              data-ocid="contact.submit.button"
              className="w-full font-semibold transition-all duration-200"
              style={{
                background: submitted
                  ? "oklch(0.68 0.15 195)"
                  : "oklch(0.82 0.15 195)",
                color: "oklch(0.12 0.013 240)",
              }}
            >
              {submitted ? "Message Sent! ✓" : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
}: { title: string; subtitle?: string }) {
  return (
    <div>
      {subtitle && (
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-2"
          style={{ color: "oklch(0.82 0.15 195)" }}
        >
          {subtitle}
        </p>
      )}
      <h2
        className="text-3xl font-extrabold"
        style={{ color: "oklch(0.94 0.01 220)" }}
      >
        {title}
      </h2>
      <div
        className="mt-3 h-1 w-16 rounded-full"
        style={{ background: "oklch(0.82 0.15 195)" }}
      />
    </div>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="py-8 px-6 text-center border-t"
      style={{ borderColor: "oklch(0.94 0.01 220 / 0.06)" }}
    >
      <p className="text-xs" style={{ color: "oklch(0.45 0.02 220)" }}>
        © {year} Yaswanth Jayamangala. Built with ♥ using{" "}
        <a
          href={utmLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline transition-colors duration-200 hover:text-muted-foreground"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const targets = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );

    for (const t of targets) observerRef.current?.observe(t);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "oklch(0.09 0.012 240)" }}
    >
      {/* Animated particle canvas background */}
      <ParticleCanvas />
      {/* Global dot-grid texture overlay */}
      <div
        aria-hidden
        className="bg-dot-grid fixed inset-0 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar activeSection={activeSection} />
        <main>
          <HeroSection />
          <SectionDivider />
          <AboutSection />
          <SectionDivider />
          <SkillsSection />
          <SectionDivider />
          <ProjectsSection />
          <SectionDivider />
          <InternshipSection />
          <SectionDivider />
          <CertificatesSection />
          <SectionDivider />
          <CompetitiveSection />
          <SectionDivider />
          <BlogSection />
          <SectionDivider />
          <ResearchSection />
          <SectionDivider />
          <EducationContactSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
