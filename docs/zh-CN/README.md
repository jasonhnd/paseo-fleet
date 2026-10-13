# paseo-fleet

本仓库保留独立 Fleet 插件的历史。Fleet 的角色、额度节奏、派活策略、待拍板和设置已合入 [Paseo Kanban](https://github.com/jasonhnd/paseo-kanban)，与编码 agent 看板一起提供。[English](../../README.md)

历史独立包：`@jasonhnd/paseo-fleet-cockpit`；插件 id：`agent-fleet-cockpit`。

## 安装 Paseo Kanban

新安装使用单个 `paseo-kanban` 插件。按[统一上手指南](https://github.com/jasonhnd/paseo-kanban/blob/v0.1.0-rc.4/docs/zh-CN/README.md)和 [Git 安装指南（英文）](https://github.com/jasonhnd/paseo-kanban/blob/v0.1.0-rc.4/docs/GIT-INSTALL.md)操作，无须在 Kanban 旁再安装独立 Fleet 插件。

当前公开 Git 来源是 `github:jasonhnd/paseo-kanban`，分支为 `integration/single-plugin-reviewed`。以下新安装示例固定到 GitHub 预发布 [v0.1.0-rc.4](https://github.com/jasonhnd/paseo-kanban/releases/tag/v0.1.0-rc.4)，发布及复核日期为 **2026-10-13**：

```sh
paseo plugin install github:jasonhnd/paseo-kanban --ref v0.1.0-rc.4
paseo plugin ls paseo-kanban --json
```

这是官方 Paseo CLI 的直接 Git 获取入口，不代表已收录官方 registry 或已发布 npm 包。rc.4 是实验性 Git 预发布。安装及升级仍须完成该 Release 列出的检查。实体手机、原生 app、已认证 provider／首卡／审查／验收／清理闭环、Linux 和 WSL2 仍未验证；保留限制及发布后的验证状态以 Release 记录为准。

安装前核对统一插件的 daemon/app 与 Node 要求，在目标宿主启用全局和单插件开关，并核实安装 revision 和实际面板。[兼容证据](https://github.com/jasonhnd/paseo-kanban/blob/v0.1.0-rc.4/docs/zh-CN/COMPATIBILITY.md)说明平台、客户端和 provider 限制；安装命令不认证未测试环境。若已安装 `paseo-kanban`，按指南显式指定 ref 更新，或走[换源与恢复流程](https://github.com/jasonhnd/paseo-kanban/blob/v0.1.0-rc.4/docs/zh-CN/RELEASE.md)，不要再次安装相同 id。

## 从独立 Fleet 转向统一插件

旧数据**不会自动导入**。复用旧状态前先读[手动转移指南（英文）](https://github.com/jasonhnd/paseo-kanban/blob/v0.1.0-rc.4/docs/MANUAL-MIGRATION.md)：

1. 停止派活及旧插件、定时任务和命令写入者。制作一致的数据备份，另行记录插件设置、安装 revision 和启用状态。
2. 选择新的空统一根目录：`KANBAN_DATA_DIR`，或 `PASEO_HOME/plugin-data/paseo-kanban`；Fleet 状态放在 `fleet/` 子目录。取消旧的 `AFC_DATA_DIR`、`ROLES_STATE_DIR`、`AFC_LEGACY_DATA_DIR` 覆盖。
3. 只转移指南列出的逐项批准文件；验证 schema 和路径，明确解决冲突，重新生成额度/策略状态。不整目录覆盖，不复制凭证或 supervisor token。
4. 启用统一 `paseo-kanban` 前，禁用旧 `agent-fleet-cockpit` 插件及其写入者。核对实际根目录、设置、角色、额度策略、待拍板和看板后才恢复派活。代码回退不恢复数据；数据恢复按文档的一致备份流程另行操作。

统一插件的问题及迁移疑问提交到 [Paseo Kanban issues](https://github.com/jasonhnd/paseo-kanban/issues)。已有 Fleet issue 保留原讨论历史，并交叉链接新报告。

## 独立版历史与支持状态

**最后受支持的独立版本：未确认。** 截至 **2026-10-13**，最新公开独立 tag 为 [v0.1.0-rc.7](https://github.com/jasonhnd/paseo-fleet/tree/v0.1.0-rc.7)，指向 `9ca083f6561a6062f028cac85f7a26437de2abf0`。公开 [GitHub Release 列表](https://github.com/jasonhnd/paseo-fleet/releases)为空，独立版 changelog 未声明已发行基线。该 tag 只代表历史快照，不能据此认定最后受支持的独立发行；包元数据 `0.1.0` 也不能证明。

公开历史和 [tags](https://github.com/jasonhnd/paseo-fleet/tags)继续保留。本仓库尚未归档。下方文档与命令描述旧独立源码；新安装及迁移请用上方统一插件指南。

## 旧独立版文档与命令

[工作流](WORKFLOW.md) · [数据](DATA.md) · [兼容](COMPATIBILITY.md) · [发布/更新](RELEASE.md) · [贡献](CONTRIBUTING.md) · [安全](SECURITY.md) · [变更](CHANGELOG.md)

本仓库的旧独立源码先 `npm run build`（Fleet 的 build:cli 是别名）。其 manifest build 运行 server/prepare.mjs；Git 准备先 npm ci --include=dev --ignore-scripts --no-audit --no-fund，再 npm run build。生成的 bin/*.bundle.mjs 和 server/paseo-client.bundle.mjs 不提交 Git，npm 产物含预打包 bundle。旧实现的准备与恢复流程见 [Fleet Git 安装文档](GIT-INSTALL.md)，此链接不是新的推荐安装入口。已打包命令使用 Node，不要求 Python/tsx；离线构建不证明干净环境安装。旧独立 doctor：

```sh
node "$FLEET_INSTALL/bin/afc.mjs" doctor --json
```

Fleet 的 shared/default-dispatch.example.json 是安装模板，不是生成的状态。模型与可选集成可配；见 [导入证据](../IMPORT.md)。

安装准备会在构建后检查 Node shebang，把已有命令入口设为 0755；权限设置失败则拒绝激活。Git 也保存入口的执行位，可直接运行 `./bin/afc.mjs --help`。

数据默认位于 $PASEO_HOME/plugin-data/agent-fleet-cockpit；AFC_DATA_DIR 覆盖 Fleet 数据目录，ROLES_STATE_DIR 只覆盖角色命令状态。旧目录默认 ~/.config/fleet-roles，可用 AFC_LEGACY_DATA_DIR 或迁移 --from 显式指定。可选只读 sidebar 用 AFC_SANDBOX_ROSTER_DIR 指定状态目录，不默认探测个人应用目录。模型选择遵循 host 目录及用户配置的供应商排除，安装不施加个人模型限制。

Fleet 设置页的「AFC 运行通知项目」把可选字符串 `opsProject` 保存到 `afc.config.json`，例如 `{ "opsProject": "demo-operations" }`。这个看板项目登记的 `<leader>` 接收 AFC 提前重置、每日体检和用券通知，以及 daemon 崩溃、Cursor 登录／用量和钥匙串探测告警；新建 `afc decide add`／`afc decide decided` 未指定 `--project` 时，也归属这个项目，显式指定仍优先。缺省或非法值回退 `paseo-fleet`；名称会去除两端空白，不能为空或包含控制字符。非法设置写入会被拒绝，原文件不变；清空字段恢复默认。已有 `decisions.json` 记录保留原 `project`，回复、提醒、推翻仍查原项目登记，不迁移或重新归类历史记录。接收通知前，先在看板登记所选项目的 `<leader>`。

## 旧独立版 leader 上下文提醒与换会话

已安装且在所选本地 daemon 上运行的 Fleet 插件提供这些命令：

```sh
afc leader usage --json
afc leader swap demo --dry-run
afc leader swap demo
afc leader status demo --json
afc leader swap demo --again
afc leader cancel demo
```

usage 是只读报告，不恢复挂起的换会话；unknown 不等于 0。Settings 在 afc.config.json 保存 leaderUsage.reminderTokens 和 leaderUsage.warningTokens，默认 500,000/750,000；warning 必须大于 reminder，严格超过才显示黄/红，非法设置退默认。

swap 需要先获得会话中的确认；等旧会话空闲、交接、新会话接手回复和 Kanban 登记后才归档旧会话。失败保留两个会话；重跑同一 `afc leader swap demo` 继续未完成步骤，完成后再次主动换用 --again。连接中断时先 `afc leader status demo --json`，插件可能仍在执行；--json 把进度发 stderr、最终结果发 stdout。cancel 拒绝运行中的 swap，停止后仅清除跟踪，不动会话或登记。人工回退先在旧会话运行 `kanban supervise --project demo` 并核登记，再归档孤立新会话。--dry-run 只读，不启动或恢复换会话。

命令默认使用 $PASEO_HOME/config.json 的 daemon listener，可用 --host 127.0.0.1:PORT 指本地 TCP；IPv6 用 `--host '[::1]:PORT'`，daemon 地址也须同样括号。受保护 endpoint 可拒绝握手，命令不读登录凭证。Access map 的插件检查使用显式 pluginId，未指定则报 unknown。完整行为见[英文 README](../../README.md#legacy-leader-context-reminders-and-swaps)。

## 隐私闸与贡献者设置

三闸：pre-commit 扫 staged 文件（通用规则和仓外私有 denylist）、核作者/提交者，装有 gitleaks 则运行；pre-push 本机 verify 扫全树/历史、类型、脚本/插件测试、CLI/Paseo 构建、契约、共用闸、包清单；npm files 白名单和 pack 检查。GitHub Actions 可关闭，本机检查是必需记录。

```sh
npm ci
npm run build
npm run hooks
git config user.name "paseo-fleet contributors"
git config user.email "noreply@example.invalid"
mkdir -p ~/.config/paseo-fleet
cp scripts/private-denylist.example.txt ~/.config/paseo-fleet/private-denylist.txt
```

再在仓外清单写自己的私有词；可用 FLEET_PRIVATE_DENYLIST 指其它路径。安装 gitleaks（如 brew install gitleaks，或其它平台安装方式）；不要弱化闸门来过扫描，可改非必要措辞。身份也可用 GitHub noreply 邮箱，不能用私人邮箱。

```sh
npm run verify
npm run build:check
npm run typecheck
npm test
npm run test:plugin
npm run scan
npm run identity
npm run pack:check
npm run contract:check
npm run shared:check
```

旧独立版的 PASEO_FLEET_SIBLING 指伴随 checkout，核 scripts/.githooks/.github/workflows 逐字节一致；不适用于已合并的统一源码。FLEET_CONTRACT_SOURCE 核旧看板副本相同；契约只在源仓改，带 --check 或只设变量不复制。Fleet 另有 npm run compat；本机 verify 提供编译、类型、插件回归。离线绿不证明真桌面、认证、迁移或其它 OS。

[MIT](../../LICENSE)
