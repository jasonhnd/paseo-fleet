# 人工发版清单

两插件各自维护版本、tag、CHANGELOG。本清单不授权 push、打 tag、发布、生产更新或对外发消息。本机检查必做，不依赖或为此开启 GitHub Actions。

## 版本规则

首发 0.1.0，experimental。0.x 的 patch 是兼容修复，新增功能或配置/行为破坏升 minor；1.x 按 SemVer：破坏升 major、兼容新增升 minor、修复升 patch。同一插件包版本、发布标题、npm 版本、vX.Y.Z tag 一致。

Unreleased 保留 Added、Changed、Fixed、Security、Notes。Notes 写 host 范围、schema/契约变更、伴随最低与实测版本、升级顺序、迁移与回退限制。契约版本独立：兼容新增维持 v1，破坏须开新 schema；同号不证明两插件兼容。

## 发版前

- 分拣变更，issue 对应自包含简报，共享问题一名主责；按复现验证实际修复。
- npm ci 装依赖；两仓均 npm run build，Fleet build:cli 是别名。
- 两仓 npm run verify，PASEO_FLEET_SIBLING 指伴随仓，FLEET_CONTRACT_SOURCE 指 Fleet；保留命令、完整提交、退出码和摘要。12 闸含真实 Paseo 编译、插件测试、隐私/身份/泄漏/包清单，须本机全过。
- npm pack --dry-run --json 核包清单、版本、CHANGELOG；真实包产物放仓外，解包后验证 Node 独立 CLI。
- 独立审查、leader 验收、工作区干净，记录伴随完整提交/tag。
- 隔离 home/data 用真实产品候选 npm 产物与 Git tag 验证安装、桌面、语言、角色、leader 协议/登记、首卡。测只 Fleet、只 Kanban、合装；只 Fleet 不要求首卡。
- macOS/Linux 分别留证才能称支持，WSL2 单测；验失败恢复、设置恢复、provider 路径、受影响升级/降级。mock 或最小插件不是产品验收。
- 两插件 manifest build 均运行各自的 server/prepare.mjs，见 [Fleet Git 安装](../GIT-INSTALL.md)、[Kanban Git 安装](https://github.com/jasonhnd/paseo-kanban/blob/main/docs/GIT-INSTALL.md)。Fleet Git 准备运行 npm ci --include=dev --ignore-scripts --no-audit --no-fund，再 npm run build。生成的 bin/*.bundle.mjs 和 Fleet server/paseo-client.bundle.mjs 不提交 Git；npm 产物包含预打包 bundle。干净环境验收仍是各插件的发版前提，不能以看板安装结果代替 Fleet 验证；安装后不能依赖开发目录。
- 所有者启用并检查 GitHub Report a vulnerability；不虚构安全邮箱。
- 获得所有者发版权限；首次公开若压历史，先完成再验证最终提交、打不可变正式 tag。

## 发布记录模板

| 字段 | 必填证据 |
|---|---|
| 包/版本/日期 | 本插件 CHANGELOG 标题 |
| 候选/最终提交 | 完整 hash，差异及重新验证 |
| tag 对照 | vX.Y.Z -> 完整提交，git rev-parse vX.Y.Z^{commit} 核对 |
| 伴随 | 实测 tag/完整提交、最低版本和更新顺序 |
| 环境 | daemon/app/Node/npm/OS、provider/model/family |
| 契约 | schema、manifest 哈希、互通证据 |
| 本机验证 | 命令、退出码、测试总数、CLI/Paseo 构建、扫描 |
| 包与审查 | 包文件清单、解包 CLI、审查结论、真实桌面和首卡证据 |
| 恢复 | 一致数据/设置备份、disabled 状态和回退演练 |
| 授权 | 所有者批准和分发渠道 |

占位内容必须填写再发布。在受测、审过、干净的提交上打 tag，不挪动、覆盖、复用；错了升新版本，保留上一 tag/提交可取得。

## Experimental 与稳定

干净环境验收与授权通过后可先 experimental 发布，再长观察；保留标签。称稳定前，新安装代码至少观察 14 天、完成 20 张真实需求卡，覆盖五种工作角色、异家审查、实际实现的普通自检、重启、受支持 patch 更新、演示数据回退，无未解 P0/P1。不要为凑数造任务。七天数据迁移观察不替代代码观察；1.0 需更长期证据与另定。

每件现状只留一条有证据记录：已落地（卡/提交）、坏了、未验证（做了但无独立真测）、待做（已请求）、死路（尝试与原因），变更时移栏。注册表提交须日常使用观察及另行准备确认，不随首 tag/npm 自动触发。定期评估积累，有依据才发，不承诺固定频率或响应时间。

## 更新与恢复

记当前/目标 tag、完整提交、来源、路径、enabled。停派活/写入，做一致数据备份，另存 plugin-settings/语言和 enabled。先 update --check --ref，再 update --ref；核 revision、真实 data-dir 日志、配置/矩阵/命令路径/卡数/桌面/演示卡后恢复。

换来源须备份、remove/install、恢复设置与 enabled，不是普通 update。移除可删设置和受管 checkout，plugin-data 保留；重装可能短暂启用，先隔离演练。失败 update 可能尝试恢复旧版，仍须核对；reload 失败不恢复旧 bundle。显式退已验证 tag 并重验；恢复一致备份前保留新版数据，代码回退不撤销迁移。

本机[运营演练](OPERATIONS-DEMO.md)覆盖 issue 分拣到未发布草稿，不对外发消息、不连活 daemon，也不替代真实首卡验收。
