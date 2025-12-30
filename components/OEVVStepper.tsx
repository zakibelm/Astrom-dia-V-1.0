import React from 'react';
import { Eye, Zap, CheckCircle2, Award } from 'lucide-react';
import { CampaignStatus } from '../types';

interface OEVVStepperProps {
  status: CampaignStatus;
}

const steps = [
  { id: 'observe', label: 'OBSERVE', icon: Eye },
  { id: 'execute', label: 'EXECUTE', icon: Zap },
  { id: 'verify', label: 'VERIFY', icon: CheckCircle2 },
  { id: 'validate', label: 'VALIDATE', icon: Award },
];

export default function OEVVStepper({ status }: OEVVStepperProps) {
  const getStepState = (stepId: string) => {
    const statusOrder = ['draft', 'observe', 'execute', 'verify', 'validate', 'published', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-astro-800 -z-0"></div>
        
        {steps.map((step) => {
          const state = getStepState(step.id);
          const Icon = step.icon;
          
          let circleClass = "bg-astro-800 text-astro-500 border-astro-700";
          let labelClass = "text-astro-500";

          if (state === 'completed') {
            circleClass = "bg-emerald-500/20 text-emerald-500 border-emerald-500";
            labelClass = "text-emerald-500";
          } else if (state === 'current') {
            circleClass = "bg-indigo-500 text-white border-indigo-400 ring-4 ring-indigo-500/20";
            labelClass = "text-indigo-400 font-bold";
          }

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center bg-astro-900 px-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${circleClass}`}>
                <Icon size={20} />
              </div>
              <span className={`mt-2 text-xs tracking-wider font-medium ${labelClass}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}