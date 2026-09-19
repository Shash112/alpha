const http = require('http');

function post(path, body, headers = {}) {
  return new Promise((resolve) => {
    const reqData = JSON.stringify(body);
    const req = http.request(
      { hostname: 'localhost', port: 4000, path, method: 'POST', headers: { 'Content-Type': 'application/json', ...headers } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }
    );
    req.write(reqData);
    req.end();
  });
}

function put(path, body, headers = {}) {
  return new Promise((resolve) => {
    const reqData = JSON.stringify(body);
    const req = http.request(
      { hostname: 'localhost', port: 4000, path, method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }
    );
    req.write(reqData);
    req.end();
  });
}

function get(path, headers = {}) {
  return new Promise((resolve) => {
    http.get({ hostname: 'localhost', port: 4000, path, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
  });
}

async function main() {
  const loginRes = await post('/api/v1/auth/login', { email: 'shashank@alpha.com', password: 'Password123!' });
  console.log('Login Body:', loginRes.body);
  const token = loginRes.body.accessToken || loginRes.body.tokens?.accessToken;
  const wsId = loginRes.body.defaultWorkspaceId || loginRes.body.workspace?.id;
  console.log('LoggedIn workspace:', wsId);

  const cardsRes = await get('/api/v1/workspaces/' + wsId + '/cards', {
    Authorization: 'Bearer ' + token,
    'X-Workspace-Id': wsId
  });

  console.log('Found cards:', cardsRes.body.data.length);
  const targetCard = cardsRes.body.data[0];

  const updateRes = await put(
    '/api/v1/workspaces/' + wsId + '/cards/' + targetCard.id,
    {
      title: 'Shashank Shekhar',
      vanitySlug: 'shashank-profile',
      themeColor: '#2563EB',
      themeName: 'Executive',
      status: 'PUBLISHED',
      sections: {
        designation: 'Founder & Chief Architect',
        company: 'Alpha SaaS Solutions',
        bio: 'Building world-class multi-tenant digital identities',
        email: 'shashank@alpha.com',
        phone: '+919876543210',
        website: 'https://alpha.com',
        social_linkedin: 'https://linkedin.com/in/shashank',
        social_twitter: 'https://x.com/shashank',
        social_instagram: 'https://instagram.com/shashank',
        social_github: 'https://github.com/shashank'
      }
    },
    { Authorization: 'Bearer ' + token, 'X-Workspace-Id': wsId }
  );

  console.log('Update Status:', updateRes.status, updateRes.body);

  const fetchUpdated = await get('/api/v1/workspaces/' + wsId + '/cards', {
    Authorization: 'Bearer ' + token,
    'X-Workspace-Id': wsId
  });

  console.log('Updated Card Object from DB:', fetchUpdated.body.data[0]);
}

main().catch(console.error);
