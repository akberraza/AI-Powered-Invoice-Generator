import React from 'react'

const SelectField = ({label, name, options, ...props}) => {
  return (
   <div>
    <label htmlFor={name} className='block text-sm font-medium text-slate-700 mb-2'>{label}</label>
    <select 
       id={name}
       name={name}
       {...props}
       className='w-full h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 foucs:outline-none foucs:ring-2 foucs:ring-blue-500 foucs:border-transparent'
    >
        {options.map(option => (
            <options key={option.value || option} value={option.value || option}>
                {option.label || option}
            </options>
        ))}
    </select>
   </div>
)
}

export default SelectField