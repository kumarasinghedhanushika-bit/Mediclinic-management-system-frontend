import { useRef, useState } from "react";

// ---------------------------------------------------------------------------
// TypeScript Interfaces
// ---------------------------------------------------------------------------
interface Doctor {
name: string;
detail: string;
hospital: string;
}

interface Department {
en: string;
si: string;
code: string;
doctors: Doctor[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const DEPARTMENTS: Department[] = [
{
en: "General Practitioner",
si: "සාමාන්‍ය වෛද්‍යවරයා",
code: "GP",
doctors: [
    { name: "Dr. Nimal Perera", detail: "MBBS · 14 yrs exp", hospital: "Negombo General" },
    { name: "Dr. Shanika Fernando", detail: "MBBS, Dip. Fam. Med · 9 yrs exp", hospital: "Lakeside Clinic" },
    { name: "Dr. Ruwan Jayasuriya", detail: "MBBS · 21 yrs exp", hospital: "City Medical Centre" },
    { name: "Dr. Anoma Wickrama", detail: "MBBS · 6 yrs exp", hospital: "Hillside Health" },
],
},
{
en: "Cardiologist",
si: "හෘද රෝග විශේෂඥ",
code: "CARD",
doctors: [
    { name: "Dr. Tharindu Silva", detail: "MD Cardiology · 18 yrs exp", hospital: "Heart & Vascular Inst." },
    { name: "Dr. Kumari Senanayake", detail: "FRCP, MD · 12 yrs exp", hospital: "Colombo Cardiac Care" },
    { name: "Dr. Asanka Bandara", detail: "MD Cardiology · 15 yrs exp", hospital: "National Heart Hosp." },
    { name: "Dr. Priyangi Ranatunga", detail: "MD, FACC · 10 yrs exp", hospital: "Westside Cardio" },
],
},
{
en: "Neurologist",
si: "ස්නායු පද්ධති විශේෂඥ",
code: "NEURO",
doctors: [
    { name: "Dr. Chamara Gunasekara", detail: "MD Neurology · 16 yrs exp", hospital: "Brain & Spine Centre" },
    { name: "Dr. Ishara Dissanayake", detail: "MD Neurology · 8 yrs exp", hospital: "Neuro Care Lanka" },
    { name: "Dr. Sampath Wijesinghe", detail: "FRCP, MD · 20 yrs exp", hospital: "Apex Neurology" },
    { name: "Dr. Hasini Karunaratne", detail: "MD Neurology · 11 yrs exp", hospital: "Riverbend Hospital" },
],
},
{
en: "Neurosurgeon",
si: "මොළය හා ස්නායු ශල්‍ය වෛද්‍ය",
code: "NSURG",
doctors: [
    { name: "Dr. Lakshan De Silva", detail: "MS Neurosurgery · 19 yrs exp", hospital: "National Brain Inst." },
    { name: "Dr. Vindya Abeysekara", detail: "MS Neurosurgery · 13 yrs exp", hospital: "Crescent Surgical" },
    { name: "Dr. Janaka Rajapaksha", detail: "MS, FRCS · 24 yrs exp", hospital: "Summit Neuro Hosp." },
    { name: "Dr. Methmi Ekanayake", detail: "MS Neurosurgery · 7 yrs exp", hospital: "Pinnacle Health" },
],
},
{
en: "Dermatologist",
si: "සමේ රෝග විශේෂඥ",
code: "DERM",
doctors: [
    { name: "Dr. Roshan Mendis", detail: "MD Dermatology · 10 yrs exp", hospital: "Clearskin Clinic" },
    { name: "Dr. Tanya Goonetilleke", detail: "MD, Dip. Derm · 7 yrs exp", hospital: "Lotus Skin Centre" },
    { name: "Dr. Buddhika Amarasinghe", detail: "MD Dermatology · 14 yrs exp", hospital: "Glow Dermatology" },
    { name: "Dr. Yasodha Peiris", detail: "MD Dermatology · 5 yrs exp", hospital: "Cityskin Care" },
],
},
{
en: "Pediatrician",
si: "ළමා රෝග විශේෂඥ",
code: "PEDS",
doctors: [
    { name: "Dr. Damith Wijetunga", detail: "MD Paediatrics · 17 yrs exp", hospital: "Little Stars Hosp." },
    { name: "Dr. Sachini Herath", detail: "MD Paediatrics · 9 yrs exp", hospital: "Sunshine Kids Clinic" },
    { name: "Dr. Pradeep Ratnayake", detail: "MD, DCH · 22 yrs exp", hospital: "Children's Care Inst." },
    { name: "Dr. Nadeesha Liyanage", detail: "MD Paediatrics · 6 yrs exp", hospital: "Bright Beginnings" },
],
},
{
en: "Gynecologist",
si: "කාන්තා ප්‍රසව හා ප්‍රජනන පද්ධති විශේෂඥ",
code: "GYN",
doctors: [
    { name: "Dr. Manori Jayawardena", detail: "MD O&G · 15 yrs exp", hospital: "Womens Wellness Ctr" },
    { name: "Dr. Sumudu Karunarathne", detail: "MD O&G · 12 yrs exp", hospital: "Serene Maternity" },
    { name: "Dr. Dilini Wanigasekara", detail: "MD, MRCOG · 18 yrs exp", hospital: "Hope Women's Hosp." },
    { name: "Dr. Anushka Rodrigo", detail: "MD O&G · 8 yrs exp", hospital: "Cityview Clinic" },
],
},
{
en: "Obstetrician",
si: "ගර්භණී හා දරු ප්‍රසූති විශේෂඥ",
code: "OBS",
doctors: [
    { name: "Dr. Geethika Senarath", detail: "MD O&G · 13 yrs exp", hospital: "New Life Maternity" },
    { name: "Dr. Ravindu Pathirana", detail: "MD, MRCOG · 16 yrs exp", hospital: "Birthwell Hospital" },
    { name: "Dr. Chathurika Bandaranayake", detail: "MD O&G · 9 yrs exp", hospital: "Gentle Care Maternity" },
    { name: "Dr. Mihiri Gamage", detail: "MD O&G · 20 yrs exp", hospital: "First Cry Hospital" },
],
},
{
en: "Orthopedic Surgeon",
si: "අස්ථි හා සන්ධි විශේෂඥ",
code: "ORTHO",
doctors: [
    { name: "Dr. Kasun Ariyaratne", detail: "MS Orthopaedics · 19 yrs exp", hospital: "Bone & Joint Inst." },
    { name: "Dr. Imesha Wijewardena", detail: "MS Orthopaedics · 11 yrs exp", hospital: "Active Life Clinic" },
    { name: "Dr. Suresh Kodithuwakku", detail: "MS, FRCS · 23 yrs exp", hospital: "Apex Ortho Centre" },
    { name: "Dr. Nilakshi Wickramaratne", detail: "MS Orthopaedics · 7 yrs exp", hospital: "Motion Health" },
],
},
{
en: "Ophthalmologist",
si: "ඇස් විශේෂඥ",
code: "OPHTH",
doctors: [
    { name: "Dr. Lasantha Gunaratne", detail: "MS Ophthalmology · 14 yrs exp", hospital: "Clear Vision Eye Hosp." },
    { name: "Dr. Oshadi Rathnayake", detail: "MS Ophthalmology · 8 yrs exp", hospital: "Brightsight Clinic" },
    { name: "Dr. Chinthaka Weerasinghe", detail: "MS, FRCS · 17 yrs exp", hospital: "National Eye Centre" },
    { name: "Dr. Tharushi Madushani", detail: "MS Ophthalmology · 5 yrs exp", hospital: "Focus Eye Care" },
],
},
{
en: "ENT Specialist",
si: "කණ, නාසය හා උගුර විශේෂඥ",
code: "ENT",
doctors: [
    { name: "Dr. Hiran Dassanayake", detail: "MS ENT · 12 yrs exp", hospital: "Hear & Breathe Clinic" },
    { name: "Dr. Sajeewa Karunathilaka", detail: "MS ENT · 16 yrs exp", hospital: "Throat Care Centre" },
    { name: "Dr. Achini Mahawatte", detail: "MS, FRCS · 9 yrs exp", hospital: "Wellear ENT Hosp." },
    { name: "Dr. Kavishka Senadheera", detail: "MS ENT · 6 yrs exp", hospital: "Coastal ENT Clinic" },
],
},
{
en: "Psychiatrist",
si: "මානසික සෞඛ්‍ය විශේෂඥ",
code: "PSYC",
doctors: [
    { name: "Dr. Sanjeewa Hettiarachchi", detail: "MD Psychiatry · 15 yrs exp", hospital: "Mindful Wellness Ctr" },
    { name: "Dr. Renuka Abeywardena", detail: "MD Psychiatry · 10 yrs exp", hospital: "Calm Horizon Clinic" },
    { name: "Dr. Janith Kuruppu", detail: "MD, MRCPsych · 18 yrs exp", hospital: "Serenity Mental Health" },
    { name: "Dr. Poornima Wanniarachchi", detail: "MD Psychiatry · 7 yrs exp", hospital: "Bright Mind Institute" },
],
},
{
en: "Psychologist",
si: "මනෝවිද්‍යාඥ",
code: "PSY",
doctors: [
    { name: "Dr. Yohan Pereira", detail: "PhD Clinical Psych · 11 yrs exp", hospital: "Insight Therapy Ctr" },
    { name: "Dr. Sandali Edirisinghe", detail: "MSc Psychology · 6 yrs exp", hospital: "Clearpath Counselling" },
    { name: "Dr. Thushan Wijeratne", detail: "PhD Psychology · 14 yrs exp", hospital: "Anchor Mind Clinic" },
    { name: "Dr. Ruvini Jayatilake", detail: "MSc, Dip. Couns. · 8 yrs exp", hospital: "Open Door Therapy" },
],
},
{
en: "Oncologist",
si: "පිළිකා රෝග විශේෂඥ",
code: "ONCO",
doctors: [
    { name: "Dr. Mahesh Rupasinghe", detail: "MD Oncology · 20 yrs exp", hospital: "Hope Cancer Institute" },
    { name: "Dr. Nayana Ekanayaka", detail: "MD Oncology · 13 yrs exp", hospital: "Lifeline Oncology Ctr" },
    { name: "Dr. Dinesh Karunarathna", detail: "MD, FRCR · 17 yrs exp", hospital: "National Cancer Hosp." },
    { name: "Dr. Wathsala Premaratne", detail: "MD Oncology · 9 yrs exp", hospital: "Beacon Cancer Care" },
],
},
{
en: "Endocrinologist",
si: "හෝමෝන හා දියවැඩියා විශේෂඥ",
code: "ENDO",
doctors: [
    { name: "Dr. Charith Senanayaka", detail: "MD Endocrinology · 12 yrs exp", hospital: "Balance Hormone Ctr" },
    { name: "Dr. Iresha Gunawardena", detail: "MD Endocrinology · 9 yrs exp", hospital: "Sugar & Health Clinic" },
    { name: "Dr. Asela Madawala", detail: "MD, FRCP · 16 yrs exp", hospital: "Metabolic Care Inst." },
    { name: "Dr. Tharaka Wimalasena", detail: "MD Endocrinology · 7 yrs exp", hospital: "Vitality Clinic" },
],
},
{
en: "Gastroenterologist",
si: "ජීර්ණ පද්ධති විශේෂඥ",
code: "GASTRO",
doctors: [
    { name: "Dr. Buddhima Senevirathne", detail: "MD Gastroenterology · 15 yrs exp", hospital: "Digestive Health Ctr" },
    { name: "Dr. Nethmi Hapuarachchi", detail: "MD Gastroenterology · 8 yrs exp", hospital: "GutCare Clinic" },
    { name: "Dr. Roshantha Liyanagunawardena", detail: "MD, FRCP · 19 yrs exp", hospital: "Lakeside Gastro Inst." },
    { name: "Dr. Imali Kodikara", detail: "MD Gastroenterology · 6 yrs exp", hospital: "Wellgut Clinic" },
],
},
{
en: "Nephrologist",
si: "වකුගඩු රෝග විශේෂඥ",
code: "NEPH",
doctors: [
    { name: "Dr. Lahiru Atapattu", detail: "MD Nephrology · 14 yrs exp", hospital: "Kidney Care Institute" },
    { name: "Dr. Sewwandi Ranasinghe", detail: "MD Nephrology · 10 yrs exp", hospital: "Renal Wellness Ctr" },
    { name: "Dr. Chamindu Wijesundara", detail: "MD, FRCP · 18 yrs exp", hospital: "National Renal Hosp." },
    { name: "Dr. Avanthi Dharmasena", detail: "MD Nephrology · 7 yrs exp", hospital: "PureFlow Clinic" },
],
},
{
en: "Urologist",
si: "මුත්‍රා පද්ධති විශේෂඥ",
code: "URO",
doctors: [
    { name: "Dr. Nuwan Rajakaruna", detail: "MS Urology · 16 yrs exp", hospital: "Urocare Institute" },
    { name: "Dr. Hashini Munasinghe", detail: "MS Urology · 9 yrs exp", hospital: "Riverstone Urology" },
    { name: "Dr. Eranga Wijekoon", detail: "MS, FRCS · 21 yrs exp", hospital: "National Urology Ctr" },
    { name: "Dr. Sathmi Galappaththi", detail: "MS Urology · 6 yrs exp", hospital: "Clearflow Clinic" },
],
},
{
en: "Pulmonologist",
si: "පෙනහළු හා ශ්වසන පද්ධති විශේෂඥ",
code: "PULM",
doctors: [
    { name: "Dr. Saman Witharana", detail: "MD Pulmonology · 17 yrs exp", hospital: "Breathe Easy Centre" },
    { name: "Dr. Kalani Senarathna", detail: "MD Pulmonology · 8 yrs exp", hospital: "Lung Care Clinic" },
    { name: "Dr. Tilan Abeyrathne", detail: "MD, FCCP · 13 yrs exp", hospital: "Respira Hospital" },
    { name: "Dr. Vidushi Karunaratne", detail: "MD Pulmonology · 5 yrs exp", hospital: "AirWell Clinic" },
],
},
{
en: "Hematologist",
si: "ලේ රෝග විශේෂඥ",
code: "HEMA",
doctors: [
    { name: "Dr. Janaka Dharmawardena", detail: "MD Hematology · 15 yrs exp", hospital: "Bloodline Institute" },
    { name: "Dr. Rashmika Yapa", detail: "MD Hematology · 10 yrs exp", hospital: "VitalBlood Clinic" },
    { name: "Dr. Suranga Ilangakoon", detail: "MD, FRCPath · 19 yrs exp", hospital: "National Hema Centre" },
    { name: "Dr. Dilshani Wanniarachchi", detail: "MD Hematology · 7 yrs exp", hospital: "PureCell Clinic" },
],
},
{
en: "Rheumatologist",
si: "සන්ධි හා ප්‍රතිශක්තිකරණ රෝග විශේෂඥ",
code: "RHEUM",
doctors: [
    { name: "Dr. Indika Bandaranayake", detail: "MD Rheumatology · 13 yrs exp", hospital: "JointEase Centre" },
    { name: "Dr. Malki Suraweera", detail: "MD Rheumatology · 9 yrs exp", hospital: "Flexicare Clinic" },
    { name: "Dr. Sahan Weerakkody", detail: "MD, FRCP · 17 yrs exp", hospital: "Immune & Joint Inst." },
    { name: "Dr. Hiruni Mallawaarachchi", detail: "MD Rheumatology · 6 yrs exp", hospital: "MoveWell Clinic" },
],
},
{
en: "Infectious Disease Specialist",
si: "බෝවන රෝග විශේෂඥ",
code: "ID",
doctors: [
    { name: "Dr. Prasanna Gunathilaka", detail: "MD Infectious Disease · 16 yrs exp", hospital: "ShieldHealth Centre" },
    { name: "Dr. Dineli Abeysuriya", detail: "MD Infectious Disease · 8 yrs exp", hospital: "Pathogen Care Clinic" },
    { name: "Dr. Roshan Kularatne", detail: "MD, FRCP · 20 yrs exp", hospital: "National ID Institute" },
    { name: "Dr. Senuri Wickramasinghe", detail: "MD Infectious Disease · 5 yrs exp", hospital: "Vital Defense Clinic" },
],
},
{
en: "Anesthesiologist",
si: "නිර්වින්දන වෛද්‍ය",
code: "ANES",
doctors: [
    { name: "Dr. Chathura Ranaweera", detail: "MD Anesthesiology · 14 yrs exp", hospital: "Surgicare Hospital" },
    { name: "Dr. Nayomi Dassanayaka", detail: "MD Anesthesiology · 9 yrs exp", hospital: "Calmtheatre Clinic" },
    { name: "Dr. Isuru Liyanaarachchi", detail: "MD, FRCA · 18 yrs exp", hospital: "Precision Surgical Ctr" },
    { name: "Dr. Gayani Hettiarachchi", detail: "MD Anesthesiology · 7 yrs exp", hospital: "Steadyhand Hospital" },
],
},
{
en: "Radiologist",
si: "X-ray, CT, MRI විශේෂඥ",
code: "RAD",
doctors: [
    { name: "Dr. Mangala Wijewickrama", detail: "MD Radiology · 15 yrs exp", hospital: "ScanView Imaging" },
    { name: "Dr. Tharushi Goonewardena", detail: "MD Radiology · 8 yrs exp", hospital: "Clearimage Centre" },
    { name: "Dr. Buwaneka Rathnasekara", detail: "MD, FRCR · 19 yrs exp", hospital: "National Imaging Inst." },
    { name: "Dr. Hashendri Dilshara", detail: "MD Radiology · 6 yrs exp", hospital: "Precision Scan Clinic" },
],
},
{
en: "Pathologist",
si: "රෝග විනිශ්චය සඳහා පටක හා රුධිර පරීක්ෂණ විශේෂඥ",
code: "PATH",
doctors: [
    { name: "Dr. Kapila Senadhipathi", detail: "MD Pathology · 17 yrs exp", hospital: "DiagnoCare Lab" },
    { name: "Dr. Nisansala Wijesiri", detail: "MD Pathology · 10 yrs exp", hospital: "ClearCell Laboratory" },
    { name: "Dr. Asiri Kularathna", detail: "MD, FRCPath · 21 yrs exp", hospital: "National Path Institute" },
    { name: "Dr. Pramodi Rajapaksa", detail: "MD Pathology · 6 yrs exp", hospital: "Veritas Diagnostics" },
],
},
{
en: "Emergency Medicine Specialist",
si: "හදිසි ප්‍රතිකාර විශේෂඥ",
code: "ER",
doctors: [
    { name: "Dr. Rukshan Madurasinghe", detail: "MD Emergency Med · 13 yrs exp", hospital: "Rapid Response Hosp." },
    { name: "Dr. Sithumini Bandara", detail: "MD Emergency Med · 7 yrs exp", hospital: "FirstAid Trauma Ctr" },
    { name: "Dr. Yohan Dharmasiri", detail: "MD, FACEM · 16 yrs exp", hospital: "National Emergency Ctr" },
    { name: "Dr. Charuni Edirisooriya", detail: "MD Emergency Med · 5 yrs exp", hospital: "Lifeline ER Clinic" },
],
},
{
en: "Plastic Surgeon",
si: "ප්ලාස්ටික් හා ප්‍රතිසංස්කරණ ශල්‍ය වෛද්‍ය",
code: "PLAS",
doctors: [
    { name: "Dr. Janith Wickramanayake", detail: "MS Plastic Surgery · 14 yrs exp", hospital: "Restore Aesthetic Ctr" },
    { name: "Dr. Kavindi Abeysekera", detail: "MS Plastic Surgery · 8 yrs exp", hospital: "Renew Surgical Clinic" },
    { name: "Dr. Tharindra Ratwatte", detail: "MS, FRCS · 19 yrs exp", hospital: "National Plastic Inst." },
    { name: "Dr. Oshini Karunatilake", detail: "MS Plastic Surgery · 6 yrs exp", hospital: "ReformCare Clinic" },
],
},
{
en: "Dental Surgeon",
si: "දන්ත වෛද්‍ය",
code: "DENT",
doctors: [
    { name: "Dr. Madushanka Gamlath", detail: "BDS · 12 yrs exp", hospital: "BrightSmile Dental" },
    { name: "Dr. Anjalee Wijesundera", detail: "BDS, Dip. Ortho · 9 yrs exp", hospital: "PearlCare Dental" },
    { name: "Dr. Supun Athukorala", detail: "BDS, FDS · 17 yrs exp", hospital: "National Dental Inst." },
    { name: "Dr. Methika Senanayake", detail: "BDS · 5 yrs exp", hospital: "Gentle Smile Clinic" },
],
},
{
en: "Geriatrician",
si: "වයෝවෘද්ධ රෝග විශේෂඥ",
code: "GERI",
doctors: [
    { name: "Dr. Sarath Wijewardene", detail: "MD Geriatrics · 18 yrs exp", hospital: "Golden Years Centre" },
    { name: "Dr. Champika Ranasinghe", detail: "MD Geriatrics · 11 yrs exp", hospital: "Evergreen Care Clinic" },
    { name: "Dr. Mahinda Kumarasiri", detail: "MD, FRCP · 22 yrs exp", hospital: "Elderwell Hospital" },
    { name: "Dr. Sandamali Perumal", detail: "MD Geriatrics · 7 yrs exp", hospital: "Graceful Aging Ctr" },
],
},
{
en: "Sports Medicine Specialist",
si: "ක්‍රීඩා වෛද්‍ය විශේෂඥ",
code: "SPORT",
doctors: [
    { name: "Dr. Dimuth Karunarathne", detail: "MD Sports Medicine · 11 yrs exp", hospital: "PeakForm Clinic" },
    { name: "Dr. Vinodhya Liyanage", detail: "MD Sports Medicine · 7 yrs exp", hospital: "Athletecare Centre" },
    { name: "Dr. Charuka Senerath", detail: "MD, Dip. SEM · 15 yrs exp", hospital: "National Sports Inst." },
    { name: "Dr. Ashvini Madurapperuma", detail: "MD Sports Medicine · 5 yrs exp", hospital: "MotionPeak Clinic" },
],
},
];

// ---------------------------------------------------------------------------
// Drag-to-scroll horizontal row
// ---------------------------------------------------------------------------
interface DragRowProps {
children: React.ReactNode;
}

function DragRow({ children }: DragRowProps) {
const ref = useRef<HTMLDivElement>(null);
const state = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });
const [dragging, setDragging] = useState(false);

const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
const el = ref.current;
if (!el) return;
state.current.isDown = true;
state.current.moved = false;
state.current.startX = e.pageX - el.offsetLeft;
state.current.scrollLeft = el.scrollLeft;
setDragging(true);
};

