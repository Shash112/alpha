'use client';

import { Layers, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export default function AppointmentsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Appointments & Scheduling
        </h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
          Allow contacts to book meetings directly from your digital identity card.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center space-y-4 shadow-subtle">
        <div className="w-12 h-12 rounded-full bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mx-auto">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-navy-900">Configure your meeting booking link</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Connect your calendar or add a booking CTA to your card so prospects can schedule calls instantly.
          </p>
        </div>
      </div>
    </div>
  );
}
