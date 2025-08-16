import 'dotenv';
import { Pool } from 'pg';

const uf = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

let result = [];

async function busca() {
  for (let i = 0; i < uf.length; i++) {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf[i]}/distritos`);
      if (!response.ok) throw new Error('Erro na requisição: ' + response.status);
      const data = await response.json();

      for (let j in data) {
        const city = data[j].municipio.nome;
        const state = uf[i];
        const exists = result.some(item => item.city === city && item.state === state);
        if (!exists) {
          result.push({ state, city });
        }
      }

    } catch (error) {
      console.error('Erro ao consumir API para', uf[i], ':', error);
    }
  }

  console.log(`Total de cidades coletadas: ${result.length}`);
  return result;
}

async function inserirDados(locations) {
  const pool = new Pool({
    connectionString: ""  });

  try {
    console.log('Conectando ao PostgreSQL...');
    const client = await pool.connect();

    for (const loc of locations) {
      await client.query(
        'INSERT INTO "Locations" (state, city) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [loc.state, loc.city]
      );
    }

    console.log('Inserção concluída com sucesso.');
    client.release();
  } catch (err) {
    console.error('Erro ao inserir:', err);
  } finally {
    await pool.end();
  }
}

busca().then(inserirDados);
