type Props = {
  title:string
  value:string | number
  icon:any
  color:string
}

export const Card = ({title,value,icon,color}:Props) => {

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex justify-between">
      <div>
        <p className="text-xs text-zinc-400">
          {title}
        </p>
        <p className="text-lg font-semibold mt-1">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-md ${color}`}>
        {icon}
      </div>
    </div>
  )
}