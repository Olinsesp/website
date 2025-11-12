'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';

type Modality = {
  id: string;
  nome: string;
  camposExtras?: ExtraField[];
};

type ExtraField = {
  id: string;
  label: string;
  type: string;
  options?: string[];
};

type Props = {
  options: Modality[];
  selected: string[];
  onChange: (values: string[]) => void;
  register: any;
  errors: any;
  setValue: any;
  sexo: 'm' | 'f' | undefined;
};

export default function ModalidadesSelector({
  options,
  selected,
  onChange,
  register,
  errors,
  setValue,
  sexo,
}: Props) {
  const [selectedModalidade, setSelectedModalidade] = useState<string | null>(
    null,
  );

  const handleCheckboxChange = (checked: boolean, modalidade: Modality) => {
    const next = checked
      ? [...selected, modalidade.nome]
      : selected.filter((m) => m !== modalidade.nome);
    onChange(next);

    if (checked) {
      setSelectedModalidade(modalidade.nome);
    } else if (selectedModalidade === modalidade.nome) {
      setSelectedModalidade(null);
    }
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {options.map((modalidade) => {
        const isChecked = selected?.includes(modalidade.nome) || false;
        const isExpanded = selectedModalidade === modalidade.nome && isChecked;

        const filteredCamposExtras =
          modalidade.camposExtras?.filter((field) => {
            if (!sexo) {
              return false;
            }
            const fieldId = field.id.toLowerCase();
            const fieldLabel = field.label.toLowerCase();

            const isMasculinoField =
              fieldId.includes('masculino') ||
              fieldId.includes('masculina') ||
              fieldLabel.includes('masculino') ||
              fieldLabel.includes('masculina');

            const isFemininoField =
              fieldId.includes('feminino') ||
              fieldId.includes('feminina') ||
              fieldLabel.includes('feminino') ||
              fieldLabel.includes('feminina');

            if (!isMasculinoField && !isFemininoField) {
              return true;
            }

            if (isMasculinoField && sexo === 'm') {
              return true;
            }

            if (isFemininoField && sexo === 'f') {
              return true;
            }

            return false;
          }) || [];

        return (
          <div key={modalidade.id} className='space-y-4'>
            <label
              htmlFor={modalidade.nome}
              className='flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group'
            >
              <Checkbox
                id={modalidade.nome}
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(checked === true, modalidade)
                }
                className='border-2 border-gray-300 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500'
              />
              <span className='text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors'>
                {modalidade.nome}
              </span>
            </label>

            {isExpanded && filteredCamposExtras.length > 0 && (
              <div className='p-4 border-l-4 border-blue-500 bg-gray-50 rounded-lg space-y-4'>
                <h4 className='font-semibold text-gray-800'>
                  Detalhes para {modalidade.nome}
                </h4>
                {filteredCamposExtras.map((field) => (
                  <div key={field.id} className='space-y-2'>
                    <Label
                      htmlFor={field.id}
                      className='text-gray-700 font-medium'
                    >
                      {field.label} *
                    </Label>
                    {field.type === 'select' ? (
                      <Select
                        onValueChange={(value) => setValue(field.id, value)}
                      >
                        <SelectTrigger className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'>
                          <SelectValue
                            placeholder={`Selecione ${field.label.toLowerCase()}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={field.id}
                        {...register(field.id)}
                        className='border-2 border-gray-200 focus:border-blue-500 transition-colors h-12'
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    )}
                    {errors[field.id] && (
                      <div className='flex items-center gap-2 text-red-500 text-sm mt-1'>
                        <AlertCircle className='h-4 w-4' />
                        {errors[field.id].message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
