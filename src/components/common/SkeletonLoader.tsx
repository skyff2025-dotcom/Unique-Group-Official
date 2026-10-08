import React from 'react';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-[#E8E4D8] animate-pulse flex flex-col h-full">
      <div className="aspect-[16/10] bg-slate-200" />
      <div className="p-5 space-y-3 flex-grow">
        <div className="h-3 w-1/3 bg-slate-200 rounded" />
        <div className="h-6 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-1/2 bg-slate-200 rounded" />
        <div className="h-10 w-full bg-slate-100 rounded mt-2" />
        <div className="pt-3 border-t border-[#F4F2EA] flex justify-between items-center">
          <div className="h-4 w-1/4 bg-slate-200 rounded" />
          <div className="h-4 w-1/4 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const CompanyCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-7 rounded-xl border border-[#E8E4D8] animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-6 w-1/2 bg-slate-200 rounded" />
        <div className="h-5 w-16 bg-slate-100 rounded" />
      </div>
      <div className="h-12 w-full bg-slate-100 rounded" />
      <div className="space-y-2 pt-2">
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
        <div className="h-3 w-2/3 bg-slate-200 rounded" />
      </div>
      <div className="pt-4 border-t border-[#F4F2EA]">
        <div className="h-4 w-1/3 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export const PlanCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-7 rounded-xl border border-[#E8E4D8] animate-pulse space-y-4">
      <div className="flex justify-between">
        <div className="h-4 w-1/4 bg-slate-200 rounded" />
        <div className="h-4 w-1/4 bg-slate-200 rounded" />
      </div>
      <div className="h-7 w-2/3 bg-slate-200 rounded" />
      <div className="h-12 w-full bg-slate-100 rounded" />
      <div className="space-y-2">
        <div className="h-3 w-4/5 bg-slate-200 rounded" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="pt-4 border-t border-[#F4F2EA] flex justify-between items-center">
        <div className="h-5 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-28 bg-slate-200 rounded" />
      </div>
    </div>
  );
};

export const PropertyDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-4 w-40 bg-slate-200 rounded" />
      <div className="aspect-[21/9] max-h-[500px] w-full bg-slate-200 rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="h-40 bg-white border border-[#E8E4D8] rounded-xl" />
          <div className="h-60 bg-white border border-[#E8E4D8] rounded-xl" />
        </div>
        <div className="lg:col-span-4">
          <div className="h-96 bg-white border border-[#E8E4D8] rounded-xl" />
        </div>
      </div>
    </div>
  );
};
