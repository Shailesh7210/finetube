import assert from 'assert';
import { PassThrough } from 'stream';
import { EventEmitter } from 'events';

interface MockHttpResponse {
  status: number;
  body: any;
}

async function invokeExpress(app: any, method: string, url: string, jsonBody?: any): Promise<MockHttpResponse> {
  return new Promise((resolve, reject) => {
    const req: any = new PassThrough({ autoDestroy: false });
    req.method = method;
    req.url = url;
    req.originalUrl = url;
    req.headers = {
      'content-type': 'application/json',
      host: 'localhost'
    };

    if (jsonBody !== undefined) {
      req._body = true;
      req.body = jsonBody;
    }

    const res: any = new EventEmitter();
    res.statusCode = 200;
    res._headers = {};
    const chunks: Buffer[] = [];

    res.setHeader = (k: string, v: any) => { res._headers[k.toLowerCase()] = v; };
    res.getHeader = (k: string) => res._headers[k.toLowerCase()];
    res.removeHeader = (k: string) => { delete res._headers[k.toLowerCase()]; };
    res.writeHead = (code: number, headers?: Record<string, any>) => {
      res.statusCode = code;
      if (headers) {
        Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
      }
      return res;
    };
    res.status = (code: number) => {
      res.statusCode = code;
      return res;
    };
    res.write = (chunk: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      return true;
    };
    res.end = (chunk?: any) => {
      if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
      const raw = Buffer.concat(chunks).toString('utf8');
      let parsed: any = raw;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        // leave as string
      }
      resolve({ status: res.statusCode, body: parsed });
      return res;
    };
    res.json = (obj: any) => {
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(obj));
    };
    res.send = (body: any) => {
      if (typeof body === 'object' && body !== null && !Buffer.isBuffer(body)) {
        return res.json(body);
      }
      return res.end(body);
    };

    app(req, res, (err: any) => {
      if (err) reject(err);
    });
  });
}

