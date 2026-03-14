
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hackathon_system');
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@example.com';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log('Admin already exists');
            existingAdmin.role = 'admin';
            existingAdmin.approvalStatus = 'approved';
            await existingAdmin.save();
            console.log('Ensured admin has correct permissions');
        } else {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'adminpassword123',
                role: 'admin',
                approvalStatus: 'approved'
            });
            console.log('Admin created: admin@example.com / adminpassword123');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

createAdmin();
