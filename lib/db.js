import { Pool } from 'pg';
import { format, subWeeks, subMonths, subYears } from 'date-fns';

const pool = new Pool({
  user: 'firntwbq',
  host: 'isilo.db.elephantsql.com',
  database: 'firntwbq',
  password: 'mVHmOFi7gnagKiEG2KILSmdpxIo5Odb2',
  port: 5432,
});

export const getChartData = async (filter) => {
  const client = await pool.connect();

  try {
    let dateFilter;
    switch (filter) {
      case 'lastMonth':
        dateFilter = format(subMonths(new Date(), 1), 'yyyy-MM-dd');
        break;
      case 'last3Month':
        dateFilter = format(subMonths(new Date(), 3), 'yyyy-MM-dd');
        break;
      case 'lastYear':
        dateFilter = format(subYears(new Date(), 1), 'yyyy-MM-dd');
        break;
      case 'last5Years':
        dateFilter = format(subYears(new Date(), 5), 'yyyy-MM-dd');
        break;
      default:
        dateFilter = '1900-01-01'; // or any default date
        break;
    }

    const result = await client.query(`
      SELECT date_stock, adj_close, average_sentiment_score
      FROM stockdata
      LEFT JOIN newsSentimen ON stockdata.date_stock = newsSentimen.date_news
      WHERE date_stock >= $1
      ORDER BY date_stock
    `, [dateFilter]);

    return transformChartData(result.rows);
  } finally {
    client.release();
  }
};

const transformChartData = (data) => {
  const validData = data.filter(
    (item) => item.date_stock && !isNaN(new Date(item.date_stock).getTime())
  );

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
