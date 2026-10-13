// PreToolUse(Bash) hook: Issue -> Branch -> PR 워크플로우 강제
const { execSync } = require('child_process');
let raw = '';
process.stdin.on('data', d => (raw += d));
process.stdin.on('end', () => {
  let cmd = '';
  try { cmd = (JSON.parse(raw).tool_input || {}).command || ''; } catch { process.exit(0); }
  const block = msg => { console.error('[workflow-guard] ' + msg + '\n규율: CLAUDE.md 참고 (Issue → Branch → PR)'); process.exit(2); };

  let branch = '';
  try { branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(); } catch {}
  const protectedBranch = /^(main|master)$/.test(branch);

  // 명령 위치(문장 시작, &&, ||, ;, |)에서만 검사 — 본문·메시지 속 문구 오탐 방지
  const START = '(?:^|&&|\\|\\||;|\\|)\\s*';
  const at = re => new RegExp(START + re.source).test(cmd);

  if (at(/git\s+commit\b/) && protectedBranch)
    block(`${branch} 브랜치에 직접 커밋할 수 없습니다. 이슈를 만들고 <type>/<issue>-<slug> 브랜치를 생성하세요.`);
  const pushArgs = (cmd.match(new RegExp(START + 'git\\s+push\\b([^;&|\\n]*)')) || [])[1];
  if (pushArgs !== undefined && (protectedBranch || /(^|[\s:])(main|master)(\s|$)/.test(pushArgs)))
    block('main/master로 직접 push할 수 없습니다. 작업 브랜치를 push하고 PR을 생성하세요.');
  if (at(/gh\s+pr\s+merge\b/))
    block('PR 머지는 사용자 승인 후 사용자가 직접 수행합니다.');
  if (at(/gh\s+pr\s+create\b/) && !/--body-file|-F\b/.test(cmd) && !/(close[sd]?|fix(e[sd])?|resolve[sd]?)\s+#\d+/i.test(cmd))
    block('PR 본문에 "Closes #<이슈번호>"가 필요합니다.');
  process.exit(0);
});
