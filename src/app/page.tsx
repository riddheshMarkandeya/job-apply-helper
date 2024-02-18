"use client"
import { useState } from "react";
import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { v4 } from 'uuid';
import Field from "./field";
import { IAddUrlBody, IResume, IResumeField, IStatsCountRes } from './resume-types';

async function getResumeData(): Promise<IResume> {
  const response = await fetch('/api/resume-json')
  const data = await response.json();
  return data;
}

async function getStatsCount(): Promise<IStatsCountRes> {
  const response = await fetch('/api/stats/count')
  const data = await response.json();
  return data;
}

async function saveData(data: IResume | undefined) {
  if (data) {
    await fetch('/api/resume-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }
}

async function statsAddUrl(url: string) {
  if (url !== "") {
    await fetch('/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: url
      } as IAddUrlBody)
    });
  }
}

function arraymove<Type>(arr: Type[], fromIndex: number, toIndex: number) {
  const element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}

export default function Home() {
  const { data, mutate: mutateData } = useSWR('/api/resume-json', getResumeData);
  const { data: count, mutate: mutateCount } = useSWR('/api/stats/count', getStatsCount);
  const resume = data;
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [url, setUrl] = useState('');

  async function handleDelete(id: string) {
    if (window.confirm('Delete the item?')) {
      const index = resume?.fields.findIndex((field) => field.id === id);
      if (index !== undefined && resume && resume.fields) {
        resume.fields.splice(index, 1);
        
        await saveData(resume);
        mutateData();
      }
    }
  }

  async function handleAdd() {
    resume?.fields.push({
      id: v4(),
      name,
      value,
    });
    await saveData(resume);
    setName('');
    setValue('');
    mutateData();
  }

  async function move(id: string, isUp: boolean) {
    const index = resume?.fields.findIndex((field) => field.id === id);
    if (index !== undefined && resume?.fields) {
      if (isUp && index - 1 >= 0) {
        arraymove<IResumeField>(resume.fields, index, index - 1);
      }
      if (!isUp && index + 1 < resume.fields.length) {
        arraymove<IResumeField>(resume.fields, index, index + 1);
      }
      resume.fields = [...resume.fields];
      await saveData(resume);
      mutateData();
    }
  }

  async function addApplication() {
    await statsAddUrl(url);
    setUrl('');
    mutateCount();
  }

  return (
    <main className="flex flex-col fixed overflow-auto h-full p-8 lg:p-24">
      <div className="relative w-full flex place-items-center flex-wrap">
        <div className="flex flex-wrap w-full p-1">
          <input className="flex-auto text-sm text-sm max-h-16 max-w-[90%] border border-gray-400 lg:border-t lg:border-gray-400 hover:bg-gray-100 rounded lg:rounded lg:rounded p-1 my-2 justify-between leading-normal"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}></input>
          <textarea className="flex-auto text-sm text-sm max-h-8 max-w-[90%] border border-gray-400 lg:border-t lg:border-gray-400 hover:bg-gray-100 rounded lg:rounded lg:rounded p-1 justify-between leading-normal"
            placeholder="Value"
            rows={1}
            value={value}
            onChange={e => setValue(e.target.value)} />
          <button onClick={handleAdd} className="flex flex-col p-2"><FontAwesomeIcon icon={faPlus} /></button>
        </div>
        {resume?.fields.map((field) => (
          <Field key={field.id}
            data={field}
            handleDelete={handleDelete}
            move={move}></Field>
        ))}
      </div>
      <div className="flex-grow"></div>
      <div className="flex sticky bottom-0 inset-x-0 border shadow-[0px_-5px_5px_-5px_#333] border-black bg-slate-200 rounded mt-1.5">
        <div className="text-3xl p-1 text-center align-center">{count?.count}</div>
        <input className="flex-auto text-sm text-sm max-h-16 max-w-full border border-gray-400 lg:border-t lg:border-gray-400 hover:bg-gray-100 rounded lg:rounded lg:rounded p-1 m-2"
              placeholder="Application Url"
              value={url}
              onChange={e => setUrl(e.target.value)}></input>
        <button onClick={addApplication} className="pr-2"><FontAwesomeIcon icon={faPlus} /></button>
      </div>
    </main>
  );
}
