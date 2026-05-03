/**
 * Advanced LLVM IR Obfuscation Simulator
 * Simulates various obfuscation techniques on LLVM IR code
 */

export class IRObfuscator {
    constructor(irContent) {
        this.content = irContent;
        this.lines = irContent.split('\n');
    }

    applyTechniques(techniques) {
        let result = this.content;
        const appliedTechniques = [];

        for (const technique of techniques) {
            switch (technique) {
                case 'flatten':
                    result = this.controlFlowFlattening(result);
                    appliedTechniques.push('Control Flow Flattening');
                    break;
                case 'bogus':
                    result = this.bogusControlFlow(result);
                    appliedTechniques.push('Bogus Control Flow');
                    break;
                case 'encrypt-strings':
                    result = this.stringEncryption(result);
                    appliedTechniques.push('String Encryption');
                    break;
                case 'opaque-predicates':
                    result = this.opaquePredicates(result);
                    appliedTechniques.push('Opaque Predicates');
                    break;
                case 'instruction-substitution':
                    result = this.instructionSubstitution(result);
                    appliedTechniques.push('Instruction Substitution');
                    break;
            }
        }

        return {
            obfuscatedCode: result,
            appliedTechniques,
            transformations: this.getTransformationStats(this.content, result)
        };
    }

    controlFlowFlattening(code) {
        const lines = code.split('\n');
        const result = [];
        let inFunction = false;
        let functionName = '';

        result.push('; === Control Flow Flattening Applied ===');
        result.push('; Original control flow has been flattened into a switch-based dispatcher');
        result.push('');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (trimmed.startsWith('define')) {
                inFunction = true;
                const match = trimmed.match(/@(\w+)/);
                functionName = match ? match[1] : 'unknown';
                result.push(line);
                result.push('  ; Flattened control flow dispatcher');
                result.push('  %dispatcher = alloca i32, align 4');
                result.push('  store i32 0, i32* %dispatcher, align 4');
                result.push('  br label %dispatcher_loop');
                result.push('');
                result.push('dispatcher_loop:');
                result.push('  %state = load i32, i32* %dispatcher, align 4');
                result.push('  switch i32 %state, label %default_case [');
                result.push('    i32 0, label %block_0');
                result.push('    i32 1, label %block_1');
                result.push('    i32 2, label %block_2');
                result.push('  ]');
                result.push('');
                continue;
            }

            if (inFunction && trimmed === '}') {
                result.push('');
                result.push('default_case:');
                result.push('  br label %exit_block');
                result.push('');
                result.push('exit_block:');
                result.push('  ret i32 0');
                result.push('}');
                result.push('');
                inFunction = false;
                continue;
            }

            if (inFunction && trimmed.endsWith(':') && !trimmed.includes('dispatcher')) {
                const blockLabel = trimmed.slice(0, -1);
                result.push(`block_0:  ; Original: ${blockLabel}`);
                result.push('  ; Obfuscated block content');
                continue;
            }

            result.push(line);
        }

