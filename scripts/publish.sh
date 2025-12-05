#!/usr/bin/env bash

set -e  # 一旦失败就退出

# -------------------------------------
# 参数检查
# -------------------------------------
if [ -z "$1" ]; then
  echo "Usage: ./scripts/publish.sh [patch|minor|major|x.y.z]"
  exit 1
fi

VERSION_TYPE=$1

# -------------------------------------
# 显示当前版本
# -------------------------------------
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: ${CURRENT_VERSION}"

# -------------------------------------
# 决定新的版本号
# -------------------------------------
if [[ "$VERSION_TYPE" == "patch" || "$VERSION_TYPE" == "minor" || "$VERSION_TYPE" == "major" ]]; then
  npm version $VERSION_TYPE -m "release: bump to %s"
  NEW_VERSION=$(node -p "require('./package.json').version")
else
  # 指定明确版本号
  npm version $VERSION_TYPE --no-git-tag-version
  NEW_VERSION=$VERSION_TYPE
  git add package.json package-lock.json 2>/dev/null || true
  git commit -m "release: set version to ${NEW_VERSION}"
  git tag "v${NEW_VERSION}"
fi

echo "New version: ${NEW_VERSION}"

# -------------------------------------
# 安装依赖与测试
# -------------------------------------
echo "Installing dependencies..."
npm install

echo "Running tests..."
npm test

# -------------------------------------
# 构建包
# -------------------------------------
echo "Building the package..."
npm run build

# -------------------------------------
# 打包预览
# -------------------------------------
echo "Creating npm package preview..."
npm pack

# -------------------------------------
# 发布 npm
# -------------------------------------
echo "Ready to publish version ${NEW_VERSION}."
read -p "Confirm publish to npm? (y/n): " CONFIRM

if [[ "$CONFIRM" != "y" ]]; then
  echo "Canceled."
  exit 0
fi

npm publish --access public

echo "🎉 Successfully published v${NEW_VERSION} to npm!"

# -------------------------------------
# 推送到 GitHub（tag + commit）
# -------------------------------------
echo "Pushing commit & tags to GitHub..."
git push
git push --tags

echo "🚀 All done!"
