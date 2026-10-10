# paseo-fleet

本地编码 agent 的阵容、额度节奏和待决定收件箱，用于 [Paseo](https://github.com/getpaseo/paseo)。[English](../../README.md)

包 `@jasonhnd/paseo-fleet-cockpit`；插件 id `agent-fleet-cockpit`。

> Experimental、未发布。已有源码和独立命令；干净环境安装、桌面挂载、首卡验证仍是发布闸。不承诺稳定或响应时间。

## 选择组合

| 安装 | 能力 |
|---|---|
| Fleet + Kanban | 阵容、额度节奏、决定、角色任务与审查流。 |
| 只 Kanban | 看板、自配角色、基础顺序、本地决定；无 Fleet 额度保护。 |
| 只 Fleet | 阵容、额度、决定；无派卡。 |

伴随仓库：[Fleet](https://github.com/jasonhnd/paseo-fleet)、[Kanban](https://github.com/jasonhnd/paseo-kanban)。以 [fleet-quota/v1](../CONTRACT.md) 文件集成，包版本独立。

## Requirements

- daemon 与桌面 app 均 >=0.11.0 <0.12.0，全局及单插件开关启用。
- 两插件合用 Node >=22.13.0；看板声明 >=22.5 且 node:sqlite 可用，Fleet >=22.13.0。版本下限不认证所有组合。
- Git 用于代码卡/workspace；npm 用于源码构建、两个插件的 Git preparation，须在 daemon PATH。
- 通读至少一已安装/登录的本地 provider；当前自动执行/审查卡流要两个已确认模型家族。
- macOS/Linux 是首发目标，须分别真测；首发不支持原生 Windows，WSL2 单测。见 [兼容证据](COMPATIBILITY.md)。

## 五分钟上手：安装到第一张卡完成

五分钟是 Paseo 与本地 provider 已准备好时的配置引导；下载、登录、首次加载与执行可能更久。此 experimental 路径仍待干净环境验收；角色目前只预览/手配，同家自动自检未提供。

1. 运行 paseo --version、node --version，同时查 app 版本。满足要求，自行在 provider 登录。
2. 首次发布后安装所需插件：

   ```sh
   paseo plugin install npm:@jasonhnd/paseo-fleet-cockpit
   paseo plugin install npm:@jasonhnd/paseo-kanban
   paseo plugin ls
   ```

   Host Settings -> Plugins 启用全局和单插件，核状态并真实打开面板。发布前源码试用按下方构建说明，不假设 npm 包或 tag 已存在。
3. Fleet Settings 选英文/简体中文，用可用目录预览角色；确认家族后手动在 Paseo 建档，保留旧项。按预览配置 role/family、模型选项，含 role=supervisor 的 leader、异家执行和审查。预览不保存、不证明登录。只看板则手配这些字段。只有一家先人工评估，补齐独立审查前不称自动审查流完成。可跳过额度但无保护，之后只加自己的池。
4. 新建名为 demo 的演示 Git workspace 并有初始提交。Kanban 设置配项目 workspace、简称、保护分支；项目 leader 面板选档案/workspace/语言，预览后启动、核协议。普通会话选同名档案不够。
5. 新 leader 会话调用 kanban_supervise（项目 demo），或运行：

   ```sh
   node "$BOARD_INSTALL/bin/paseo-kanban.mjs" supervise --project demo
   ```

   BOARD_INSTALL 是 plugin ls --json 的当前安装目录；会话用自身注入身份，不粘贴 token。面板确认登记；原 leader 仍活着要交接。
6. 让 leader 建 L1 卡：“在 demo 仓加入 hello.md，内容严格为 Hello 加换行；验证、提交、本机审查验收，不 push、不发布。”执行提交后 complete，异家审查核对，leader 核证据 accept。确认卡完成、内容正确、工作区干净、管理的清理完成。
7. 出错读 [排错](COMPATIBILITY.md)、插件日志、独立 Node doctor。协议/登记缺失不能派卡。只 Fleet 可测阵容/额度/决定，首卡需要 Kanban。

有已发布且验证过的 tag 后才用 `paseo plugin install github:jasonhnd/paseo-fleet --ref vX.Y.Z`；每次 update 也指定 --ref。目录来源先源码构建，再 `paseo plugin install "$PLUGIN_CHECKOUT"`，不用 tag 选择器。换已有来源前读 [RELEASE](RELEASE.md)。

## 文档与命令

[工作流](WORKFLOW.md) · [数据](DATA.md) · [兼容](COMPATIBILITY.md) · [发布/更新](RELEASE.md) · [贡献](CONTRIBUTING.md) · [安全](SECURITY.md) · [变更](CHANGELOG.md)

两仓源码先 `npm run build`（Fleet 的 build:cli 是别名）。两插件的 manifest build 均运行各自的 server/prepare.mjs；Fleet Git 准备先 npm ci --include=dev --ignore-scripts --no-audit --no-fund，再 npm run build。生成的 bin/*.bundle.mjs 和 Fleet server/paseo-client.bundle.mjs 不提交 Git，npm 产物含预打包 bundle。见 [Fleet Git 安装与切换](../GIT-INSTALL.md)、[Kanban Git 安装](https://github.com/jasonhnd/paseo-kanban/blob/main/docs/GIT-INSTALL.md)。已打包命令使用 Node，不要求 Python/tsx；干净环境验收仍是发版前提，不能以看板安装结果代替 Fleet 验证。独立 doctor：

```sh
node "$FLEET_INSTALL/bin/afc.mjs" doctor --json
node "$BOARD_INSTALL/bin/paseo-kanban.mjs" doctor
```

Fleet 的 shared/default-dispatch.example.json 是安装模板，不是生成的状态。模型与可选集成可配；见 [导入证据](../IMPORT.md)。

数据默认位于 $PASEO_HOME/plugin-data/agent-fleet-cockpit；AFC_DATA_DIR 覆盖 Fleet 数据目录，ROLES_STATE_DIR 只覆盖角色命令状态。旧目录默认 ~/.config/fleet-roles，可用 AFC_LEGACY_DATA_DIR 或迁移 --from 显式指定。可选只读 sidebar 用 AFC_SANDBOX_ROSTER_DIR 指定状态目录，不默认探测个人应用目录。模型选择遵循 host 目录及用户配置的供应商排除，安装不施加个人模型限制。

## Leader 上下文提醒与换会话

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

命令默认使用 $PASEO_HOME/config.json 的 daemon listener，可用 --host 127.0.0.1:PORT 指本地 TCP；IPv6 用 `--host '[::1]:PORT'`，daemon 地址也须同样括号。受保护 endpoint 可拒绝握手，命令不读登录凭证。Access map 的插件检查使用显式 pluginId，未指定则报 unknown。完整行为见[英文 README](../../README.md#leader-context-reminders-and-swaps)。

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

PASEO_FLEET_SIBLING 指伴随 checkout，核 scripts/.githooks/.github/workflows 逐字节一致。FLEET_CONTRACT_SOURCE 指 Fleet，核看板副本相同；契约只在源仓改，带 --check 或只设变量不复制。Fleet 另有 npm run compat；看板当前未定义该 script，本机 verify 提供编译、类型、插件回归。离线绿不证明真桌面、认证、迁移或其它 OS。

[MIT](../../LICENSE)
