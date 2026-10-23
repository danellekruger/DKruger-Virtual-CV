/*
 * Certificate data — the single source for the gallery, filters and command palette.
 *
 * To add a certificate:
 *   1. Copy the PDF into certificates/ (use a short kebab-case filename).
 *   2. Run `npm run thumbs` to render its thumbnail into certificates/thumbs/.
 *   3. Add an entry below. `category` creates a filter chip automatically.
 *
 * Fields: id, title, issuer, instructor, date (YYYY-MM-DD), hours, category, file, credentialId (optional)
 */
window.CERTIFICATES = [
  {
    id: 'csharp-basics',
    title: 'C# Basics for Beginners: Learn C# Fundamentals by Coding',
    issuer: 'Udemy',
    instructor: 'Mosh Hamedani',
    date: '2026-08-19',
    hours: 5.5,
    category: 'Backend',
    file: 'c-sharp-basics-for-beginners-learn-c-sharp-fundamentals-by-coding.pdf',
    credentialId: 'UC-03129c4d-1b05-4be5-984e-dd699dc6b199',
  },
  {
    id: 'prompt-engineering',
    title: 'The Complete Prompt Engineering for AI Bootcamp (2026)',
    issuer: 'Udemy',
    instructor: 'Mike Taylor, James Phoenix',
    date: '2026-03-10',
    hours: 23.5,
    category: 'AI & Security',
    file: 'the-complete-prompt-engineering-for-ai-bootcamp-2026.pdf',
    credentialId: 'UC-b68b161e-ce0e-45e7-9981-bdc649f22d8c',
  },
  {
    id: 'sql-bootcamp',
    title: 'The Complete SQL Bootcamp: Go from Zero to Hero',
    issuer: 'Udemy',
    instructor: 'Jose Portilla, Pierian Training',
    date: '2026-02-24',
    hours: 9,
    category: 'Data',
    file: 'the-complete-sql-bootcamp-go-from-zero-to-hero.pdf',
    credentialId: 'UC-08a90adc-8cdd-4910-9e31-8cb7030b3c3d',
  },
  {
    id: 'clean-code',
    title: 'Clean Code',
    issuer: 'Udemy',
    instructor: 'Maximilian Schwarzmüller (Academind)',
    date: '2026-02-23',
    hours: 6.5,
    category: 'Software Craft',
    file: 'clean-code.pdf',
    credentialId: 'UC-93254358-2463-4c3d-b520-439da83ca233',
  },
  {
    id: 'requirements-gathering',
    title: 'Software Development: Better Requirements Gathering Skills',
    issuer: 'Udemy',
    instructor: 'Robin Slee',
    date: '2026-02-06',
    hours: 1.5,
    category: 'Software Craft',
    file: 'software-development-better-requirements-gathering-skills.pdf',
    credentialId: 'UC-3079f9c3-3495-4836-8d82-5e57f55a2d7e',
  },
  {
    id: 'tailwind-v4',
    title: 'Tailwind CSS v4 – Beginner to Pro',
    issuer: 'Udemy',
    instructor: 'Tom Phillips',
    date: '2026-01-29',
    hours: 4,
    category: 'Frontend',
    file: 'tailwind-css-v4-beginner-to-pro.pdf',
    credentialId: 'UC-95349417-73e0-478f-88cb-e0acdf6137e1',
  },
  {
    id: 'typescript-crash-course',
    title: 'TypeScript Crash Course',
    issuer: 'Udemy',
    instructor: 'Jan Schaffranek',
    date: '2026-01-19',
    hours: 3.5,
    category: 'Frontend',
    file: 'typescript-crash-course.pdf',
    credentialId: 'UC-dcbd4501-dcd8-4227-b491-3e166e71c560',
  },
  {
    id: 'cybersecurity-chatgpt',
    title: 'Advanced Cybersecurity and Ethical Hacking with ChatGPT',
    issuer: 'Udemy',
    instructor: 'Peter Alkema, Irlon Terblanche',
    date: '2024-03-31',
    hours: 5,
    category: 'AI & Security',
    file: 'advanced-cybersecurity-and-ethical-hacking-with-chatgpt.pdf',
    credentialId: 'UC-abf25e3c-9244-4404-8a5c-2e6d66aa86b2',
  },
];
