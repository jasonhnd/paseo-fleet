# 数据与读取边界

默认 PASEO_HOME=~/.paseo。先看插件启动日志的实际 data directory，不假设新来源自动搬旧数据；Git 更新可改变代码/CLI 路径。只用 examples 演示配置，不能当个人备份。

## Fleet 目录与内容

AFC_DATA_DIR 优先；否则 plugin-data/agent-fleet-cockpit 默认；新目录无 plans.json/decisions.json 而 ~/.config/fleet-roles 或 AFC_LEGACY_DATA_DIR 有时回退旧目录。ROLES_STATE_DIR 覆盖 roles 命令状态，测试和 AFC_DATA_DIR 一起设。源码 server/paths.ts、server/settings.ts。

plans.json 存用户池/adapter/周期时区/手填/阈值优先序；afc.config.json 存语言/显示供应商策略/派活覆盖/可选开关；decisions、用量与矩阵快照、日志、exports、secrets、backups 私有。新 plans 空，不自动导入演示价格/读数，不覆盖旧配置。

JSON 快照每次写入都用独占创建的同目录临时文件，名字包含进程号和随机标识，完整写完后再 rename 到目标；不同进程的写者也互不占用临时文件。最后一次成功 rename 生效。这不提供读改写锁、旧格式文件与 export 之间的事务，或落盘持久性保证。写入和 rename 失败会向调用方抛出；只清理本次写入拥有的临时文件，清理失败记日志且不替换原始错误。进程突然终止可能留下临时文件，其他写者不会扫描删除它。

### 计划角色限制

计划可设置 `onlyRoles: ["reviewer"]`，只允许 `role` 或 `candidateFor` 为 `reviewer` 的档案从这个池接新活。其他角色及没有角色的档案保持暂停。列表会传到归一化 usage plan、usage RPC、pool status、`fleet-quota/v1` export 和两份派活矩阵。它独立于 `pacePause`；`pacePause: false` 只解除进度线暂停，`quotaProtection: "none"` 也不会解除角色限制。角色列表不能重开因额度策略或 `dispatch: false` 停用的池。

```json
{
  "id": "demo-review-pool",
  "name": "Demo review pool",
  "adapter": "manual",
  "providers": ["demo-provider"],
  "dispatch": true,
  "pacePause": false,
  "onlyRoles": ["reviewer"]
}
```

此片段只定义角色策略，须另外提供有效额度读数或周期。缺少、`null` 或空列表保持原来不限制角色的语义；未配置的角色名匹配不到档案。列表会持续生效，直到修改或删除：`tempException` 不提供到期时间，`paceDisable` 不是支持的进度线开关。修复前，计划顶层 `onlyRoles` 在 usage 归一化时丢失，仅有下游支持并不能执行限制。

现有带日期的 Claude `reviewerException` 保持独立：`roles`、`stopPct`、`until` 只在有效的预留额度区间生效。显式计划列表与该例外取交集，也作用于同计划子池；没有交集时暂停池。限制不传给无关计划，两种配置均不放宽供应商或账号权限。

| 集成 | 读取/存储与控制 |
|---|---|
| 角色预览 | 公共 provider/模型/mode 目录，输出 JSON；主动调用，不证明登录、不写档案、不读凭证。手动在 Paseo 配档。 |
| Host/派活 | 已配置档案、provider 用量，算池与矩阵；配置池/档案映射，无池无保护。 |
| claude-cli/codex-cli/grok-cli/muse-msp/opencode-go-api | 配置的 Paseo provider 用量窗口/adapter 状态；只配有关池，用 manual 可避开该池自动读数，用户/provider 负责认证。 |
| manual | 用户百分比/时间来源/重置周期；过期未知不是 0，quotaProtection=none 是关护栏，不证明可用额度。 |
| cursor-api（可选） | Fleet 自身可选 token store 的官方用量、CLI 屏幕回退、登录诊断和私有状态；新 config adapters.cursor-api=false，显式 false 也覆盖旧标记，可手填；不复制其它工具凭证。 |
| macOS 钥匙串探针（可选） | 存在性/状态元数据，不取秘密值；新 config adapters.keychain=false，显式 false 关闭，旧未设开关可能按状态标记继续。 |
| antigravity-cli（可选） | 只展示本机 agy /usage 表，不是 Paseo provider 读数，也不是执行通道。 | 默认关。只有 adapters.antigravity-cli 为 true 才读。见下文。 |
| Kanban | 契约 board-summary/info，兼容路径也读 board/config/doctor；没装降级隐藏，见 server/paths.ts/契约。 |
| 可选 sidebar | AFC_SANDBOX_ROSTER_DIR 显式选状态目录，不探个人应用目录。 |
| CLI 决定/角色 | 私有决定、映射、项目 pause 状态；显式操作，当前安装命令和选择目录。 |

隐藏池只改显示，不停派活。用 dispatch/protection 配路由，可选开关停 reader；停 Fleet 插件可停全部后台。transport 不报告时不保证额度。

