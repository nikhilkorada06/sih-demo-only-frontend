export interface DepartmentInfo {
  code: string;
  name: string;
  nameMr: string;
  description: string;
  descriptionMr: string;
  category: string;
  serviceCount: number;
  protocol: 'REST' | 'SOAP';
  apiStatus: 'ONLINE' | 'ACTIVE' | 'CONNECTED';
  dataCategories: string[];
  helpline: string;
  website: string;
  iconName: string;
}

export const MAHARASHTRA_DEPARTMENTS: DepartmentInfo[] = [
  {
    code: 'EDUCATION',
    name: 'Higher & Technical Education Department',
    nameMr: 'उच्च व तंत्र शिक्षण विभाग',
    description: 'Manages colleges, universities, technical institutions, scholarships, and academic verification across Maharashtra.',
    descriptionMr: 'महाराष्ट्रातील महाविद्यालये, विद्यापीठे, तंत्रशिक्षण संस्था आणि शिष्यवृत्तींचे व्यवस्थापन व पडताळणी.',
    category: 'Education & Academics',
    serviceCount: 38,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['education'],
    helpline: '022-22025301',
    website: 'https://hted.maharashtra.gov.in',
    iconName: 'GraduationCap'
  },
  {
    code: 'EMPLOYMENT',
    name: 'Skill Development, Employment & Entrepreneurship',
    nameMr: 'कौशल्य विकास, रोजगार व उद्योजकता विभाग',
    description: 'Facilitates job matching, vocational apprenticeships, MahaSwayam employment exchanges, and applicant credential validation.',
    descriptionMr: 'महास्वयं रोजगार नोंदणी, औद्योगिक कार्यप्रशिक्षण आणि रोजगार इच्छुकांची पडताळणी.',
    category: 'Jobs & Skill Training',
    serviceCount: 24,
    protocol: 'SOAP',
    apiStatus: 'ONLINE',
    dataCategories: ['employment'],
    helpline: '1800-120-8040',
    website: 'https://mahaswayam.gov.in',
    iconName: 'Briefcase'
  },
  {
    code: 'REVENUE',
    name: 'Revenue & Forest Department (Aaple Sarkar / Mahabhulekh)',
    nameMr: 'महसूल व वन विभाग (आपले सरकार / महाभूमी)',
    description: 'Issues caste certificates, domicile, income certificates, 7/12 land records, and non-creamy layer verification.',
    descriptionMr: 'उत्पन्नाचा दाखला, ७/१२ उतारा, जात व अधिवास प्रमाणपत्रे देणारा प्रमुख शासकीय विभाग.',
    category: 'Civil Records & Land',
    serviceCount: 52,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['revenue', 'identity'],
    helpline: '1800-120-8040',
    website: 'https://aaplesarkar.mahaonline.gov.in',
    iconName: 'FileText'
  },
  {
    code: 'AGRICULTURE',
    name: 'Agriculture & Farmers Welfare Department',
    nameMr: 'कृषी विभाग, महाराष्ट्र शासन',
    description: 'Implements Namo Shetkari Sanman Nidhi, crop insurance (PMFBY), drip irrigation subsidies, and fertilizer licensing.',
    descriptionMr: 'नमो शेतकरी योजना, पीक विमा, कृषी अवजारे अनुदान व शेतकरी कल्याणकारी योजना.',
    category: 'Farming & Rural',
    serviceCount: 29,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['agriculture', 'land'],
    helpline: '1800-233-4000',
    website: 'https://krishi.maharashtra.gov.in',
    iconName: 'Sprout'
  },
  {
    code: 'HEALTH',
    name: 'Public Health Department (Arogya Vibhag)',
    nameMr: 'सार्वजनिक आरोग्य विभाग',
    description: 'Oversees Mahatma Phule Jan Arogya Yojana (MPJAY), birth/death registers, hospitals, and subsidized public healthcare.',
    descriptionMr: 'मोफत वैद्यकीय उपचार (MPJAY), आरोग्य केंद्रे, जन्म-मृत्यू नोंदणी आणि सार्वजनिक आरोग्य व्यवस्था.',
    category: 'Healthcare & Wellness',
    serviceCount: 18,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['health'],
    helpline: '104 / 155388',
    website: 'https://arogya.maharashtra.gov.in',
    iconName: 'HeartPulse'
  },
  {
    code: 'SOCIAL_JUSTICE',
    name: 'Social Justice & Special Assistance Department',
    nameMr: 'सामाजिक न्याय व विशेष सहाय्य विभाग',
    description: 'Administers disability grants, Sanjay Gandhi Niradhar pensions, Babasaheb Ambedkar scholarships, and welfare hostels.',
    descriptionMr: 'निराधार पेन्शन, दिव्यांग साहाय्य, स्वाधार योजना आणि सामाजिक कल्याण उपक्रम.',
    category: 'Welfare & Inclusion',
    serviceCount: 31,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['social_welfare'],
    helpline: '022-22025251',
    website: 'https://sjsa.maharashtra.gov.in',
    iconName: 'Users'
  },
  {
    code: 'TRANSPORT',
    name: 'Motor Vehicles / Transport Department (Sarathi)',
    nameMr: 'परिवहन विभाग (सारथी व वाहन)',
    description: 'Handles driving licenses, vehicle registrations, state road transport, fitness certificates, and e-Challan payments.',
    descriptionMr: 'शिकाऊ व पक्के चालक परवाना, वाहन नोंदणी आणि परिवहन सेवा.',
    category: 'Transit & Mobility',
    serviceCount: 22,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['transport'],
    helpline: '022-22822525',
    website: 'https://transport.maharashtra.gov.in',
    iconName: 'Car'
  },
  {
    code: 'WOMEN_CHILD',
    name: 'Women & Child Development Department',
    nameMr: 'महिला व बालविकास विभाग',
    description: 'Executes Mukhyamantri Majhi Ladki Bahin Yojana, Anganwadi nutrition programs, and women entrepreneurship initiatives.',
    descriptionMr: 'माझी लाडकी बहीण योजना, अंगणवाडी पोषण आणि महिला आर्थिक सक्षमीकरण.',
    category: 'Women & Children',
    serviceCount: 16,
    protocol: 'REST',
    apiStatus: 'ONLINE',
    dataCategories: ['welfare'],
    helpline: '181 (Women Helpline)',
    website: 'https://womenchild.maharashtra.gov.in',
    iconName: 'ShieldHeart'
  }
];
