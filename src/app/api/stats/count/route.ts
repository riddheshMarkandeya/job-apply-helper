import { IStatsCountRes } from '../../../resume-types'
import { getStats } from '../route';
import moment from 'moment';


export async function GET() {
  const stats = await getStats();
  const today = moment().format("YYYY-MM-DD");
  let count = 0;
  if (stats[today] === undefined) {
    count = 0;
  } else {
    count = stats[today].length;
  }

  return Response.json({
    count: count
  } as IStatsCountRes);
}