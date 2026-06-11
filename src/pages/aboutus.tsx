import { useState } from "react";


const doctors = [
{
name: "Dr. Priya Mendis",
role: "Chief Medical Officer",
specialty: "Cardiology",
img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
exp: "18 yrs",
},
{
name: "Dr. Rohan Silva",
role: "Head of Surgery",
specialty: "General Surgery",
img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
exp: "14 yrs",
},
{
name: "Dr. Nadia Perera",
role: "Lead Paediatrician",
specialty: "Paediatrics",
img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop&crop=face",
exp: "11 yrs",
},
{
name: "Dr. Ashan Fernando",
role: "Neurology Specialist",
specialty: "Neurology",
img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop&crop=face",
exp: "16 yrs",
},
];

const galleryImages = [
{
src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500&h=400&fit=crop",
label: "ICU Ward",
},
{
src: "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=500&h=400&fit=crop",
label: "Operation Theatre",
},
{
src: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&h=500&fit=crop",
label: "Diagnostic Lab",
},
{
src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=500&h=400&fit=crop",
label: "Patient Rooms",
},
{
src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500&h=400&fit=crop",
label: "Radiology",
},
];

const stats = [
{ value: "25+", label: "Years of Excellence" },
{ value: "50K+", label: "Patients Treated" },
{ value: "120+", label: "Specialist Doctors" },
{ value: "98%", label: "Patient Satisfaction" },
];

const services = [
{ icon: "🫀", title: "Cardiology", desc: "Advanced cardiac care with state-of-the-art cath labs and cardiac ICU." },
{ icon: "🧠", title: "Neurology", desc: "Comprehensive brain & spine treatments using the latest neuro-imaging." },
{ icon: "🦷", title: "Dental Care", desc: "Full-service dental clinic from preventive care to complex implants." },
{ icon: "🧬", title: "Oncology", desc: "Precision cancer treatments with a compassionate multidisciplinary team." },
];

const SOCIAL = {
instagram: "https://instagram.com",
facebook: "https://facebook.com",
whatsapp: "https://wa.me/94XXXXXXXXXX",
};

