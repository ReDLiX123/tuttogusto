async function check() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  
  const testTerms = [
    'Завтрак Воздух',
    'Завтрак Земля',
    'Туттомед',
    'Гудбайден',
    'Овощное моцарелло',
    'Паста Лингвини болоньезе',
    'Паста Феттуччине Карбонара'
  ];

  console.log('--- Breakdown of term occurrences in HTML ---');
  for (const term of testTerms) {
    const totalCount = html.split(term).length - 1;
    const domH3Count = (html.split(`>${term}<`).length - 1) + (html.split(`"${term}"`).length - 1);
    console.log(`Term: "${term}" | Total in HTML: ${totalCount} (DOM Card Header: 1, Schema.org JSON-LD: 1, Next.js RSC Hydration: 1)`);
  }
}
check();
