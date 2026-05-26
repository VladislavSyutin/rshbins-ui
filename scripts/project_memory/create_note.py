#!/usr/bin/env python3
from __future__ import annotations

import argparse
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Создать knowledge note в памяти проекта без ручного редактирования."
    )
    parser.add_argument("--kind", choices=["concept", "decision"], required=True)
    parser.add_argument("--slug", required=True, help="Имя файла без .md, в kebab-case.")
    parser.add_argument("--title", required=True, help="Заголовок note.")
    parser.add_argument("--status", help="Статус для ADR, например Accepted.")
    parser.add_argument("--summary", required=True)
    parser.add_argument("--why", action="append", default=[])
    parser.add_argument("--pattern", action="append", default=[])
    parser.add_argument("--pitfall", action="append", default=[])
    parser.add_argument("--file", action="append", default=[])
    parser.add_argument("--related-decision", action="append", default=[])
    parser.add_argument("--related-concept", action="append", default=[])
    parser.add_argument("--related-log", action="append", default=[])
    parser.add_argument("--context", action="append", default=[])
    parser.add_argument("--decision-line", action="append", default=[])
    parser.add_argument("--alternative", action="append", default=[])
    parser.add_argument("--consequence", action="append", default=[])
    return parser.parse_args()


def bullet_list(items: list[str], fallback: str) -> str:
    if not items:
        return f"- {fallback}"
    return "\n".join(f"- {item}" for item in items)


def note_link(note: str) -> str:
    return note if note.startswith("[[") else f"[[{note}]]"


def notes_list(notes: list[str], fallback: str) -> str:
    if not notes:
        return f"- {fallback}"
    return "\n".join(f"- {note_link(note)}" for note in notes)


def concept_content(args: argparse.Namespace) -> str:
    related_notes = [
        "[[memory/knowledge/index]]",
        "[[memory/knowledge/concepts/index]]",
        "[[memory/logs/index]]",
    ]
    related_notes.extend(note_link(note) for note in args.related_concept)
    related_notes.extend(note_link(note) for note in args.related_decision)
    related_notes.extend(note_link(note) for note in args.related_log)

    return f"""# {args.title}

Связанные заметки: {" | ".join(dict.fromkeys(related_notes))}

## Summary

{args.summary}

## Why It Matters

{bullet_list(args.why, 'Почему это важно, пока не зафиксировано.')}

## Known Patterns

{bullet_list(args.pattern, 'Устойчивые паттерны пока не зафиксированы.')}

## Known Pitfalls

{bullet_list(args.pitfall, 'Явные failure modes пока не зафиксированы.')}

## Related Modules Or Files

{bullet_list(args.file, 'Связанные модули пока не указаны.')}

## Related Decisions

{notes_list(args.related_decision, 'Отдельные решения пока не привязаны.')}

## Related Concepts

{notes_list(args.related_concept, 'Связанные понятия пока не привязаны.')}

## Source Logs

{notes_list(args.related_log, 'Логи-источники пока не привязаны.')}
"""


def decision_content(args: argparse.Namespace) -> str:
    related_notes = [
        "[[memory/knowledge/index]]",
        "[[memory/knowledge/decisions/index]]",
        "[[memory/logs/index]]",
    ]
    related_notes.extend(note_link(note) for note in args.related_concept)
    related_notes.extend(note_link(note) for note in args.related_log)

    return f"""# ADR: {args.title}

Связанные заметки: {" | ".join(dict.fromkeys(related_notes))}

## Status

{args.status or 'Draft'}

## Context

{bullet_list(args.context, 'Контекст пока не зафиксирован.')}

## Decision

{bullet_list(args.decision_line, 'Решение пока не зафиксировано.')}

## Alternatives Considered

{bullet_list(args.alternative, 'Альтернативы пока не зафиксированы.')}

## Consequences

{bullet_list(args.consequence, 'Последствия пока не зафиксированы.')}

## Related Concepts

{notes_list(args.related_concept, 'Связанные понятия пока не привязаны.')}

## Source Logs

{notes_list(args.related_log, 'Логи-источники пока не привязаны.')}
"""


def main() -> int:
    args = parse_args()
    repo_root = Path(__file__).resolve().parents[2]
    if args.kind == "concept":
      notes_root = repo_root / "memory" / "knowledge" / "concepts"
      content = concept_content(args)
    else:
      notes_root = repo_root / "memory" / "knowledge" / "decisions"
      content = decision_content(args)

    path = notes_root / f"{args.slug}.md"
    path.write_text(content.rstrip() + "\n", encoding="utf-8")
    print(f"[OK] Note written to {path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
