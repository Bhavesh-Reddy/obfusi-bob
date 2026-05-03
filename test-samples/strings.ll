; ModuleID = 'strings.c'
source_filename = "strings.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

@.str = private unnamed_addr constant [14 x i8] c"Hello, World!\00", align 1
@.str.1 = private unnamed_addr constant [20 x i8] c"Obfuscation Test!\0A\00", align 1
@.str.2 = private unnamed_addr constant [25 x i8] c"Secret API Key: 12345\0A\00", align 1
@.str.3 = private unnamed_addr constant [30 x i8] c"Password: super_secret_pass\0A\00", align 1

declare i32 @printf(i8*, ...)
declare i64 @strlen(i8*)
declare i8* @strcpy(i8*, i8*)

; Function that uses string literals
define i32 @print_messages() {
entry:
  %call1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([14 x i8], [14 x i8]* @.str, i32 0, i32 0))
  %call2 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([20 x i8], [20 x i8]* @.str.1, i32 0, i32 0))
  ret i32 0
}

; Function with sensitive data
define i32 @leak_secrets() {
entry:
  %call1 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([25 x i8], [25 x i8]* @.str.2, i32 0, i32 0))
  %call2 = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([30 x i8], [30 x i8]* @.str.3, i32 0, i32 0))
  ret i32 0
}

; String manipulation
define i32 @string_length(i8* %str) {
entry:
  %call = call i64 @strlen(i8* %str)
  %conv = trunc i64 %call to i32
  ret i32 %conv
}

; String copy
define void @copy_string(i8* %dest, i8* %src) {
entry:
  %call = call i8* @strcpy(i8* %dest, i8* %src)
  ret void
}