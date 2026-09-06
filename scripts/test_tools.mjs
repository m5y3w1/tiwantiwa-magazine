import { get_site_status, generate_report, create_draft, publish_article } from './tools.mjs';

console.log('Testing Tiwantiwa Toolset & Permission Matrix...');
console.log(generate_report());

// Test secure write operation
try {
  create_draft({
    slug: 'test-secure-dispatch',
    title: 'Testing Secure Narrow Tools',
    category: 'Technology',
    author: 'AI Administrator',
    description: 'Testing permission levels for write operations.',
    body: '# Secure Dispatch\n\nVerified via narrow single-responsibility tools.'
  });
  console.log('[✓] create_draft executed with WRITE permission.');
  
  publish_article('test-secure-dispatch');
  console.log('[✓] publish_article executed successfully.');
  console.log(get_site_status());
} catch (err) {
  console.error('[X] Permission violation or error:', err.message);
}
