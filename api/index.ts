import 'dotenv/config';
import { build } from './src/helpers/app';

async function start() {
  const app = await build();

  // Start server
  app.listen({ 
    port: 3000, 
    host: '0.0.0.0'
  }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

start().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});