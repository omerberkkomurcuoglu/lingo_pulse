const fs = require('fs');
const path = require('path');

const expoCliDir = path.join(__dirname, 'node_modules', 'expo', 'node_modules', '@expo', 'cli', 'build', 'src', 'start', 'server');

// 1. Patch ExpoGoManifestHandlerMiddleware.js
const expGoFile = path.join(expoCliDir, 'middleware', 'ExpoGoManifestHandlerMiddleware.js');
if (fs.existsSync(expGoFile)) {
  let content = fs.readFileSync(expGoFile, 'utf8');
  const target = "protocol: req.headers['x-forwarded-proto']";
  const replacement = "protocol: req.headers['x-forwarded-proto'] ? (Array.isArray(req.headers['x-forwarded-proto']) ? req.headers['x-forwarded-proto'][0] : req.headers['x-forwarded-proto'].split(',')[0]).trim() : undefined";
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(expGoFile, content, 'utf8');
    console.log('✅ Patched ExpoGoManifestHandlerMiddleware.js');
  } else {
    console.log('ℹ️ ExpoGoManifestHandlerMiddleware.js already patched or target not found');
  }
}

// 2. Patch UrlCreator.js joinUrlComponents
const urlCreatorFile = path.join(expoCliDir, 'UrlCreator.js');
if (fs.existsSync(urlCreatorFile)) {
  let content = fs.readFileSync(urlCreatorFile, 'utf8');
  const target = "const validProtocol = protocol ? `${protocol}://` : '';";
  const replacement = "const cleanProto = protocol ? (Array.isArray(protocol) ? protocol[0] : protocol.split(',')[0]).trim() : '';\n    const validProtocol = cleanProto ? `${cleanProto}://` : '';";
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(urlCreatorFile, content, 'utf8');
    console.log('✅ Patched UrlCreator.js');
  } else {
    console.log('ℹ️ UrlCreator.js already patched or target not found');
  }
}

// 3. Patch ManifestMiddleware.js _getBundleUrl & clean debug
const manifestMidFile = path.join(expoCliDir, 'middleware', 'ManifestMiddleware.js');
if (fs.existsSync(manifestMidFile)) {
  let content = fs.readFileSync(manifestMidFile, 'utf8');
  const target = "scheme: protocol ?? 'http',";
  const replacement = "scheme: (protocol ? (Array.isArray(protocol) ? protocol[0] : protocol.split(',')[0]).trim() : '') || 'http',";
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    console.log('✅ Patched ManifestMiddleware.js scheme');
  }
  if (content.includes("console.log('DEBUG_BUNDLE_URL:'")) {
    content = content.replace(/console\.log\('DEBUG_BUNDLE_URL:[^;]+;\s*/, '');
    console.log('✅ Cleaned debug log in ManifestMiddleware.js');
  }
  fs.writeFileSync(manifestMidFile, content, 'utf8');
}
