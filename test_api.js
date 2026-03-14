
const BASE_URL = 'http://localhost:5000/api';

async function test_api() {
    console.log('--- Starting API Testing ---');
    
    let adminToken, participantToken, juryToken;
    let participantId, juryId, projectId, teamId, assignmentId;

    try {
        // 1. Login as Admin
        console.log('\n[1] Logging in as Admin...');
        const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'adminpassword123' })
        });
        const adminLoginData = await adminLoginRes.json();
        if (adminLoginRes.status === 200) {
            adminToken = adminLoginData.token;
            console.log('✅ Admin logged in');
        } else {
            console.error('❌ Admin login failed:', adminLoginData);
            return;
        }

        // 2. Register Participant
        console.log('\n[2] Registering Participant...');
        const pRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Participant',
                email: 'participant@example.com',
                password: 'password123',
                role: 'participant',
                college: 'Test College',
                phone: '1234567890'
            })
        });
        const pRegData = await pRegRes.json();
        console.log('Participant registration response:', pRegData.message);

        // 3. Register Jury
        console.log('\n[3] Registering Jury...');
        const jRegRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Jury',
                email: 'jury@example.com',
                password: 'password123',
                role: 'jury',
                expertiseArea: 'AI'
            })
        });
        const jRegData = await jRegRes.json();
        console.log('Jury registration response:', jRegData.message);

        // 4. Admin Get Pending Users
        console.log('\n[4] Admin fetching participants and jury...');
        const getPRes = await fetch(`${BASE_URL}/users/participants`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const participants = await getPRes.json();
        const testP = participants.find(u => u.email === 'participant@example.com');
        if (testP) {
            participantId = testP._id;
            console.log('✅ Found test participant:', participantId);
        }

        const getJRes = await fetch(`${BASE_URL}/users/jury`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const juries = await getJRes.json();
        const testJ = juries.find(u => u.email === 'jury@example.com');
        if (testJ) {
            juryId = testJ._id;
            console.log('✅ Found test jury:', juryId);
        }

        // 5. Admin Approve Users
        if (participantId) {
            console.log('\n[5a] Admin approving participant...');
            const appPRes = await fetch(`${BASE_URL}/users/${participantId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ approvalStatus: 'approved' })
            });
            if (appPRes.status === 200) console.log('✅ Participant approved');
        }

        if (juryId) {
            console.log('\n[5b] Admin approving jury...');
            const appJRes = await fetch(`${BASE_URL}/users/${juryId}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ approvalStatus: 'approved' })
            });
            if (appJRes.status === 200) console.log('✅ Jury approved');
        }

        // 6. Participant Login
        console.log('\n[6] Logging in as Participant...');
        const pLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'participant@example.com', password: 'password123' })
        });
        const pLoginData = await pLoginRes.json();
        if (pLoginRes.status === 200) {
            participantToken = pLoginData.token;
            console.log('✅ Participant logged in');
        } else {
            console.error('❌ Participant login failed:', pLoginData);
        }

        // 7. Participant Create Team
        console.log('\n[7] Participant creating team...');
        const teamRes = await fetch(`${BASE_URL}/teams`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${participantToken}`
            },
            body: JSON.stringify({
                teamName: 'Team Awesome',
                projectTitle: 'Cool AI Project',
                category: 'AI/ML'
            })
        });
        const teamData = await teamRes.json();
        if (teamRes.status === 201 || teamRes.status === 200) {
            teamId = teamData._id;
            console.log('✅ Team created/updated:', teamId);
        }

        // 8. Participant Submit Project
        console.log('\n[8] Participant submitting project...');
        const projRes = await fetch(`${BASE_URL}/projects`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${participantToken}`
            },
            body: JSON.stringify({
                description: 'A very cool AI project description',
                techStack: 'Python, TensorFlow',
                githubLink: 'https://github.com/test/repo',
                demoVideo: 'https://youtube.com/watch?v=123'
            })
        });
        const projData = await projRes.json();
        if (projRes.status === 201 || projRes.status === 200) {
            projectId = projData._id;
            console.log('✅ Project submitted/updated:', projectId);
        }

        // 9. Jury Login
        console.log('\n[9] Logging in as Jury...');
        const jLoginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'jury@example.com', password: 'password123' })
        });
        const jLoginData = await jLoginRes.json();
        if (jLoginRes.status === 200) {
            juryToken = jLoginData.token;
            console.log('✅ Jury logged in');
        } else {
            console.error('❌ Jury login failed:', jLoginData);
        }

        // 10. Admin Assign Project to Jury
        if (projectId && juryId) {
            console.log('\n[10] Admin assigning project to jury...');
            const assignRes = await fetch(`${BASE_URL}/assignments`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ projectId, juryId })
            });
            const assignData = await assignRes.json();
            if (assignRes.status === 201) {
                assignmentId = assignData._id;
                console.log('✅ Project assigned to jury');
            } else {
                console.log('Assignment response:', assignData.message);
            }
        }

        // 11. Jury Submit Evaluation
        if (projectId && juryToken) {
            console.log('\n[11] Jury submitting evaluation...');
            const evalRes = await fetch(`${BASE_URL}/evaluations`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${juryToken}`
                },
                body: JSON.stringify({
                    projectId,
                    innovation: 9,
                    technical: 8,
                    uiux: 7,
                    presentation: 8,
                    impact: 9,
                    feedback: 'Great job!'
                })
            });
            if (evalRes.status === 201 || evalRes.status === 200) {
                console.log('✅ Evaluation submitted');
            } else {
                const evalData = await evalRes.json();
                console.error('❌ Evaluation failed:', evalData);
            }
        }

        // 12. Public Leaderboard
        console.log('\n[12] Public fetching leaderboard...');
        const lbRes = await fetch(`${BASE_URL}/results/leaderboard`);
        const lbData = await lbRes.json();
        console.log('Leaderboard data received. Count:', lbData.length);
        if (lbData.length > 0) {
            console.log('Top Project:', lbData[0].projectTitle, 'Avg Score:', lbData[0].avgScore);
        }

        console.log('\n--- API Testing Completed Successfully ---');

    } catch (err) {
        console.error('\n❌ Unexpected Error during testing:', err);
    }
}

test_api();
