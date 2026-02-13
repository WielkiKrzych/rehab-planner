'use client';

import { useState, FormEvent } from 'react';
import { Patient } from '@/types';

interface PatientFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  notes: string;
}

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: PatientFormData) => void;
  onCancel: () => void;
}

export function PatientForm({ patient, onSubmit, onCancel }: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    birthDate: patient?.birthDate || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    notes: patient?.notes || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PatientFormData, string>> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const updateField = <K extends keyof PatientFormData>(field: K, value: PatientFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1.5">
            Imię <span className="text-neon-pink">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            value={formData.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
            className={`form-input w-full px-4 py-2.5 ${errors.firstName ? 'border-neon-pink bg-neon-pink/5' : ''}`}
            placeholder="Jan"
          />
          {errors.firstName && (
            <p className="mt-1.5 text-sm text-neon-pink">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1.5">
            Nazwisko <span className="text-neon-pink">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            value={formData.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
            className={`form-input w-full px-4 py-2.5 ${errors.lastName ? 'border-neon-pink bg-neon-pink/5' : ''}`}
            placeholder="Kowalski"
          />
          {errors.lastName && (
            <p className="mt-1.5 text-sm text-neon-pink">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-1.5">
            Data urodzenia
          </label>
          <input
            type="date"
            id="birthDate"
            value={formData.birthDate}
            onChange={(e) => updateField('birthDate', e.target.value)}
            className="form-input w-full px-4 py-2.5"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="form-input w-full px-4 py-2.5"
            placeholder="+48 123 456 789"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="form-input w-full px-4 py-2.5"
          placeholder="jan.kowalski@email.com"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1.5">
          Notatki
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          rows={4}
          className="form-input w-full px-4 py-2.5 resize-none"
          placeholder="Dodatkowe informacje o pacjencie..."
        />
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-neon-cyan/10">
        <button
          type="submit"
          className="btn-neon px-6 py-2.5"
        >
          {patient ? 'Zapisz zmiany' : 'Dodaj pacjenta'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-white/5 text-gray-300 font-medium rounded-lg border border-gray-600 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
}
