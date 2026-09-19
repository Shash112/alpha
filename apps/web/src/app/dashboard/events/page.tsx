'use client';

import { Calendar, Plus, MapPin, Users } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Events & Networking
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Coordinate networking events, track attendee QR scans, and aggregate event leads.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 shadow-subtle">
        <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-navy-900">No active networking events</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create an event badge or campaign QR to track introductions during conferences and expos.
          </p>
        </div>
      </div>
    </div>
  );
}
