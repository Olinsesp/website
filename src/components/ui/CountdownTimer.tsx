'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-02-15T09:00:00');
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Dias', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ];

  return (
    <div className='text-center bg-gradient-to-r from-blue-500 to-orange-500 p-6 rounded-lg shadow-lg'>
      <h3 className='text-lg font-semibold mb-4'>O evento começa em:</h3>
      <div className='grid grid-cols-4 gap-2 max-w-md mx-auto'>
        {timeUnits.map((unit) => (
          <Card key={unit.label} className='p-3 bg-gradient-card shadow-card'>
            <div className='text-2xl font-bold'>
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className='text-xs uppercase text-gray-800'>{unit.label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
