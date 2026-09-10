export const profile = {
  name: 'Siva Kumar Eekalpa',
  role: 'Java Developer',
  location: 'Hyderabad, Telangana',
  email: 'sivakumareekalpa@gmail.com',
  phone: '+91 6301609927',
  linkedin: 'https://www.linkedin.com/in/siva-kumar-eekalpa-82968a260/',
  github: 'https://github.com/SivakumarEekalpa',
  image: '/professional-passport-image.jpeg',
  resume: 'https://drive.google.com/file/d/1hTt0tK86dbgo-DKlIekFZ_ZD89xhFV1_/view?usp=drivesdk',
  resumePreview: 'https://drive.google.com/file/d/1hTt0tK86dbgo-DKlIekFZ_ZD89xhFV1_/preview',
  resumeDownload: 'https://drive.google.com/uc?export=download&id=1hTt0tK86dbgo-DKlIekFZ_ZD89xhFV1_',
  summary: 'Computer Science graduate focused on secure, scalable backend systems and practical web applications with Java, Spring Boot, React, and AI.',
}

export const education = {
  degree: 'B.Tech in Computer Science and Engineering',
  school: 'Jawaharlal Nehru Technological University Hyderabad',
  period: '2021 — 2025',
  grade: 'CGPA 7.12 / 10',
}

export const linkedInSnapshot = {
  headline: 'Java Developer | Spring Boot | Microservices | React | AI & LLM',
  summary: profile.summary,
  experience: 'Project-based experience building secure APIs, distributed services, and AI-assisted applications.',
  certifications: 'Add certifications to src/data.js as they are earned.',
}

export const skillGroups = [
  ['01', 'Languages', ['Java', 'SQL', 'JavaScript']],
  ['02', 'Backend', ['Spring Boot', 'Hibernate', 'REST APIs', 'Maven']],
  ['03', 'Frontend', ['React.js', 'Responsive UI', 'Axios']],
  ['04', 'Microservices', ['Spring Cloud', 'OpenFeign', 'WebClient', 'API Gateway']],
  ['05', 'Security', ['Spring Security', 'JWT', 'Secure APIs']],
  ['06', 'AI / LLM', ['Spring AI', 'Ollama', 'Llama 3.2', 'ChatClient']],
  ['07', 'Tools', ['Git', 'GitHub', 'Postman', 'Swagger']],
]

export const featuredProjects = [
  {
    title: 'AI Chatbot Application', type: 'Intelligent systems', number: '01', visual: 'chat',
    description: 'A secure conversational application that remembers context, persists conversation history, and makes local LLMs useful through a dependable API.',
    tags: ['Spring Boot', 'Spring AI', 'Ollama', 'JWT', 'MySQL'],
  },
  {
    title: 'BookStore Microservices', type: 'Distributed commerce', number: '02', visual: 'books',
    description: 'A service-oriented bookstore platform with inventory synchronization, an API Gateway, and a React frontend designed to keep the buying journey simple.',
    tags: ['Spring Cloud', 'OpenFeign', 'React.js', 'API Gateway'],
    link: 'https://github.com/SivakumarEekalpa/BookStore-SpringBoot-Microservices',
  },
]

export const navItems = [['', 'Home'], ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'], ['resume', 'Resume'], ['contact', 'Contact']]