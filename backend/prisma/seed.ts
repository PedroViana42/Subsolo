import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nicks = [
  'Fantasma', 'Sombra', 'CodeNinja', 'Infiltrado', 'ZeroOne', 
  'Cibernético', 'Vigilante', 'Observador', 'Silencioso', 'Anon_99',
  'BitWorm', 'GhostInShell', 'NeonFox', 'Cipher', 'DeepCode',
  'NullPointer', 'RootUser', 'KernelPanic', 'ByteMe', 'DataGhost',
  'NetRunner', 'ScriptKiddie', 'ZeroDay', 'Firewall', 'Proxy',
  'PacketSniffer', 'TrojanHorse', 'Backdoor', 'DarkNet', 'DeepWeb',
  'Onion', 'TorNode', 'Crypto', 'Blockchain', 'Hash', 'Salt',
  'Pepper', 'Keylogger', 'Ransomware', 'Spyware', 'Adware',
  'Botnet', 'DDoS', 'Phishing', 'Spoofing', 'Sniffing', 'Cracked',
  'Leaked', 'Bypassed', 'Exploited', 'Patched', 'Debugged',
  'Compiled', 'Executed', 'Encrypted', 'Decrypted', 'Anonymous',
  'Hidden', 'Invisible', 'Stealth', 'Camouflage', 'Mask', 'Veil'
];

async function main() {
  console.log('🌱 [SEED]: Semeando identidades imersivas (v1.6)...');

  for (const name of nicks) {
    await prisma.nickCatalogue.upsert({
      where: { name },
      update: {},
      create: {
        name,
        isActive: true,
      },
    });
  }

  console.log(`✅ [SEED]: ${nicks.length} nicks garantidos no catálogo!`);
}

main()
  .catch((e) => {
    console.error('❌ [SEED ERROR]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