async function runUniversalE2ESmoke() {
  console.log('\n==============================================================');
  console.log('FineTube In-Process Express API End-to-End Universal Test');
  console.log('==============================================================\n');

  process.env.FINETUBE_SKIP_LISTEN = 'true';
  const { app } = await import('../server.js');
  console.log('✅ PASSED [Boot]: Express API application initialized cleanly');

  // 1. Universal Subjects
  const subjRes = await invokeExpress(app, 'GET', '/api/v1/subjects');
  assert.strictEqual(subjRes.status, 200, 'Subjects endpoint returns 200');
  assert.ok(subjRes.body.data.length >= 12, `Expected >= 12 universal subjects, got ${subjRes.body.data.length}`);
  console.log(`✅ PASSED [Taxonomy]: Loaded ${subjRes.body.data.length} universal educational disciplines`);

  // 2. Topics filtered by subject
  const topicRes = await invokeExpress(app, 'GET', '/api/v1/topics');
  assert.strictEqual(topicRes.status, 200);
  const electrostatics = topicRes.body.data.find((t: any) => t.id === 'physics_electrostatics');
  assert.ok(electrostatics, 'Universal taxonomy includes Physics Electrostatics');
  console.log('✅ PASSED [Topics]: Verified Physics Electrostatics in universal topic registry');

  // 3. Dynamic YouTube Discovery
  const discRes = await invokeExpress(app, 'GET', '/api/v1/discover/search?q=Class+12+Physics+Electrostatics&educationLevel=Class+12');
  assert.strictEqual(discRes.status, 200, 'Discovery endpoint returns 200');
  assert.ok(Array.isArray(discRes.body.data) && discRes.body.data.length > 0, 'Discovery returned matching educational videos');
  console.log(`✅ PASSED [Discovery]: Returned ${discRes.body.data.length} dynamic YouTube videos for Class 12 Electrostatics`);

  // 4. Multi-Dimensional Profile Setup
  const profRes = await invokeExpress(app, 'PUT', '/api/v1/auth/profile', {
    educationLevel: 'Class 12',
    stream: 'Science',
    followedSubjectIds: ['physics', 'chemistry', 'mathematics'],
    followedTopicIds: ['physics_electrostatics', 'chem_organic_reactions'],
    customInterests: ['Quantum Mechanics', 'Organic Synthesis'],
    workspaceMode: 'math'
  });
  assert.strictEqual(profRes.status, 200, 'Profile update returns 200');
  assert.strictEqual(profRes.body.data.educationLevel, 'Class 12');
  assert.strictEqual(profRes.body.data.workspaceMode, 'math');
  console.log('✅ PASSED [Profile]: Updated multi-dimensional Class 12 Science profile & math workspace mode');

  // 5. Focused Personalized Feed
  const feedRes = await invokeExpress(app, 'GET', '/api/v1/feed?topics=physics_electrostatics');
  assert.strictEqual(feedRes.status, 200);
  assert.ok(feedRes.body.data.length > 0, 'Focused feed returned Physics videos');
  assert.ok(
    feedRes.body.data.every((item: any) =>
      item.video.primaryTopicId === 'physics_electrostatics' ||
      (item.video.secondaryTopicIds && item.video.secondaryTopicIds.includes('physics_electrostatics'))
    ),
    'Strict focus feed contains only requested discipline videos'
  );
  console.log('✅ PASSED [Feed]: Strict focused feed filtered to Physics Electrostatics without unrelated content');

  // 6. AI Video Classification
  const clsRes = await invokeExpress(app, 'POST', '/api/v1/ai/classify', {
    title: 'Cardiac Cycle & Wiggers Diagram Physiology Lecture',
    description: 'Detailed medical explanation of stroke volume, preload, and Frank-Starling law.',
    tags: ['cardiology', 'medical physiology', 'heart']
  });
  assert.strictEqual(clsRes.status, 200, 'AI classify returns 200');
  assert.strictEqual(clsRes.body.data.mainSubject.id, 'medical_sciences');
  assert.ok(clsRes.body.data.confidenceScore >= 0.75, 'High confidence medical classification');
  console.log(`✅ PASSED [AI Classify]: Classified Medical Physiology video with confidence ${clsRes.body.data.confidenceScore}`);

  // 7. Universal Custom Playlist & Lesson Addition + Hydration Check
  const seedPlRes = await invokeExpress(app, 'GET', '/api/v1/playlists/pl_class12_physics');
  assert.strictEqual(seedPlRes.status, 200, 'Seed Physics playlist returns 200');
  assert.ok(seedPlRes.body.data.items[0].video, 'Seed playlist lesson hydrates valid video object');

  const plCreateRes = await invokeExpress(app, 'POST', '/api/v1/playlists', {
    title: 'Class 12 Physics Board Exam Prep',
    description: 'Electrostatics and field theory crash course',
    topicId: 'physics_electrostatics',
    videoIds: ['vid_physics_electrostatics_cbse']
  });
  assert.strictEqual(plCreateRes.status, 201, 'Create playlist returns 201');
  const createdPlId = plCreateRes.body.data.id;

  const addLessonRes = await invokeExpress(app, 'POST', `/api/v1/playlists/${createdPlId}/items`, {
    videoId: 'vid_math_calculus_essence',
    purpose: 'Supplementary integration techniques for Gauss Law'
  });
  assert.strictEqual(addLessonRes.status, 201, 'Add video to playlist returns 201');
  assert.strictEqual(addLessonRes.body.data.items.length, 2, 'Playlist now contains 2 sequenced lessons');
  console.log('✅ PASSED [Playlists]: Verified seed playlist hydration, created universal Physics playlist, and appended Calculus lesson');

  // 8. Inaccuracy Reporting
  const repRes = await invokeExpress(app, 'POST', '/api/v1/reports', {
    targetType: 'video',
    targetId: 'vid_physics_electrostatics_cbse',
    reason: 'wrong_level',
    details: 'Includes university-level vector calculus divergence theorem'
  });
  assert.strictEqual(repRes.status, 201, 'Submit report returns 201');
  console.log('✅ PASSED [Moderation]: Logged educational categorization report');

  console.log('\n==============================================================');
  console.log('In-Process End-to-End Universal Platform Test Passed 8/8!');
  console.log('==============================================================\n');
}

runUniversalE2ESmoke().catch(err => {
  console.error('❌ E2E Smoke Test Failed:', err);
  process.exit(1);
});
