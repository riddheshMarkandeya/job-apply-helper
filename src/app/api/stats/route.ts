import { IAddUrlBody, IStats } from '../../resume-types'
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import moment from 'moment';
import { type NextRequest } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'json/appliedjobs.json');

async function createIfNotFound() {
  if (!fs.existsSync(dataFilePath)) {
    const data = JSON.stringify({}, undefined, 2);
    await fsPromises.writeFile(dataFilePath, data);
  }
}

export async function getStats():Promise<IStats> {
  await createIfNotFound();
  const jsonData = await fsPromises.readFile(dataFilePath);
  return JSON.parse(jsonData.toString());
}

async function writeStats(data: IStats) {
  await createIfNotFound();
  const updatedData = JSON.stringify(data, undefined, 2);
  await fsPromises.writeFile(dataFilePath, updatedData);
}

export async function POST(request: NextRequest) {
  try {
    await createIfNotFound();
    const data:IAddUrlBody = await request.json();
    const url = data.url;
    const stats = await getStats();
    const today = moment().format("YYYY-MM-DD");
    if (stats[today] === undefined) {
      stats[today] = [url];
    } else {
      stats[today].push(url);
    }
    await writeStats(stats);

    return Response.json({message: "Updated"});
  } catch (error) {
    console.error(error);
    return new Response(undefined, {
      status: 500,
      statusText: "Failed to update"
    });
  }
}