const onLeaveOrUp = () => {
state.current.isDown = false;
setDragging(false);
};

const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
if (!state.current.isDown) return;
e.preventDefault();
const el = ref.current;
if (!el) return;
const x = e.pageX - el.offsetLeft;
const walk = (x - state.current.startX) * 1.2;
if (Math.abs(walk) > 4) state.current.moved = true;
el.scrollLeft = state.current.scrollLeft - walk;
};

const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
if (state.current.moved) {
    e.preventDefault();
    e.stopPropagation();
}
};

const scrollByAmount = (dir: number) => {
ref.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
};

return (
<div className="relative group/row">
    <div
    ref={ref}
    onMouseDown={onDown}
    onMouseLeave={onLeaveOrUp}
    onMouseUp={onLeaveOrUp}
    onMouseMove={onMove}
    onClickCapture={onClickCapture}
    className={
        "flex gap-5 overflow-x-auto pb-2 select-none scroll-smooth " +
        "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] " +
        (dragging ? "cursor-grabbing" : "cursor-grab")
    }
    style={{ scrollSnapType: "x proximity" }}
    >
    {children}
    </div>

    {/* edge fade */}
    <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#FAF8F4] to-transparent" />

    {/* nav arrows, appear on row hover (desktop affordance) */}
    <div className="hidden md:flex absolute -top-12 right-0 gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
    <button
        onClick={() => scrollByAmount(-1)}
        aria-label="Scroll left"
        className="w-9 h-9 flex items-center justify-center bg-[#EDE8DD] text-[#2B2B26] hover:bg-[#DDD5C4] transition-colors"
    >
        ←
    </button>
    <button
        onClick={() => scrollByAmount(1)}
        aria-label="Scroll right"
        className="w-9 h-9 flex items-center justify-center bg-[#1F1E1B] text-[#FAF8F4] hover:bg-[#37352F] transition-colors"
    >
        →
    </button>
    </div>
</div>
);
}

