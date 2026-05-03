/**
 * Obfusi-Bob Standalone API Server
 * Enhanced version with real IR parsing and obfuscation
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { parseIR } from './utils/ir-parser.js';
import { obfuscateIR } from './utils/obfuscator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'obfusibob-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// In-memory storage (for demo purposes)
const users = new Map();
const sessions = new Map();
const analyses = [];
const operations = [];

// Initialize demo user
const demoPasswordHash = await bcrypt.hash('demo123', 10);
users.set('demo', {
    username: 'demo',
    email: 'demo@obfusibob.com',
    password: demoPasswordHash,
    createdAt: new Date().toISOString()
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mode: 'standalone'
    });
});

// Auth - Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: rememberMe ? '30d' : '24h' }
        );

        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
        sessions.set(sessionId, {
            username: user.username,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString()
        });

        res.json({
            token,
            sessionId,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Auth - Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        if (users.has(username)) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        users.set(username, {
            username,
            email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Analyze IR code
app.post('/api/analyze', authenticateToken, (req, res) => {
    try {
        const { irContent } = req.body;

        if (!irContent) {
            return res.status(400).json({ error: 'IR content required' });
        }

        // Real IR parsing and analysis
        const parsedData = parseIR(irContent);
        
        const analysis = {
            id: `analysis_${Date.now()}`,
            fileName: 'uploaded.ll',
            timestamp: new Date().toISOString(),
            metadata: parsedData.metadata,
            functions: parsedData.functions,
            globalVariables: parsedData.globalVariables,
            summary: parsedData.summary,
            totalInstructions: parsedData.summary.totalInstructions,
            complexity: parsedData.summary.totalComplexity
        };

        analyses.push(analysis);
        res.json(analysis);
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({
            error: 'Analysis failed',
            details: error.message,
            hint: 'Please ensure the IR code is valid LLVM IR format'
        });
    }
});

// Execute obfuscation
app.post('/api/obfuscate', authenticateToken, (req, res) => {
    try {
        const { irContent, passes } = req.body;

        if (!irContent || !passes) {
            return res.status(400).json({ error: 'IR content and passes required' });
        }

        const startTime = Date.now();
        
        // Parse original code for complexity
        const originalAnalysis = parseIR(irContent);
        const complexityBefore = originalAnalysis.summary.totalComplexity;
        
        // Apply obfuscation techniques
        const obfuscationResult = obfuscateIR(irContent, passes);
        
        // Parse obfuscated code for new complexity
        const obfuscatedAnalysis = parseIR(obfuscationResult.obfuscatedCode);
        const complexityAfter = obfuscatedAnalysis.summary.totalComplexity;
        
        const executionTime = Date.now() - startTime;

        const operation = {
            id: `op_${Date.now()}`,
            fileName: 'uploaded.ll',
            passName: passes.join(', '),
            status: 'success',
            timestamp: new Date().toISOString(),
            executionTime,
            complexityBefore,
            complexityAfter,
            appliedTechniques: obfuscationResult.appliedTechniques,
            transformations: obfuscationResult.transformations
        };

        operations.push(operation);
        res.json({
            success: true,
            operation,
            obfuscatedCode: obfuscationResult.obfuscatedCode,
            stats: {
                linesAdded: obfuscationResult.transformations.linesAdded,
                expansionRatio: obfuscationResult.transformations.expansionRatio,
                complexityIncrease: Math.round(((complexityAfter - complexityBefore) / complexityBefore) * 100)
            }
        });
    } catch (error) {
        console.error('Obfuscation error:', error);
        res.status(500).json({
            error: 'Obfuscation failed',
            details: error.message,
            hint: 'Please ensure the IR code is valid and try with different techniques'
        });
    }
});

// Get AI recommendations
app.post('/api/recommendations', authenticateToken, (req, res) => {
    try {
        const { analysis } = req.body;

        const recommendations = {
            recommendations: [
                {
                    technique: 'Control Flow Flattening',
                    confidence: 0.92,
                    effectiveness: 0.85,
                    reasoning: 'Your code contains conditional branches. Control flow flattening will significantly increase reverse engineering difficulty.',
                    overhead: '15-25%',
                    complexity: 'high'
                },
                {
                    technique: 'Bogus Control Flow',
                    confidence: 0.88,
                    effectiveness: 0.75,
                    reasoning: 'Inserting bogus control flow paths will create confusion for static analysis tools.',
                    overhead: '10-20%',
                    complexity: 'medium'
                },
                {
                    technique: 'String Encryption',
                    confidence: 0.85,
                    effectiveness: 0.80,
                    reasoning: 'Encrypting string literals prevents easy extraction of sensitive information.',
                    overhead: '5-15%',
                    complexity: 'low'
                }
            ],
            analysis: {
                codeComplexity: analysis?.complexity || 12,
                securityRisk: 'medium',
                suggestedPass: 'flatten'
            },
            metadata: {
                model: 'standalone',
                timestamp: new Date().toISOString(),
                source: 'mock'
            }
        };

        res.json(recommendations);
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ error: 'Failed to generate recommendations' });
    }
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    try {
        const user = users.get(req.user.username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            stats: {
                totalAnalyses: analyses.length,
                totalOperations: operations.length,
                successRate: operations.length > 0 
                    ? Math.round((operations.filter(op => op.status === 'success').length / operations.length) * 100)
                    : 0
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Get dashboard stats
app.get('/api/stats', authenticateToken, (req, res) => {
    try {
        res.json({
            totalAnalyses: analyses.length,
            totalOperations: operations.length,
            successRate: operations.length > 0 
                ? Math.round((operations.filter(op => op.status === 'success').length / operations.length) * 100)
                : 0,
            avgComplexityIncrease: operations.length > 0
                ? Math.round(operations.reduce((sum, op) => sum + ((op.complexityAfter - op.complexityBefore) / op.complexityBefore * 100), 0) / operations.length)
                : 0,
            recentAnalyses: analyses.slice(-5),
            recentOperations: operations.slice(-5)
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(join(__dirname, 'dashboard.html'));
});

app.get('/onboarding', (req, res) => {
    res.sendFile(join(__dirname, 'onboarding.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛡️  Obfusi-Bob API Server (Standalone Mode)           ║
║                                                           ║
║   Status: ✅ Running                                     ║
║   Port: ${PORT}                                              ║
║   Mode: Standalone (No Database Required)                ║
║                                                           ║
║   📍 Endpoints:                                          ║
║   • Dashboard: http://localhost:${PORT}/dashboard           ║
║   • Login: http://localhost:${PORT}/                        ║
║   • API: http://localhost:${PORT}/api                       ║
║   • Health: http://localhost:${PORT}/health                 ║
║                                                           ║
║   👤 Demo Credentials:                                   ║
║   • Username: demo                                        ║
║   • Password: demo123                                     ║
║                                                           ║
║   🚀 Ready for IBM Bob Dev Day Hackathon 2026!          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

// Made with Bob
