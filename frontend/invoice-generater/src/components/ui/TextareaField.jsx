import React from 'react'

const TextareaField = ({ icon: Icon, label, name, ...props }) => {
  return (
    <div>
      <label htmlFor={name} className='block text-sm font-medium text-slate-700 mb-2'>{label}</label>
      <div className='relative'>
        {Icon && (<div className='absolute top-3 left-0 pl-3 flex items-center pointer-events-none'>
          <Icon className='w-5 h-5 text-salte-400' />
        </div>)}
        <textarea 
           name={name} 
           id={name}
           rows={3}
           {...props}
           className={`w-full min-h-[100px] pr-3 py-2 border border-slate-200 rounded-lg bg-white resize-vertical foucs:outline-none foucs:ring-2 foucs:ring-blue-500 foucs:border-transparent ${Icon ? "pl-10" : "pl-3"}`}
            ></textarea>
      </div>
    </div>
  )
}

export default TextareaField;