// ---------------------------------------------------------------------------
// Doctor card
// ---------------------------------------------------------------------------
interface DoctorCardProps {
doctor: Doctor;
code: string;
index: number;
}

function DoctorCard({ doctor, code, index }: DoctorCardProps) {
return (
<div
    className="shrink-0 w-[230px] bg-white border border-[#E7E1D3] hover:border-[#C9BFA3] transition-colors"
    style={{ scrollSnapAlign: "start" }}
>
    <div className="px-4 pt-4 flex items-center justify-between">
    <span className="font-mono text-[10px] tracking-widest text-[#9A8F73]">
        {code}-{String(index + 1).padStart(2, "0")}
    </span>
    <span className="w-2 h-2 rounded-full bg-[#7C9473]" />
    </div>

    <div className="px-4 pt-3 pb-4">
    <p className="font-mono text-[10px] tracking-widest text-[#9A8F73] mb-1">
        {doctor.detail}
    </p>
    <h3 className="font-serif text-[17px] leading-snug text-[#1F1E1B] mb-2">
        {doctor.name}
    </h3>
    <p className="text-[12px] text-[#6B6555] leading-snug">{doctor.hospital}</p>
    </div>

    <button className="w-full border-t border-[#E7E1D3] py-2.5 font-mono text-[10px] tracking-widest text-[#1F1E1B] hover:bg-[#1F1E1B] hover:text-[#FAF8F4] transition-colors">
    VIEW PROFILE
    </button>
</div>
);
}

