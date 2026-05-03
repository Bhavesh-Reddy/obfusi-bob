; ModuleID = 'loops.c'
source_filename = "loops.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Function with for loop
define i32 @sum_array(i32* %arr, i32 %size) {
entry:
  %sum = alloca i32, align 4
  %i = alloca i32, align 4
  store i32 0, i32* %sum, align 4
  store i32 0, i32* %i, align 4
  br label %for.cond

for.cond:
  %0 = load i32, i32* %i, align 4
  %1 = load i32, i32* %size, align 4
  %cmp = icmp slt i32 %0, %1
  br i1 %cmp, label %for.body, label %for.end

for.body:
  %2 = load i32, i32* %i, align 4
  %arrayidx = getelementptr inbounds i32, i32* %arr, i32 %2
  %3 = load i32, i32* %arrayidx, align 4
  %4 = load i32, i32* %sum, align 4
  %add = add nsw i32 %4, %3
  store i32 %add, i32* %sum, align 4
  br label %for.inc

for.inc:
  %5 = load i32, i32* %i, align 4
  %inc = add nsw i32 %5, 1
  store i32 %inc, i32* %i, align 4
  br label %for.cond

for.end:
  %6 = load i32, i32* %sum, align 4
  ret i32 %6
}

; Function with while loop
define i32 @factorial(i32 %n) {
entry:
  %result = alloca i32, align 4
  %num = alloca i32, align 4
  store i32 1, i32* %result, align 4
  store i32 %n, i32* %num, align 4
  br label %while.cond

while.cond:
  %0 = load i32, i32* %num, align 4
  %cmp = icmp sgt i32 %0, 1
  br i1 %cmp, label %while.body, label %while.end

while.body:
  %1 = load i32, i32* %result, align 4
  %2 = load i32, i32* %num, align 4
  %mul = mul nsw i32 %1, %2
  store i32 %mul, i32* %result, align 4
  %3 = load i32, i32* %num, align 4
  %dec = add nsw i32 %3, -1
  store i32 %dec, i32* %num, align 4
  br label %while.cond

while.end:
  %4 = load i32, i32* %result, align 4
  ret i32 %4
}

; Nested loops
define void @matrix_multiply(i32* %a, i32* %b, i32* %c, i32 %n) {
entry:
  %i = alloca i32, align 4
  %j = alloca i32, align 4
  %k = alloca i32, align 4
  store i32 0, i32* %i, align 4
  br label %outer.cond

outer.cond:
  %0 = load i32, i32* %i, align 4
  %1 = load i32, i32* %n, align 4
  %cmp1 = icmp slt i32 %0, %1
  br i1 %cmp1, label %outer.body, label %outer.end

outer.body:
  store i32 0, i32* %j, align 4
  br label %middle.cond

middle.cond:
  %2 = load i32, i32* %j, align 4
  %3 = load i32, i32* %n, align 4
  %cmp2 = icmp slt i32 %2, %3
  br i1 %cmp2, label %middle.body, label %middle.end

middle.body:
  store i32 0, i32* %k, align 4
  br label %inner.cond

inner.cond:
  %4 = load i32, i32* %k, align 4
  %5 = load i32, i32* %n, align 4
  %cmp3 = icmp slt i32 %4, %5
  br i1 %cmp3, label %inner.body, label %inner.end

inner.body:
  ; Matrix multiplication logic here
  %6 = load i32, i32* %k, align 4
  %inc3 = add nsw i32 %6, 1
  store i32 %inc3, i32* %k, align 4
  br label %inner.cond

inner.end:
  %7 = load i32, i32* %j, align 4
  %inc2 = add nsw i32 %7, 1
  store i32 %inc2, i32* %j, align 4
  br label %middle.cond

middle.end:
  %8 = load i32, i32* %i, align 4
  %inc1 = add nsw i32 %8, 1
  store i32 %inc1, i32* %i, align 4
  br label %outer.cond

outer.end:
  ret void
}