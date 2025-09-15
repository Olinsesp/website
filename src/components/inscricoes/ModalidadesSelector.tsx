'use client';

import { Checkbox } from '@/components/ui/checkbox';

type Props = {
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
};

export default function ModalidadesSelector({
  options,
  selected,
  onChange,
}: Props) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {options.map((modalidade) => {
        const isChecked = selected?.includes(modalidade) || false;

        return (
          <label
            key={modalidade}
            htmlFor={modalidade}
            className='flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group'
          >
            <Checkbox
              id={modalidade}
              checked={isChecked}
              onCheckedChange={(checked) => {
                const isTrue = checked === true;

                const next = isTrue
                  ? [...selected, modalidade]
                  : selected.filter((m) => m !== modalidade);
                onChange(next);
              }}
              className='border-2 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500'
            />

            <span className='text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors'>
              {modalidade}
            </span>
          </label>
        );
      })}
    </div>
  );
}
