/**
 * Comprehensive System Test Suite
 * Tests all components of Obfusi-Bob
 */

import fs from 'fs';
import path from 'path';
import { parseIR } from './utils/ir-parser.js';
import { obfuscateIR } from './utils/obfuscator.js';

const testFiles = [
    'test-samples/simple.ll',
    'test-samples/loops.ll',
    'test-samples/conditionals.ll',
    'test-samples/strings.ll',
    'test-samples/complex.ll'
];

const techniques = ['flatten', 'bogus', 'encrypt-strings', 'opaque-predicates', 'instruction-substitution'];

console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   🧪 Obfusi-Bob System Test Suite                        ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, testFn) {
    totalTests++;
    try {
        testFn();
        console.log(`✅ ${name}`);
        passedTests++;
        return true;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}\n`);
        failedTests++;
        return false;
    }
}

console.log('📋 Test 1: IR Parser Tests\n');
console.log('─'.repeat(60));

for (const testFile of testFiles) {
    const fileName = path.basename(testFile);
    
    runTest(`Parse ${fileName}`, () => {
        if (!fs.existsSync(testFile)) {
            throw new Error(`File not found: ${testFile}`);
        }
        
        const content = fs.readFileSync(testFile, 'utf-8');
        const result = parseIR(content);
        
        if (!result.summary) {
            throw new Error('Missing summary in parse result');
        }
        
        if (!result.functions || !Array.isArray(result.functions)) {
            throw new Error('Missing or invalid functions array');
        }
        
        console.log(`   Functions: ${result.summary.totalFunctions}, Instructions: ${result.summary.totalInstructions}, Complexity: ${result.summary.totalComplexity}`);
    });
}

console.log('\n📋 Test 2: Obfuscation Tests\n');
console.log('─'.repeat(60));

for (const testFile of testFiles) {
    const fileName = path.basename(testFile);
    const content = fs.readFileSync(testFile, 'utf-8');
    
    for (const technique of techniques) {
        runTest(`Obfuscate ${fileName} with ${technique}`, () => {
            const result = obfuscateIR(content, [technique]);
            
            if (!result.obfuscatedCode) {
                throw new Error('Missing obfuscated code');
            }
            
            if (!result.appliedTechniques || result.appliedTechniques.length === 0) {
                throw new Error('No techniques applied');
            }
            
            if (!result.transformations) {
                throw new Error('Missing transformation stats');
            }
            
            console.log(`   Lines added: ${result.transformations.linesAdded}, Expansion: ${result.transformations.expansionRatio}x`);
        });
    }
}

console.log('\n📋 Test 3: Multi-Pass Obfuscation\n');
console.log('─'.repeat(60));

const multiPassTests = [
    ['flatten', 'bogus'],
    ['encrypt-strings', 'opaque-predicates'],
    ['flatten', 'bogus', 'encrypt-strings']
];

for (const passes of multiPassTests) {
    runTest(`Multi-pass: ${passes.join(' + ')}`, () => {
        const content = fs.readFileSync('test-samples/simple.ll', 'utf-8');
        const result = obfuscateIR(content, passes);
        
        if (result.appliedTechniques.length !== passes.length) {
            throw new Error(`Expected ${passes.length} techniques, got ${result.appliedTechniques.length}`);
        }
        
        console.log(`   Applied: ${result.appliedTechniques.join(', ')}`);
        console.log(`   Complexity increase: ${result.transformations.estimatedComplexityIncrease}%`);
    });
}

console.log('\n📋 Test 4: Error Handling\n');
console.log('─'.repeat(60));

runTest('Handle invalid IR code', () => {
    try {
        parseIR('this is not valid IR code');
        throw new Error('Should have thrown an error');
    } catch (error) {
        if (!error.message.includes('Failed to parse IR')) {
            throw error;
        }
    }
});

runTest('Handle empty IR code', () => {
    const result = parseIR('');
    // Empty code should return valid empty structure
    if (!result || !result.summary) {
        throw new Error('Should return valid structure for empty code');
    }
    if (result.summary.totalFunctions !== 0) {
        throw new Error('Empty code should have 0 functions');
    }
});

runTest('Handle invalid technique', () => {
    const content = fs.readFileSync('test-samples/simple.ll', 'utf-8');
    const result = obfuscateIR(content, ['invalid-technique']);
    // Should not crash, just skip invalid techniques
    if (!result.obfuscatedCode) {
        throw new Error('Should return original code for invalid techniques');
    }
});

console.log('\n📋 Test 5: Analysis Accuracy\n');
console.log('─'.repeat(60));

runTest('Detect loops in loops.ll', () => {
    const content = fs.readFileSync('test-samples/loops.ll', 'utf-8');
    const result = parseIR(content);
    
    const functionsWithLoops = result.functions.filter(f => f.hasLoops);
    if (functionsWithLoops.length === 0) {
        throw new Error('Should detect loops in loops.ll');
    }
    
    console.log(`   Found ${functionsWithLoops.length} functions with loops`);
});

runTest('Detect conditionals in conditionals.ll', () => {
    const content = fs.readFileSync('test-samples/conditionals.ll', 'utf-8');
    const result = parseIR(content);
    
    const functionsWithConditionals = result.functions.filter(f => f.hasConditionals);
    if (functionsWithConditionals.length === 0) {
        throw new Error('Should detect conditionals in conditionals.ll');
    }
    
    console.log(`   Found ${functionsWithConditionals.length} functions with conditionals`);
});

runTest('Detect global variables in strings.ll', () => {
    const content = fs.readFileSync('test-samples/strings.ll', 'utf-8');
    const result = parseIR(content);
    
    if (result.globalVariables.length === 0) {
        throw new Error('Should detect global variables in strings.ll');
    }
    
    console.log(`   Found ${result.globalVariables.length} global variables`);
});

runTest('Calculate complexity for complex.ll', () => {
    const content = fs.readFileSync('test-samples/complex.ll', 'utf-8');
    const result = parseIR(content);
    
    if (result.summary.totalComplexity === 0) {
        throw new Error('Should calculate non-zero complexity');
    }
    
    console.log(`   Total complexity: ${result.summary.totalComplexity}, Average: ${result.summary.avgComplexity}`);
});

console.log('\n📋 Test 6: Performance Tests\n');
console.log('─'.repeat(60));

runTest('Parse large file performance', () => {
    const content = fs.readFileSync('test-samples/complex.ll', 'utf-8');
    const start = Date.now();
    parseIR(content);
    const duration = Date.now() - start;
    
    if (duration > 1000) {
        throw new Error(`Parsing took too long: ${duration}ms`);
    }
    
    console.log(`   Parsing time: ${duration}ms`);
});

runTest('Obfuscation performance', () => {
    const content = fs.readFileSync('test-samples/complex.ll', 'utf-8');
    const start = Date.now();
    obfuscateIR(content, ['flatten', 'bogus']);
    const duration = Date.now() - start;
    
    if (duration > 2000) {
        throw new Error(`Obfuscation took too long: ${duration}ms`);
    }
    
    console.log(`   Obfuscation time: ${duration}ms`);
});

// Summary
console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║   📊 Test Results Summary                                ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log(`Total Tests:  ${totalTests}`);
console.log(`✅ Passed:    ${passedTests} (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`❌ Failed:    ${failedTests} (${Math.round((failedTests/totalTests)*100)}%)`);

if (failedTests === 0) {
    console.log('\n🎉 All tests passed! System is fully functional.\n');
    process.exit(0);
} else {
    console.log(`\n⚠️  ${failedTests} test(s) failed. Please review the errors above.\n`);
    process.exit(1);
}

// Made with Bob
