import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-36 pb-28 min-h-[75vh] flex items-center justify-center bg-[#FAF9F5]">
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAF4E5] border border-[#C5A059] flex items-center justify-center mx-auto text-[#8C6E2E]">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6E2E]">
            404 Error
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0A192F]">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            The page you are looking for may have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded bg-white hover:bg-slate-50 text-[#0A192F] text-xs font-semibold uppercase tracking-wider border border-[#E8E4D8] transition-colors"
          >
            <span>Explore Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
