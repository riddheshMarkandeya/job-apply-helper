import { IResume } from '../../resume-types'
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { type NextRequest } from 'next/server';

const dataFilePath = path.join(process.cwd(), 'json/resumedata.json');

async function createIfNotFound() {
  if (!fs.existsSync(dataFilePath)) {
    const data = JSON.stringify({fields: []}, undefined, 2);
    await fsPromises.writeFile(dataFilePath, data);
  }
}

export async function GET() {
  await createIfNotFound();
  const jsonData = await fsPromises.readFile(dataFilePath);
  const objectData = JSON.parse(jsonData.toString());
  
  return Response.json(objectData);
}

export async function POST(request: NextRequest) {
  try {
    await createIfNotFound();
    const data: IResume = await request.json();
    const updatedData = JSON.stringify(data, undefined, 2);
    await fsPromises.writeFile(dataFilePath, updatedData);
    return Response.json({message: "Updated"});
  } catch (error) {
    console.error(error);
    return new Response(undefined, {
      status: 500,
      statusText: "Failed to update"
    });
  }
}
