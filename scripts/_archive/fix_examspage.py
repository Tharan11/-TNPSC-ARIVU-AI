#!/usr/bin/env python3
"""Fix ExamsPage.tsx: add missing selectedExam + DIFFICULTY_MAP (real crash fix)."""
import re

path = "src/pages/ExamsPage.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

anchor = "  const navigate = useNavigate();\n"
if anchor not in content:
    print("ERROR: anchor line not found — file may already be edited. Aborting, no changes made.")
    raise SystemExit(1)

if "selectedExam" in content.split(anchor)[1][:500] and "const selectedExam" in content:
    print("selectedExam already defined — skipping, no changes made.")
    raise SystemExit(0)

insertion = """  const navigate = useNavigate();
  const { slug } = useParams();
  const selectedExam = slug ? MOCK_EXAMS.find((e) => e.slug === slug) : null;

  const DIFFICULTY_MAP: Record<string, { ta: string; en: string; color: string }> = {
    GROUP_1: { ta: 'மிகவும் கடினம்', en: 'Very Hard', color: 'text-red-400' },
    GROUP_2: { ta: 'கடினம்', en: 'Hard', color: 'text-orange-400' },
    GROUP_2A: { ta: 'நடுத்தரம்', en: 'Medium', color: 'text-yellow-400' },
    GROUP_4: { ta: 'எளிதானது', en: 'Easy', color: 'text-green-400' },
    VAO: { ta: 'எளிதானது', en: 'Easy', color: 'text-green-400' },
    ENGINEERING: { ta: 'கடினம்', en: 'Hard', color: 'text-orange-400' },
    FOREST: { ta: 'நடுத்தரம்', en: 'Medium', color: 'text-yellow-400' },
    POLICE: { ta: 'நடுத்தரம்', en: 'Medium', color: 'text-yellow-400' },
  };
"""

content = content.replace(anchor, insertion, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed: ExamsPage.tsx now defines selectedExam and DIFFICULTY_MAP.")
