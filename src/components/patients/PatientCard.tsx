'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Patient } from '@/types';

interface PatientCardProps {
  patient: Patient;
}

function formatBirthDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateAge(dateString: string): number | null {
  if (!dateString) return null;
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function PatientCardComponent({ patient }: PatientCardProps) {
  const primaryDiagnosis = patient.diagnoses[0];
  const age = calculateAge(patient.birthDate);
  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  return (
    <Link href={`/patients/${patient.id}`}>
      <div className="group glass-card rounded-xl p-5 hover:border-neon-cyan/40 transition-all duration-300 cursor-pointer border border-neon-cyan/10 hover:shadow-lg hover:shadow-neon-cyan/10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-neon-cyan/30 group-hover:scale-105 transition-transform">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-white truncate group-hover:text-neon-cyan transition-colors">
                {patient.firstName} {patient.lastName}
              </h3>
              {patient.activePlanId && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neon-green/20 text-neon-green border border-neon-green/30">
                  Aktywny plan
                </span>
              )}
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm text-gray-400">
              {age !== null && (
                <span>{age} lat</span>
              )}
              {patient.phone && (
                <>
                  <span className="text-gray-600">|</span>
                  <span>{patient.phone}</span>
                </>
              )}
            </div>

            {primaryDiagnosis && (
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-neon-pink/10 text-neon-pink border border-neon-pink/30">
                  <svg className="w-3 h-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {primaryDiagnosis.name}
                </span>
              </div>
            )}
          </div>

          <div className="text-gray-600 group-hover:text-neon-cyan transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

export const PatientCard = memo(PatientCardComponent);
