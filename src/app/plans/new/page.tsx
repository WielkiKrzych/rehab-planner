'use client';

import { Layout } from '@/components/layout/Layout';
import { PlanBuilder } from '@/components/plans/PlanBuilder';

export default function NewPlanPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Nowy plan rehabilitacji</h1>
          <p className="text-gray-400 mt-1">
            Utwórz nowy plan z ćwiczeniami dla pacjenta
          </p>
        </div>
        <PlanBuilder />
      </div>
    </Layout>
  );
}
