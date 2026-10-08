import React from 'react';
import { Compass, Users, Layers, ShieldCheck } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const values = [
    {
      icon: Compass,
      title: 'LOCAL EXPERTISE',
      description: 'Deep understanding of the Rajpipla and Gujarat regional market',
    },
    {
      icon: Users,
      title: 'TRUSTED GUIDANCE',
      description: 'Personalized advisory and dedicated support for every client',
    },
    {
      icon: Layers,
      title: 'MULTIPLE SOLUTIONS',
      description: 'Real Estate · Insurance · Finance under one trusted roof',
    },
    {
      icon: ShieldCheck,
      title: 'END-TO-END SUPPORT',
      description: 'Transparent guidance from initial enquiry to final completion',
    },
  ];

  return (
    <section id="trust-strip" className="bg-[#FAF9F5] border-y border-[#E8E4D8] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {values.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 group"
              >
                <div className="w-11 h-11 rounded-lg bg-[#FAF4E5] border border-[#C5A059]/40 flex items-center justify-center text-[#8C6E2E] group-hover:bg-[#0A192F] group-hover:text-[#E2C98D] group-hover:border-[#0A192F] transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#0A192F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
