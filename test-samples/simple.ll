; ModuleID = 'simple.c'
source_filename = "simple.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Simple function that adds two numbers
define i32 @add(i32 %a, i32 %b) {
entry:
  %sum = add i32 %a, %b
  ret i32 %sum
}

; Main function with basic control flow
define i32 @main() {
entry:
  %x = alloca i32, align 4
  %y = alloca i32, align 4
  %result = alloca i32, align 4
  
  store i32 10, i32* %x, align 4
  store i32 20, i32* %y, align 4
  
  %0 = load i32, i32* %x, align 4
  %1 = load i32, i32* %y, align 4
  %2 = call i32 @add(i32 %0, i32 %1)
  
  store i32 %2, i32* %result, align 4
  %3 = load i32, i32* %result, align 4
  
  ret i32 %3
}