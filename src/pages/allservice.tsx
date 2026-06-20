import React, { useEffect, useRef, useState } from "react";
import { 
Heart, 
Shield, 
Clock, 
Award,
ChevronRight,
Calendar,
CheckCircle,
Search
} from "lucide-react";

// ---------------------------------------------------------------------------
// TypeScript Interfaces
// ---------------------------------------------------------------------------
interface RevealProps {
children: React.ReactNode;
delay?: number;
className?: string;
}

interface ServiceCardProps {
icon: React.ComponentType<{ className?: string }>;
title: string;
desc: string;
index: number;
}

interface ProcessStepProps {
icon: React.ComponentType<{ className?: string }>;
label: string;
num: string;
index: number;
}

// ---------------------------------------------------------------------------
// Sub Components
// ---------------------------------------------------------------------------
function Reveal({ children, delay = 0, className = "" }: RevealProps) {
const [isIntersecting, setIsIntersecting] = useState(false);
const ref = useRef<HTMLDivElement>(null);

useEffect(() => {
const observer = new IntersectionObserver(
    ([entry]) => {
    if (entry.isIntersecting) {
        setIsIntersecting(true);
        if (ref.current) observer.unobserve(ref.current);
    }
    },
    { threshold: 0.1 }
);

if (ref.current) {
    observer.observe(ref.current);
}

return () => observer.disconnect();
}, []);

return (
<div
    ref={ref}
    className={`${className} transition-all duration-700 ease-out`}
    style={{
    opacity: isIntersecting ? 1 : 0,
    transform: isIntersecting ? "translateY(0)" : "translateY(30px)",
    transitionDelay: `${delay}ms`,
    }}
>
    {children}
</div>
);
}

function ServiceCard({ icon: Icon, title, desc, index }: ServiceCardProps) {
return (
<Reveal delay={index * 100} className="h-full">
    <div className="group h-full bg-white border border-[#E7E1D3] p-8 hover:border-[#C9BFA3] transition-all duration-300 hover:shadow-sm flex flex-col justify-between">
    <div>
        <div className="w-12 h-12 bg-[#FAF8F4] border border-[#E7E1D3] flex items-center justify-center text-[#1F1E1B] mb-6 group-hover:bg-[#1F1E1B] group-hover:text-[#FAF8F4] group-hover:border-[#1F1E1B] transition-all duration-300">
        <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-serif text-xl text-[#1F1E1B] mb-3">{title}</h3>
        <p className="text-sm text-[#6B6555] leading-relaxed mb-6">{desc}</p>
    </div>
    <button className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-[#1F1E1B] uppercase group-hover:text-[#9A8F73] transition-colors mt-auto pt-4 border-t border-[#FAF8F4]">
        Learn More <ChevronRight className="w-3 h-3" />
    </button>
    </div>
</Reveal>
);
}

function ProcessStep({ icon: Icon, label, num, index }: ProcessStepProps) {
return (
<Reveal delay={index * 150} className="relative flex flex-col items-center text-center px-4">
    <div className="w-16 h-16 rounded-full bg-white border border-[#E7E1D3] flex items-center justify-center text-[#1F1E1B] mb-4 relative z-10 shadow-sm">
    <Icon className="w-6 h-6" />
    <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#1F1E1B] text-[#FAF8F4] font-mono text-[10px] rounded-full flex items-center justify-center">
        {num}
    </span>
    </div>
    <p className="font-serif text-base text-[#1F1E1B] max-w-[150px] leading-snug">{label}</p>
</Reveal>
);
}

// ---------------------------------------------------------------------------
// Main Services Page Component
// ---------------------------------------------------------------------------
export default function AllServices() {
const services = [
{ icon: Heart, title: "Cardiology", desc: "Comprehensive heart care including diagnostics, advanced imaging, treatment planning, and structural heart interventions." },
{ icon: Shield, title: "Neurology", desc: "Expert diagnosis and management of complex brain, spine, and nervous system disorders using leading clinical methodologies." },
{ icon: Clock, title: "Emergency Care", desc: "24/7 rapid-response medical services fully equipped to handle critical, trauma, and acute cardiac emergencies instantly." },
{ icon: Award, title: "Orthopedics", desc: "Advanced joint replacement, sports medicine, and minimally invasive bone/spine surgical care tailored for complete mobility recovery." }
];

const steps = [
{ icon: Search, label: "Find Your Specialist", num: "01" },
{ icon: Calendar, label: "Book Appointment", num: "02" },
{ icon: CheckCircle, label: "Get Consultation", num: "03" }
];

return (
<div className="min-h-screen bg-[#FAF8F4]">
    {/* Hero Section */}
    <header className="px-6 sm:px-10 pt-20 pb-16 border-b border-[#E7E1D3] bg-white">
    <div className="max-w-[1500px] mx-auto">
        <span className="font-mono text-[10px] tracking-widest text-[#9A8F73] uppercase">
        Our Healthcare Offerings
        </span>
        <h1 className="font-serif text-[42px] sm:text-[56px] leading-[1.05] text-[#1F1E1B] mt-3 max-w-2xl">
        Medical Services & Specialities
        </h1>
        <p className="text-[15px] text-[#6B6555] mt-4 max-w-xl leading-relaxed">
        Delivering cross-disciplinary, patient-centered medical attention utilizing international standards and modern healthcare tech.
        </p>
    </div>
    </header>

    {/* Services Grid */}
    <main className="px-6 sm:px-10 py-20 max-w-[1500px] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, idx) => (
        <ServiceCard 
            key={service.title} 
            icon={service.icon} 
            title={service.title} 
            desc={service.desc} 
            index={idx} 
        />
        ))}
    </div>

    {/* Process Section */}
    <section className="mt-28 border-t border-[#E7E1D3] pt-20">
        <div className="text-center max-w-md mx-auto mb-14">
        <span className="font-mono text-[10px] tracking-widest text-[#9A8F73] uppercase">Workflow</span>
        <h2 className="font-serif text-3xl text-[#1F1E1B] mt-2">How It Works</h2>
        </div>

        <div className="relative max-w-3xl mx-auto flex flex-col sm:flex-row justify-between gap-12 sm:gap-6">
        {/* Background connecting line for desktop */}
        <div className="hidden sm:block absolute top-8 left-16 right-16 h-[1px] bg-[#E7E1D3] z-0" />
        
        {steps.map((step, idx) => (
            <ProcessStep 
            key={step.label}
            icon={step.icon}
            label={step.label}
            num={step.num}
            index={idx}
            />
        ))}
        </div>
    </section>
    </main>
</div>
);
}