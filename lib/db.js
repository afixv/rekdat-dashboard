import { Pool } from 'pg';
import { format } from 'date-fns';

const pool = new Pool({
  user: 'firntwbq',
  host: 'isilo.db.elephantsql.com',
  database: 'firntwbq',
  password: 'mVHmOFi7gnagKiEG2KILSmdpxIo5Odb2',
  port: 5432,
});

export const getChartData = async () => {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT date_stock, adj_close, average_sentiment_score
      FROM stockdata
      LEFT JOIN newsSentimen ON stockdata.date_stock = newsSentimen.date_news
      ORDER BY date_stock
    `);

    return transformChartData(result.rows);
  } finally {
    client.release();
  }
};

const transformChartData = (data) => {
  const validData = data.filter(
    (item) => item.date_stock && !isNaN(new Date(item.date_stock).getTime())
  );

  console.log('Valid Data:', validData);

  return {
    labels: validData.map((item) => format(new Date(item.date_stock), 'yyyy-MM-dd')),
    datasets: [
      {
        label: 'Stock Data',
        data: validData.map((item) => item.adj_close),
        borderColor: 'blue',
        fill: false,
      },
      {
        label: 'News Sentiment',
        data: validData.map((item) => item.average_sentiment_score),
        borderColor: 'green',
        fill: false,
      },
    ],
  };
};
