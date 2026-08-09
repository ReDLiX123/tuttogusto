async function check() {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  
  console.log('HTML Total Length:', html.length);
  
  const testTerms = [
    'Завтрак Вода',
    'Завтрак Воздух',
    'Завтрак Земля',
    'Крем-суп из брокколи',
    'Крем-суп Пряная тыква',
    'Туттомед',
    'Гудбайден',
    'Овощное моцарелло',
    'Паста Лингвини болоньезе',
    'Паста Феттуччине Карбонара',
    'Шакшука'
  ];

  console.log('\n--- Frequency count of each product in HTML ---');
  for (const term of testTerms) {
    const count = (html.split(term).length - 1);
    console.log(`"${term}": ${count} times`);
  }
}
check();
