# 数据与读取边界

默认 PASEO_HOME=~/.paseo。先看插件启动日志的实际 data directory，不假设新来源自动搬旧数据；Git 更新可改变代码/CLI 路径。只用 examples 演示配置，不能当个人备份。

## Fleet 目录与内容

AFC_DATA_DIR 优先；否则 plugin-data/agent-fleet-cockpit 默认；新目录无 plans.json/decisions.json 而 ~/.config/fleet-roles 或 AFC_LEGACY_DATA_DIR 有时回退旧目录。ROLES_STATE_DIR 覆盖 roles 命令状态，测试和 AFC_DATA_DIR 一起设。源码 server/paths.ts、server/settings.ts。

plans.json 存用户池/adapter/周期时区/手填/阈值优先序；afc.config.json 存语言/显示供应商策略/派活覆盖/可选开关；decisions、用量与矩阵快照、日志、exports、secrets、backups 私有。新 plans 空，不自动导入演示价格/读数，不覆盖旧配置。

| 集成 | 读取/存储与控制 |
|---|---|
| 角色预览 | 公共 provider/模型/mode 目录，输出 JSON；主动调用，不证明登录、不写档案、不读凭证。手动在 Paseo 配档。 |
| Host/派活 | 已配置档案、provider 用量，算池与矩阵；配置池/档案映射，无池无保护。 |
| claude-cli/codex-cli/grok-cli/muse-msp/opencode-go-api | 配置的 Paseo provider 用量窗口/adapter 状态；只配有关池，用 manual 可避开该池自动读数，用户/provider 负责认证。 |
| manual | 用户百分比/时间来源/重置周期；过期未知不是 0，quotaProtection=none 是关护栏，不证明可用额度。 |
| cursor-api（可选） | Fleet 自身可选 token store 的官方用量、CLI 屏幕回退、登录诊断和私有状态；新 config adapters.cursor-api=false，显式 false 也覆盖旧标记，可手填；不复制其它工具凭证。 |
| macOS 钥匙串探针（可选） | 存在性/状态元数据，不取秘密值；新 config adapters.keychain=false，显式 false 关闭，旧未设开关可能按状态标记继续。 |
| Kanban | 契约 board-summary/info，兼容路径也读 board/config/doctor；没装降级隐藏，见 server/paths.ts/契约。 |
| 可选 sidebar | AFC_SANDBOX_ROSTER_DIR 显式选状态目录，不探个人应用目录。 |
| CLI 决定/角色 | 私有决定、映射、项目 pause 状态；显式操作，当前安装命令和选择目录。 |

隐藏池只改显示，不停派活。用 dispatch/protection 配路由，可选开关停 reader；停 Fleet 插件可停全部后台。transport 不报告时不保证额度。

## 备份、迁移、移除与隔离

配置、决定、快照、日志、导出、备份、secrets 全私有。暂停 Fleet 写入后，拷贝所选数据目录的 plans.json、afc.config.json、decisions.json、exports/ 及其它私有状态。只有同时备份 Kanban 数据时才对 kanban.db 做 SQLite 一致快照，不原样复制正在写入的 db/WAL。另备份 $PASEO_HOME/plugin-settings/<id>、语言、enabled。移除保留 plugin-data，但可能删设置与受管 Git checkout；代码降级不撤销数据写入。

用已安装命令 migrate --help 查看接口：`node "$FLEET_INSTALL/bin/afc.mjs" migrate --help` 或 `node "$BOARD_INSTALL/bin/paseo-kanban.mjs" migrate --help`。先用显式演示 source/target 演练，再做已授权切换，迁移日志/备份不能发布。

测试使用独立 Paseo home、loopback listener，从启动前设 AFC_DATA_DIR/KANBAN_DATA_DIR/ROLES_STATE_DIR/PASEO_HOME/PASEO_URL/TMPDIR，不能发现个人 host 或复用真数据；停选定 daemon 再清理。

插件处于本地 daemon 信任边界，文件集成/审计不是独立安全边界。凭证、个人配置不得提交/打包/截图/贴 issue；doctor/log 手动脱敏。见 [SECURITY](SECURITY.md)、[COMPATIBILITY](COMPATIBILITY.md)、[RELEASE](RELEASE.md)。