// ---------------------------------------------------------------------------
// Department section
// ---------------------------------------------------------------------------
interface DepartmentSectionProps {
dept: Department;
}

function DepartmentSection({ dept }: DepartmentSectionProps) {
return (
<section className="mb-14">
    <div className="flex items-end justify-between mb-5 px-1">
    <div>
        <span className="font-mono text-[10px] tracking-widest text-[#9A8F73]">
        {dept.code}
        </span>
        <h2 className="font-serif text-[26px] sm:text-[30px] leading-tight text-[#1F1E1B] mt-1">
        {dept.en}
        </h2>
        <p className="text-[13px] text-[#6B6555] mt-1">{dept.si}</p>
    </div>
    </div>

    <DragRow>
    {dept.doctors.map((doc, i) => (
        <DoctorCard key={doc.name} doctor={doc} code={dept.code} index={i} />
    ))}
    </DragRow>
</section>
);
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function DoctorDirectory() {
return (
<div className="min-h-screen bg-[#FAF8F4]">
    <header className="px-6 sm:px-10 pt-12 pb-8 border-b border-[#E7E1D3]">
    <span className="font-mono text-[10px] tracking-widest text-[#9A8F73]">
        DOCTOR DIRECTORY · {DEPARTMENTS.length} DEPARTMENTS
    </span>
    <h1 className="font-serif text-[40px] sm:text-[52px] leading-[1.05] text-[#1F1E1B] mt-2">
        Find a specialist
    </h1>
    <p className="text-[14px] text-[#6B6555] mt-3 max-w-md">
        Browse doctors by department. Click and drag any row to scroll — just like a trackpad.
    </p>
    </header>

    <main className="px-6 sm:px-10 pt-10 pb-20 max-w-[1500px] mx-auto">
    {DEPARTMENTS.map((dept) => (
        <DepartmentSection key={dept.code} dept={dept} />
    ))}
    </main>
</div>
);
}