// Insights & Weekly Story Page with Health Story Narrative and Printable Report Export
import React, { useState } from 'react';
import { Sparkles, TrendingUp, FileText, Calendar, Award } from 'lucide-react';
import WeeklyStoryView from '../components/insights/WeeklyStoryView';
import ExportReportModal from '../components/insights/ExportReportModal';
import Button from '../components/common/Button';

export default function InsightsPage() {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Weekly Story Narrative */}
      <WeeklyStoryView onOpenExportReport={() => setIsExportOpen(true)} />

      {/* Export Report Modal */}
      {isExportOpen && (
        <ExportReportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
