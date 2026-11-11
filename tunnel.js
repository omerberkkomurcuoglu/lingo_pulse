const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const cloudflaredPath = path.join(__dirname, 'cloudflared.exe');
const authTsPath = path.join(__dirname, 'src', 'services', 'auth.ts');

console.log('======================================================');
console.log('🌍 LINGO PULSE - CLOUDFLARE İNTERNET TÜNELİ');
console.log('======================================================');

if (!fs.existsSync(cloudflaredPath)) {
  console.log('❌ cloudflared.exe bulunamadı!');
  process.exit(1);
}

console.log(`🔌 Backend (Port ${PORT}) dünya geneline açılıyor...`);

const child = spawn(cloudflaredPath, ['tunnel', '--url', `http://localhost:${PORT}`], {
  stdio: ['ignore', 'pipe', 'pipe']
});

let tunnelUrlFound = false;

function scanOutput(data) {
  const str = data.toString();
  const match = str.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
  if (match && !tunnelUrlFound) {
    tunnelUrlFound = true;
    const url = match[0];
    console.log('\n======================================================');
    console.log('🎉 BACKEND DÜNYA GENELİNE AÇILDI!');
    console.log(`🌍 Adresiniz: ${url}`);
    console.log('======================================================\n');

    // auth.ts içindeki CLOUDFLARE_TUNNEL_URL sabitini otomatik güncelle!
    try {
      if (fs.existsSync(authTsPath)) {
        let content = fs.readFileSync(authTsPath, 'utf8');
        content = content.replace(
          /export const CLOUDFLARE_TUNNEL_URL = '[^']*';/,
          `export const CLOUDFLARE_TUNNEL_URL = '${url}';`
        );
        fs.writeFileSync(authTsPath, content, 'utf8');
        console.log('✅ Mobil uygulama bağlantı adresi otomatik olarak güncellendi!\n');
      }
    } catch (e) {
      console.warn('Otomatik güncelleme uyarısı:', e.message);
    }
  }
}

child.stdout.on('data', scanOutput);
child.stderr.on('data', scanOutput);

child.on('close', (code) => {
  console.log(`Tünel kapandı (kod: ${code})`);
});
