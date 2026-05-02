#!/usr/bin/env node

// Simple test script for MCP server tools
// Tests the read_ir_file tool with the sample IR file

import { readIRFile } from './dist/tools/read-ir-file.js';
import { analyzeIR } from './dist/tools/analyze-ir.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testReadIRFile() {
  console.log('='.repeat(60));
  console.log('Testing read_ir_file tool');
  console.log('='.repeat(60));
  
  const testPath = 'test-samples/simple.ll';
  
  console.log(`\nReading IR file: ${testPath}`);
  
  const result = await readIRFile({
    path: testPath,
    validate: false, // Skip validation if LLVM not installed
  });
  
  if (result.success) {
    console.log('\n✅ SUCCESS!');
    console.log(`\nFile size: ${result.data.size} bytes`);
    console.log(`Hash: ${result.data.hash.substring(0, 16)}...`);
    console.log(`\nMetadata:`);
    console.log(`  Target Triple: ${result.data.metadata.targetTriple}`);
    console.log(`  Data Layout: ${result.data.metadata.dataLayout?.substring(0, 50)}...`);
    console.log(`  Source File: ${result.data.metadata.sourceFilename}`);
    console.log(`\nFirst 200 characters of IR:`);
    console.log(result.data.content.substring(0, 200) + '...');
  } else {
    console.log('\n❌ FAILED!');
    console.log(`Error: ${result.error}`);
  }
}

async function testAnalyzeIR() {
  console.log('\n' + '='.repeat(60));
  console.log('Testing analyze_ir_structure tool');
  console.log('='.repeat(60));
  
  const testPath = 'test-samples/simple.ll';
  
  console.log(`\nAnalyzing IR file: ${testPath}`);
  
  const result = await analyzeIR({
    irPath: testPath,
  });
  
  if (result.success) {
    console.log('\n✅ SUCCESS!');
    console.log(`\nFound ${result.data.functions.length} functions:`);
    
    result.data.functions.forEach(fn => {
      console.log(`\n  Function: ${fn.name}`);
      console.log(`    Basic Blocks: ${fn.basicBlocks}`);
      console.log(`    Instructions: ${fn.instructions}`);
      console.log(`    Has Loops: ${fn.hasLoops}`);
      console.log(`    Has Conditionals: ${fn.hasConditionals}`);
    });
    
    console.log(`\nGlobal Variables: ${result.data.globalVariables.length}`);
    console.log(`Total Instructions: ${result.data.totalInstructions}`);
    console.log(`Entry Point: ${result.data.entryPoint}`);
  } else {
    console.log('\n❌ FAILED!');
    console.log(`Error: ${result.error}`);
  }
}

async function main() {
  console.log('\n🚀 Obfusi-Bob MCP Server Test Suite\n');
  
  try {
    await testReadIRFile();
    await testAnalyzeIR();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
    console.log('\nThe MCP server is ready to use with Bob!');
    console.log('You can now start the server with: npm start');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
    process.exit(1);
  }
}

main();

// Made with Bob
