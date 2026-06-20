#!/usr/bin/env bash
# ARIVU AI — consolidated fix script (corrected version)
# Run from the repo root: /c/TNPSC
set -e

echo "1. Fix useEffect import in CurrentAffairsPage"
sed -i "s/import { useState } from 'react';/import { useState, useEffect } from 'react';/" src/pages/CurrentAffairsPage.tsx

echo "2. Add community/success-stories route"
sed -i 's|<Route path="/success-stories" element={<CommunityPage />} />|<Route path="/success-stories" element={<CommunityPage />} />\n                <Route path="/community/success-stories" element={<SuccessStoriesPage />} />|' src/App.tsx

echo "3. Fix stray Korean character in LeaderboardPage (Anonymous label)"
sed -i "s/t('அஃகியவர்', 'Anonymous')/t('அறியப்படாதவர்', 'Anonymous')/" src/pages/LeaderboardPage.tsx

echo "4. Fix stray Hindi/Devanagari character in TestPage (Submit label)"
sed -i "s/t('சமர்पண', 'Submit')/t('சமர்ப்பி', 'Submit')/" src/pages/TestPage.tsx

echo "5. Fix Sidebar dead routes"
sed -i "s|path: '/pyqs'|path: '/pyq'|" src/components/layout/Sidebar.tsx
sed -i "s|path: '/analytics'|path: '/dashboard'|" src/components/layout/Sidebar.tsx
sed -i "s|path: '/achievements'|path: '/leaderboard'|" src/components/layout/Sidebar.tsx
sed -i "s|path: '/settings'|path: '/profile'|" src/components/layout/Sidebar.tsx

echo "6. Fix wrong answer in data.ts (q14 — Tamil Nadu assembly seats)"
sed -i "s|{ id: 'a', textTamil: '224', textEnglish: '224', isCorrect: true }|{ id: 'a', textTamil: '224', textEnglish: '224', isCorrect: false }|" src/lib/data.ts
sed -i "s|{ id: 'b', textTamil: '234', textEnglish: '234', isCorrect: false }|{ id: 'b', textTamil: '234', textEnglish: '234', isCorrect: true }|" src/lib/data.ts

echo "7. Fix contact email"
sed -i 's|support@arivuai.com|gangatharan110907@gmail.com|' src/pages/ContactPage.tsx

echo "8. Add streak/dailyCompleted fields to User type"
sed -i 's|totalStudyMins: number;|totalStudyMins: number;\n  streak?: number;\n  dailyCompleted?: number;|' src/lib/types.ts

echo "9. Delete exposed API key file (skip if already removed)"
if [ -f src/lib/ai.ts ]; then
  rm src/lib/ai.ts
  echo "   removed src/lib/ai.ts"
else
  echo "   src/lib/ai.ts already removed — skipping"
fi

echo "10. Delete backup file (skip if already removed)"
if [ -f src/lib/data_backup.ts ]; then
  rm src/lib/data_backup.ts
  echo "   removed src/lib/data_backup.ts"
else
  echo "   src/lib/data_backup.ts already removed — skipping"
fi

echo "Done. Review changes with: git status && git diff"