        return result.join('\n');
    }

    bogusControlFlow(code) {
        const lines = code.split('\n');
        const result = [];
        let inFunction = false;

        result.push('; === Bogus Control Flow Inserted ===');
        result.push('; Dead code paths added to confuse static analysis');
        result.push('');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            result.push(line);

            if (trimmed.startsWith('define')) {
                inFunction = true;
            }

            if (inFunction && trimmed.endsWith(':') && !trimmed.startsWith(';')) {
                // Insert bogus control flow after basic block labels
                result.push('  ; Bogus control flow - never executed');
                result.push('  %bogus_cond = icmp eq i32 1, 0  ; Always false');
                result.push('  br i1 %bogus_cond, label %bogus_block, label %real_block');
                result.push('');
                result.push('bogus_block:');
                result.push('  %bogus_val = add i32 42, 13');
                result.push('  %bogus_mul = mul i32 %bogus_val, 7');
                result.push('  br label %real_block');
                result.push('');
                result.push('real_block:');
            }

            if (trimmed === '}') {
                inFunction = false;
            }
        }

        return result.join('\n');
    }

    stringEncryption(code) {
        const lines = code.split('\n');
        const result = [];

        result.push('; === String Encryption Applied ===');
        result.push('; String literals have been encrypted with XOR cipher');
        result.push('');
        result.push('; Decryption function');
        result.push('define internal void @decrypt_string(i8* %str, i32 %len, i8 %key) {');
        result.push('entry:');
        result.push('  %i = alloca i32, align 4');
        result.push('  store i32 0, i32* %i, align 4');
        result.push('  br label %loop');
        result.push('');
        result.push('loop:');
        result.push('  %idx = load i32, i32* %i, align 4');
        result.push('  %cmp = icmp slt i32 %idx, %len');
        result.push('  br i1 %cmp, label %body, label %end');
        result.push('');
        result.push('body:');
        result.push('  %ptr = getelementptr i8, i8* %str, i32 %idx');
        result.push('  %char = load i8, i8* %ptr, align 1');
        result.push('  %decrypted = xor i8 %char, %key');
        result.push('  store i8 %decrypted, i8* %ptr, align 1');
        result.push('  %next = add i32 %idx, 1');
        result.push('  store i32 %next, i32* %i, align 4');
        result.push('  br label %loop');
        result.push('');
        result.push('end:');
        result.push('  ret void');
        result.push('}');
        result.push('');

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Encrypt string constants
            if (trimmed.includes('c"') || trimmed.includes('private unnamed_addr constant')) {
                const encrypted = line.replace(/c"([^"]+)"/, (match, str) => {
                    const encrypted = this.xorEncrypt(str, 0x42);
                    return `c"${encrypted}" ; Encrypted with key 0x42`;
                });
                result.push(encrypted);
            } else {
                result.push(line);
            }
        }

        return result.join('\n');
    }

    opaquePredicates(code) {
        const lines = code.split('\n');
        const result = [];
        let inFunction = false;

        result.push('; === Opaque Predicates Inserted ===');
        result.push('; Predicates that are always true/false but hard to analyze');
        result.push('');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            result.push(line);

            if (trimmed.startsWith('define')) {
                inFunction = true;
                result.push('  ; Opaque predicate: (x^2 >= 0) always true');
                result.push('  %opaque_x = alloca i32, align 4');
                result.push('  store i32 7, i32* %opaque_x, align 4');
            }

            if (inFunction && (trimmed.includes('br ') || trimmed.includes('ret '))) {
                result.push('  ; Opaque predicate check');
                result.push('  %x_val = load i32, i32* %opaque_x, align 4');
                result.push('  %x_squared = mul i32 %x_val, %x_val');
                result.push('  %opaque_pred = icmp sge i32 %x_squared, 0  ; Always true');
            }

            if (trimmed === '}') {
                inFunction = false;
            }
        }

        return result.join('\n');
    }

    instructionSubstitution(code) {
        const lines = code.split('\n');
        const result = [];

        result.push('; === Instruction Substitution Applied ===');
        result.push('; Simple instructions replaced with equivalent complex sequences');
        result.push('');

        for (const line of lines) {
            const trimmed = line.trim();
            
            // Replace simple add with complex equivalent
            if (trimmed.includes('add i32')) {
                const match = trimmed.match(/(%\w+)\s*=\s*add i32 (%\w+), (%\w+)/);
                if (match) {
                    const [, dest, op1, op2] = match;
                    result.push(`  ; Substituted: ${dest} = ${op1} + ${op2}`);
                    result.push(`  %neg_${op2} = sub i32 0, ${op2}`);
                    result.push(`  ${dest} = sub i32 ${op1}, %neg_${op2}`);
                    continue;
                }
            }

            result.push(line);
        }

        return result.join('\n');
    }

    xorEncrypt(str, key) {
        return str.split('').map(char => {
            const code = char.charCodeAt(0) ^ key;
            return String.fromCharCode(code);
        }).join('');
    }

    getTransformationStats(original, obfuscated) {
        const origLines = original.split('\n').filter(l => l.trim() && !l.trim().startsWith(';'));
        const obfLines = obfuscated.split('\n').filter(l => l.trim() && !l.trim().startsWith(';'));

        return {
            originalLines: origLines.length,
            obfuscatedLines: obfLines.length,
            linesAdded: obfLines.length - origLines.length,
            expansionRatio: (obfLines.length / origLines.length).toFixed(2),
            estimatedComplexityIncrease: Math.round(((obfLines.length - origLines.length) / origLines.length) * 100)
        };
    }
}

export function obfuscateIR(irContent, techniques) {
    try {
        const obfuscator = new IRObfuscator(irContent);
        return obfuscator.applyTechniques(techniques);
    } catch (error) {
        console.error('Obfuscation error:', error);
        throw new Error(`Failed to obfuscate IR: ${error.message}`);
    }
}

// Made with Bob
