# Project instructions

## Working agreements

- Before acting on any request, check `.agents/skills/` for an applicable skill and follow its instructions when one matches the task.
- Before changing project structure or architectural boundaries (including layers, modules, features, domain entities, use cases, repositories, infrastructure services, or dependency wiring), read and apply the `clean-architecture` skill.
- Use `pnpm` for installing dependencies and running package scripts.
- Write new application code in TypeScript and follow the existing project structure and conventions.
- Keep changes focused on the requested task; do not modify unrelated files.
- Preserve existing user changes in the working tree.
- Never expose, commit, or overwrite secrets or environment files.
- Ask before adding or removing production dependencies.

## Validation

- Run `pnpm run lint` and `pnpm run typecheck` after code changes.
- Run `pnpm run build` when changes could affect the production build.
- Report any validation command that could not be run or did not pass.
