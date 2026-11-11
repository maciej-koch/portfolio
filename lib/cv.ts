import { content } from './content'

const YEARS = new Date().getFullYear() - 2021

// Everything on the CV page (app/cv) and in the exported public/cv.pdf. Edit freely, then `npm run cv`.
export const cv = {
  name: content.name,
  role: content.role,
  contact: [
    { label: 'maciej-koch.com', href: 'https://maciej-koch.com' },
    { label: 'maciej.k00h@gmail.com', href: 'mailto:maciej.k00h@gmail.com' },
    { label: '+48 883 990 811', href: 'tel:+48883990811' },
    { label: 'github.com/maciej-koch', href: 'https://github.com/maciej-koch' },
    { label: 'linkedin.com/in/maciej-koch', href: 'https://www.linkedin.com/in/maciej-koch/' },
    { label: 'Near Cieszyn, Poland' },
  ],
  about: `Software engineer with ${YEARS}+ years of experience building web applications, from pixel-perfect UI to the API behind it. I like solving problems and turning messy ones into simple, maintainable software.`,
  work: [
    {
      role: 'Fullstack Developer',
      org: 'Software Mind',
      period: 'March 2022 – present',
      points: [
        'Agile work and finance management platform for a Scandinavian client, built in a Polish–Finnish team.',
        'React, TypeScript, Node.js, Express, MUI, SQL, Figma, Git.',
      ],
    },
    {
      role: 'Frontend Developer',
      org: 'Ultimate Systems',
      period: 'June – September 2021',
      points: ['React platform for a pharma client and several WordPress sites.', 'React, WordPress, JavaScript, PHP, Sass, Figma, Git.'],
    },
  ],
  education: [
    { degree: 'Computer Science, MSc', org: 'University of Silesia, Katowice', period: '2022 – 2023', note: 'Faculty of Science and Technology' },
    {
      degree: 'Computer Science, BSc (Eng.)',
      org: 'AGH University of Science and Technology, Kraków',
      period: '2018 – 2022',
      note: 'Faculty of Electrical Engineering, Automatics, Computer Science and Biomedical Engineering',
    },
    { degree: 'Mathematics and physics profile', org: 'I LO im. Antoniego Osuchowskiego, Cieszyn', period: '2015 – 2018' },
  ],
  projects: [
    {
      name: 'Private Kindergarten Management System',
      stack: 'React, Sass, Django, PostgreSQL, REST',
      desc: 'Support for running a private kindergarten: a calendar of announcements for parents, blog, chat and a file manager.',
    },
    {
      name: 'Rick and Morty Universum',
      stack: 'React, Redux, Sass, Strapi, REST',
      desc: 'Characters fetched from the public API, with accounts, comments and favourites.',
    },
    {
      name: 'Silesian Hospitals Info',
      stack: 'React Native, Python',
      desc: 'Mobile app with essential data about Silesian hospitals and wards (free beds, contact, map), served by my own API.',
    },
  ],
  skills: [...content.stack, 'HTML', 'CSS', 'REST', 'WordPress'],
  languages: ['English — C1', 'Polish — native'],
  clause:
    'I hereby agree to the processing of personal data included in my application for the needs necessary to carry out the recruitment process in accordance with art. 6 par. 1 lit. a of Regulation (EU) 2016/679 (GDPR).',
}
