import Link from 'next/link';

const programs = [
  { title: 'Gira', description: 'Conoce más de nuestra Gira de cine itinerante.', href: '/gira' },
  { title: 'Presenta', description: 'Circuito de exhibición de cine documental desde el quehacer colaborativo.', href: '/presenta' },
  { title: 'Más Allá', description: 'Proyecto de capacitación en producción documental.', href: '/mas-alla' },
  { title: 'Ediciones', description: 'Obras fundamentales para expandir la cultura del cine.', href: '/ediciones' },
  { title: 'Vivero', description: 'Formación en prácticas documentales audiovisuales', href: '/vivero' },
];

export default function ProgramsSection() {
  return (
    <section className="programs-section">
      <h2>Nuestros programas</h2>
      <p className="mission-statement">
        Nuestra misión es movilizar espacios de encuentro y acción colectiva para construir otros mundos a través del documental. Conoce cómo lo hacemos.
      </p>
      
      <div className="programs-grid">
        {programs.map((program) => (
          <div key={program.title} className="program-card">
            <h3>{program.title}</h3>
            <p>{program.description}</p>
            <Link href={program.href}>
              <span className="explore-link">Explora &gt;</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}