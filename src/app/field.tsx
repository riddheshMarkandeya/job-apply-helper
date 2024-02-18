"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { IResumeField } from './resume-types';

interface IProps {
  data: IResumeField,
  handleDelete: (id:string) => void,
  move: (id:string, isUp:boolean) => void,
}
export default function Field({ data, handleDelete, move }: IProps) {
  function copyText() {
    navigator.clipboard.writeText(data.value);
  }

  return (
    <div className="flex flex-wrap flex-auto max-w-[50%] p-1">
      <div className="w-full text-slate-500 text-sm truncate">{data.name}:</div>
      <div className="cursor-pointer flex-auto text-sm truncate whitespace-pre-line max-h-16 max-w-[75%] border border-gray-400 lg:border-t lg:border-gray-400 bg-gray-100 hover:bg-gray-300 active:bg-gray-400 rounded lg:rounded lg:rounded p-2 justify-between leading-normal"
        onClick={copyText}>
        {data.value}
      </div>
      <button onClick={() => {handleDelete(data.id)}} className="flex flex-col p-2"><FontAwesomeIcon icon={faTrashCan} /></button>
      <div>
        <button onClick={() => {move(data.id, true)}} className="flex flex-col"><FontAwesomeIcon icon={faChevronUp} /></button>
        <button onClick={() => {move(data.id, false)}} className="flex flex-col"><FontAwesomeIcon icon={faChevronDown} /></button>
      </div>
    </div>
  );
}