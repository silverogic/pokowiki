# 배포 및 CI/CD 가이드 (Deployment Guide)

## 1. GitHub Pages 배포 (Deploy from a branch → /docs)

이 프로젝트는 `master` 브랜치에 코드가 푸시되면 GitHub Actions(`.github/workflows/deploy-pages.yml`)가 자동으로 Next.js 정적 빌드를 수행하고, 결과물을 `docs/` 폴더에 커밋 & 푸시하도록 구성되어 있습니다.

### GitHub 저장소 설정 방법
1. 저장소 상단의 **Settings** 메뉴로 이동합니다.
2. 좌측 메뉴에서 **Pages**를 클릭합니다.
3. **Build and deployment** 섹션:
   - **Source**: **Deploy from a branch** 선택
   - **Branch**: **master** 선택
   - **Folder**: **/docs** 선택
4. **Save** 버튼을 클릭하여 저장합니다.
5. GitHub Actions 빌드가 완료되어 `docs/` 폴더가 생성되면 **https://silverogic.github.io/pokowiki** 로 사이트가 서비스됩니다.
6. (선택사항) 커스텀 도메인(CNAME)을 사용하는 경우, `NEXT_PUBLIC_BASE_PATH=""`로 설정하여 루트 도메인에서 서빙할 수 있습니다.

---

## 2. 腾讯云 COS 部署说明 (Legacy)

本项目此前配置了自动构建并部署到腾讯云对象存储（COS）的工作流（`.github/workflows/build-deploy.yml`）。

## 工作流程

当代码推送到 `master` 分支时，将自动触发构建和部署流程：

1. **构建阶段**：
   - 检出代码
   - 安装 Node.js v22
   - 安装 pnpm
   - 缓存 pnpm 依赖（基于 `pnpm-lock.yaml`）
   - 安装项目依赖
   - 构建项目（输出到 `build/` 目录）

2. **部署阶段**：
   - 缓存 COSCLI 工具
   - 下载并安装 COSCLI（如果缓存未命中）
   - 配置 COSCLI 连接参数
   - 使用 `coscli sync` 命令同步构建产物到腾讯云 COS

## 配置 GitHub Secrets

为了使工作流正常运行，需要在 GitHub 仓库设置中配置以下 Secrets：

1. 进入仓库的 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret** 添加以下密钥：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `COS_SECRET_ID` | 腾讯云访问密钥 ID | `AKIDxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `COS_SECRET_KEY` | 腾讯云访问密钥 Key | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `COS_REGION` | COS 存储桶所在地域 | `ap-shanghai` / `ap-guangzhou` |
| `COS_BUCKET` | COS 存储桶名称 | `your-bucket-name-1234567890` |

### 获取腾讯云密钥

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入 [访问管理 - API 密钥管理](https://console.cloud.tencent.com/cam/capi)
3. 创建或查看现有的 API 密钥
4. 记录 `SecretId` 和 `SecretKey`

### 获取 COS 存储桶信息

1. 登录 [对象存储控制台](https://console.cloud.tencent.com/cos)
2. 找到目标存储桶
3. 记录存储桶名称和所属地域

## COSCLI 文档

COSCLI 是腾讯云对象存储的命令行工具，详细文档请参考：
- [COSCLI 工具](https://cloud.tencent.com/document/product/436/63144)
- [coscli sync 命令](https://cloud.tencent.com/document/product/436/63669)

当前使用版本：**v1.0.7**

## 工作流文件

工作流配置文件位于：`.github/workflows/build-deploy.yml`

## 注意事项

- 确保腾讯云账号有足够的权限访问和上传文件到 COS 存储桶
- 建议为 CI/CD 创建专门的子账号，并仅授予必要的 COS 权限
- `pnpm-lock.yaml` 文件用于锁定依赖版本，确保构建的一致性
- COSCLI 工具会被缓存以加快后续构建速度
