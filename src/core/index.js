export const config = {
  appName: 'PhotoChronicle',
  version: '0.1.0',
  environment: (typeof process !== 'undefined' && process.env?.NODE_ENV) || 'development',
};

export function bootstrap() {
  console.log(`${config.appName} v${config.version} starting...`);
  console.log(`Environment: ${config.environment}`);
}