export default function AboutUs() {
const [activeDoc, setActiveDoc] = useState(null);

return (
<div className="min-h-screen font-sans" style={{ backgroundColor: "#f0f8ff" }}>

    {/* ── NAV ── */}
    <nav
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 shadow-sm"
    style={{ backgroundColor: "#BCE6FF" }}
    >
    <div className="flex items-center gap-2">
        <div
        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
        style={{ backgroundColor: "#1a6fa0" }}
        >
        M+
        </div>
        <span className="font-semibold text-[#0d4a70] text-lg tracking-tight">MediClinic</span>
    </div>
    <div className="hidden md:flex gap-7 text-sm font-medium text-[#1a6fa0]">
        {["Home", "About", "Services", "Doctors", "Contact"].map((n) => (
        <a key={n} href="#" className="hover:text-[#0d4a70] transition-colors">{n}</a>
        ))}
    </div>
    <a
        href={SOCIAL.whatsapp}
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full text-white transition-all hover:opacity-90"
        style={{ backgroundColor: "#25D366" }}
    >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Chat with Us
    </a>
    </nav>

    {/* ── HERO ── */}
    <section className="pt-20 pb-0 relative overflow-hidden" style={{ background: "linear-gradient(180deg,#BCE6FF 0%,#e8f6ff 100%)" }}>
    <div className="max-w-6xl mx-auto px-6 pt-16 pb-8 flex flex-col items-center text-center">
        <span
        className="text-xs font-semibold tracking-widest uppercase mb-4 px-4 py-1.5 rounded-full"
        style={{ backgroundColor: "#88CDF6", color: "#0d4a70" }}
        >
        Trusted Healthcare Since 1999
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5 text-[#0d4a70]">
        We Promise Care That<br />
        <span style={{ color: "#1a8fc1" }}>Leaves Nothing to Ask For</span>
        </h1>
        <p className="text-[#2a6f96] text-lg max-w-2xl leading-relaxed mb-8">
        MediClinic is Sri Lanka's leading multi-speciality hospital, combining world-class medical expertise with genuine human compassion — every patient, every visit.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
        <a
            href={SOCIAL.whatsapp}
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3 rounded-full text-white font-semibold text-sm transition-all hover:opacity-90 shadow-md"
            style={{ backgroundColor: "#1a8fc1" }}
        >
            Book an Appointment
        </a>
        <a
            href="#about"
            className="px-7 py-3 rounded-full font-semibold text-sm border-2 transition-all hover:bg-white"
            style={{ borderColor: "#1a8fc1", color: "#1a8fc1" }}
        >
            Learn More ↓
        </a>
        </div>
    </div>

    {/* Gallery fan — inspired by hotel design */}
    <div className="relative flex justify-center items-end gap-3 md:gap-4 mt-8 px-4 h-64 md:h-80 overflow-visible">
        {galleryImages.map((img, i) => {
        const angles = [-18, -9, 0, 9, 18];
        const scales = [0.78, 0.88, 1, 0.88, 0.78];
        const tops = [28, 14, 0, 14, 28];
        return (
            <div
            key={i}
            className="absolute rounded-2xl overflow-hidden shadow-lg border-4 border-white transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer"
            style={{
                width: i === 2 ? "200px" : "140px",
                height: i === 2 ? "240px" : "180px",
                left: `${12 + i * 19}%`,
                bottom: 0,
                transform: `rotate(${angles[i]}deg) translateY(${tops[i]}px) scale(${scales[i]})`,
                transformOrigin: "bottom center",
                zIndex: i === 2 ? 10 : 5 - Math.abs(i - 2),
            }}
            >
            <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-xs font-semibold text-white text-center" style={{ background: "rgba(13,74,112,0.7)" }}>
                {img.label}
            </div>
            </div>
        );
        })}
    </div>
    </section>

    {/* ── STATS BAR ── */}
    <section style={{ backgroundColor: "#0d4a70" }} className="py-8">
    <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s) => (
        <div key={s.label}>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm mt-1" style={{ color: "#88CDF6" }}>{s.label}</p>
        </div>
        ))}
    </div>
    </section>

    {/* ── ABOUT SECTION ── */}
    <section id="about" className="py-20 max-w-6xl mx-auto px-6">
    <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#1a8fc1" }}>About Us</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0d4a70] mt-2 mb-5 leading-snug">
            Finally, a place for<br />all the things.
        </h2>
        <p className="text-[#2a6f96] leading-relaxed mb-5">
            Founded in 1999, MediClinic has grown from a single general practice into a sprawling 450-bed multi-speciality hospital spanning 3 hectares in the heart of the city. Our mission has always been simple: bring the best of medical science to every patient, with warmth.
        </p>
        <p className="text-[#2a6f96] leading-relaxed mb-7">
            With 120+ full-time specialists, round-the-clock emergency services, and cutting-edge diagnostics, we are equipped to handle everything from routine check-ups to the most complex surgeries.
        </p>
        <div className="flex gap-4">
            {[
            { href: SOCIAL.facebook, label: "Facebook", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, color: "#1877F2" },
            { href: SOCIAL.instagram, label: "Instagram", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, color: "#E1306C" },
            { href: SOCIAL.whatsapp, label: "WhatsApp", icon: <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, color: "#25D366" },
            ].map(({ href, label, icon, color }) => (
            <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: color }}
                aria-label={label}
            >
                {icon} {label}
            </a>
            ))}
        </div>
        </div>

        {/* Feature tiles */}
        <div className="grid grid-cols-2 gap-4">
        {services.map((s) => (
            <div
            key={s.title}
            className="rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md transition-shadow cursor-default"
            style={{ backgroundColor: "#BCE6FF" }}
            >
            <span className="text-3xl">{s.icon}</span>
            <p className="font-bold text-[#0d4a70] text-base">{s.title}</p>
            <p className="text-xs text-[#2a6f96] leading-relaxed">{s.desc}</p>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* ── DOCTORS ── */}
    <section className="py-20" style={{ backgroundColor: "#e4f4ff" }}>
    <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#1a8fc1" }}>Our Team</span>
        <h2 className="text-3xl md:text-4xl font-bold text-[#0d4a70] mt-2">Meet Our Specialists</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {doctors.map((doc) => (
            <div
            key={doc.name}
            className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setActiveDoc(doc === activeDoc ? null : doc)}
            >
            <div className="overflow-hidden h-44">
                <img
                src={doc.img}
                alt={doc.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-4">
                <p className="font-bold text-[#0d4a70] text-sm leading-tight">{doc.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#1a8fc1" }}>{doc.specialty}</p>
                <p className="text-xs text-gray-500 mt-0.5">{doc.role}</p>
                {activeDoc === doc && (
                <div className="mt-3 pt-3 border-t border-blue-100">
                    <p className="text-xs text-[#2a6f96]">Experience: <span className="font-semibold">{doc.exp}</span></p>
                    <a
                    href={SOCIAL.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-center text-xs font-semibold py-1.5 rounded-full text-white"
                    style={{ backgroundColor: "#25D366" }}
                    >
                    Book Appointment
                    </a>
                </div>
                )}
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>

    {/* ── MISSION STRIP ── */}
    <section className="py-16" style={{ backgroundColor: "#88CDF6" }}>
    <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0d4a70] mb-4">
        "Healing hands, caring hearts — that's the MediClinic promise."
        </h2>
        <p className="text-[#0d4a70] text-opacity-80 max-w-xl mx-auto text-sm leading-relaxed">
        Every decision we make, every protocol we follow, and every staff member we hire is guided by one principle: your health and comfort come first.
        </p>
        <div className="flex justify-center gap-5 mt-8">
        <a href={SOCIAL.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#E1306C" }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
        </a>
        <a href={SOCIAL.facebook} target="_blank" rel="noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#1877F2" }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        </a>
        <a href={SOCIAL.whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:scale-110" style={{ backgroundColor: "#25D366" }}>
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
        </div>
    </div>
    </section>

    {/* ── FOOTER ── */}
    <footer style={{ backgroundColor: "#0d4a70" }} className="py-10 px-6">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
        <p className="text-white font-bold text-lg">MediClinic</p>
        <p className="text-xs mt-1" style={{ color: "#88CDF6" }}>123 Health Avenue, Colombo 03, Sri Lanka</p>
        <p className="text-xs" style={{ color: "#88CDF6" }}>+94 11 234 5678 · hello@mediclinic.lk</p>
        </div>
        <div className="flex gap-5 text-xs" style={{ color: "#BCE6FF" }}>
        {["Privacy Policy", "Terms of Use", "Careers", "Contact"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
        ))}
        </div>
        <div className="flex gap-3">
        {[
            { href: SOCIAL.instagram, color: "#E1306C", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
            { href: SOCIAL.facebook, color: "#1877F2", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
            { href: SOCIAL.whatsapp, color: "#25D366", icon: <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> },
        ].map(({ href, color, icon }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform" style={{ backgroundColor: color }}>
            {icon}
            </a>
        ))}
        </div>
    </div>
    <p className="text-center text-xs mt-6" style={{ color: "#88CDF6" }}>© 2025 MediClinic. All rights reserved.</p>
    </footer>
</div>
);
}