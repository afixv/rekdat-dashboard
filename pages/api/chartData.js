import { getChartData } from "../../lib/db";

export default async function handler(req, res) {
  const { filter } = req.query;
  const chartData = await getChartData(filter);
  res.json({ chartData });
}