Provider 额度窗口保留最后一次官方报告状态（`available`、`unavailable`、`error`）。来源可用但未返回窗口，与来源不可用且没有错误内容，是不同情况；两者都不提供百分比，也不能说明失败原因。状态和有限错误类别沿现有额度来源提示展示。报告同时说 available 又提供错误时，这次读数按错误处理。任意错误原文在写入额度采样前归为原文有证据的类别，不能分类时只保留通用失败；已有 CLI 屏幕有限脱敏规则不变。

官方单个 provider 的 `fetchedAt` 保留为该来源时间。旧版批次时间仍标为整批最早采样，缺少或非法的来源时间不会替换为面板或发布时间。失败提示和保护信号只作用于匹配的 provider reader；manual 计划和其他 provider 不继承某一家的错误。整个 RPC 明确报额度、认证或限流时，provider 池即使设置 `quotaProtection: "none"` 仍按已有规则停派；仅 unavailable 状态不会被猜成这些原因。固定一小时采样、62 分钟显示期限和七分钟派活保护期限均不变。

计划关闭派活后，保留配置和适配器目录已选定的主窗口，包括百分比、重置和观察时间。Claude 没有主周窗时，不拿 Session 顶替；模型子窗口也保留自己的身份。显式 primary 和其他适配器原有回退规则继续生效。关闭再打开不能证明官方重置。旧历史不改写，其中可能已混入不同周期，本次修改不能修复或验证那些样本。这些行为已有匿名隔离本地回归；真实面板和最终候选版本仍须另验，也不能据此认定已解决官方间歇取数故障。

## Antigravity CLI 展示

antigravity-cli 可选，默认关闭。没有“已在用”标记，数据目录里的文件不会把它打开，也没有命令时不会去跑 agy。开关为 true 时，在空的临时目录里执行 `agy -p "/usage"`，并有超时。一张 Antigravity 卡按固定顺序显示 Gemini 5 小时、Gemini 每周、Claude 5 小时、Claude 每周。Claude 是 CLI 的 Claude/GPT 共用桶，小字标明仅显示。百分比和倒计时来自一次成功读取，不固定任何数字或日期。进度条表示剩余：0% 为空、100% 为满。缺读数保持未知。

这些行不是 Paseo ACP 派活池。后端 ACP 行保持未知（不作为卡片的第五行），因此不派活，除非 CLI 观察和 ACP 观察的版本、档位、额度来源键相同，且两边都有观察时间。产品名不算这个键。随附的读取只记录 CLI 表，ACP 观察留空，所以安全停派保持有效。手填百分比不能替换这条 ACP 行。开关关闭或未设置时，计划不会改成 manual，也不会启动 agy。其他可选适配器在自己的开关关闭时仍使用手填。超过实时读数时限的 agy 行仍显示，但标成过期样本并保留采样时间。它不是实时读数，也不是 ACP 百分比。quotaProtection 设为 none 会故意关掉这道护栏。

以下计划示例不含真实百分比；安装支持该适配器的版本后，还须在 afc.config.json 中明确设置 adapters.antigravity-cli=true：

```json
{
  "id": "example-antigravity-gemini",
  "name": "Antigravity",
  "adapter": "antigravity-cli",
  "antigravityBucket": "gemini",
  "providers": ["antigravity"],
  "dispatch": false,
  "quotaProtection": "pause"
}
```

不需要第二个显示计划。antigravityBucket 只标识受保护的 ACP 桶，不影响同时展示两个 CLI 桶。显示数据放在插件 RPC 的 antigravityDisplay 中，与派活 windows 分开，不修改 fleet-quota 快照。不要把 providers 写成 claude 或 codex，也不要因此新建 Claude ACP 档案。非零退出、信号终止、超时、登录错误和坏输出不会产生可用新读数，即使 stdout 含合法表行。表里有 5 小时重置就显示它。派活不猜测窗口起点，所以这行较短的窗口本身不会把池判为用尽。

## 备份、迁移、移除与隔离

配置、决定、快照、日志、导出、备份、secrets 全私有。暂停 Fleet 写入后，拷贝所选数据目录的 plans.json、afc.config.json、decisions.json、exports/ 及其它私有状态。只有同时备份 Kanban 数据时才对 kanban.db 做 SQLite 一致快照，不原样复制正在写入的 db/WAL。另备份 $PASEO_HOME/plugin-settings/<id>、语言、enabled。移除保留 plugin-data，但可能删设置与受管 Git checkout；代码降级不撤销数据写入。

用已安装命令 migrate --help 查看接口：`node "$FLEET_INSTALL/bin/afc.mjs" migrate --help` 或 `node "$BOARD_INSTALL/bin/paseo-kanban.mjs" migrate --help`。先用显式演示 source/target 演练，再做已授权切换，迁移日志/备份不能发布。

测试使用独立 Paseo home、loopback listener，从启动前设 AFC_DATA_DIR/KANBAN_DATA_DIR/ROLES_STATE_DIR/PASEO_HOME/PASEO_URL/TMPDIR，不能发现个人 host 或复用真数据；停选定 daemon 再清理。

插件处于本地 daemon 信任边界，文件集成/审计不是独立安全边界。凭证、个人配置不得提交/打包/截图/贴 issue；doctor/log 手动脱敏。见 [SECURITY](SECURITY.md)、[COMPATIBILITY](COMPATIBILITY.md)、[RELEASE](RELEASE.md)。
