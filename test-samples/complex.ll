; ModuleID = 'complex.c'
source_filename = "complex.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

%struct.Node = type { i32, %struct.Node* }

@global_counter = global i32 0, align 4
@.str = private unnamed_addr constant [15 x i8] c"Counter: %d\0A\00", align 1

declare i32 @printf(i8*, ...)
declare noalias i8* @malloc(i64)
declare void @free(i8*)

; Recursive function - Fibonacci
define i32 @fibonacci(i32 %n) {
entry:
  %cmp = icmp sle i32 %n, 1
  br i1 %cmp, label %base.case, label %recursive.case

base.case:
  ret i32 %n

recursive.case:
  %sub1 = sub nsw i32 %n, 1
  %call1 = call i32 @fibonacci(i32 %sub1)
  %sub2 = sub nsw i32 %n, 2
  %call2 = call i32 @fibonacci(i32 %sub2)
  %add = add nsw i32 %call1, %call2
  ret i32 %add
}

; Function with pointers and structs
define %struct.Node* @create_node(i32 %value) {
entry:
  %call = call noalias i8* @malloc(i64 16)
  %node = bitcast i8* %call to %struct.Node*
  %value_ptr = getelementptr inbounds %struct.Node, %struct.Node* %node, i32 0, i32 0
  store i32 %value, i32* %value_ptr, align 4
  %next_ptr = getelementptr inbounds %struct.Node, %struct.Node* %node, i32 0, i32 1
  store %struct.Node* null, %struct.Node** %next_ptr, align 8
  ret %struct.Node* %node
}

; Function with global variable access
define void @increment_counter() {
entry:
  %0 = load i32, i32* @global_counter, align 4
  %inc = add nsw i32 %0, 1
  store i32 %inc, i32* @global_counter, align 4
  %1 = load i32, i32* @global_counter, align 4
  %call = call i32 (i8*, ...) @printf(i8* getelementptr inbounds ([15 x i8], [15 x i8]* @.str, i32 0, i32 0), i32 %1)
  ret void
}

; Function with multiple return paths
define i32 @complex_logic(i32 %a, i32 %b, i32 %c) {
entry:
  %cmp1 = icmp sgt i32 %a, %b
  br i1 %cmp1, label %if.then, label %if.else

if.then:
  %cmp2 = icmp sgt i32 %a, %c
  br i1 %cmp2, label %return.a, label %check.b.c

check.b.c:
  %cmp3 = icmp sgt i32 %b, %c
  br i1 %cmp3, label %return.b, label %return.c

if.else:
  %cmp4 = icmp sgt i32 %b, %c
  br i1 %cmp4, label %return.b, label %return.c

return.a:
  ret i32 %a

return.b:
  ret i32 %b

return.c:
  ret i32 %c
}

; Function with array operations
define i32 @array_sum_with_condition(i32* %arr, i32 %size, i32 %threshold) {
entry:
  %sum = alloca i32, align 4
  %i = alloca i32, align 4
  store i32 0, i32* %sum, align 4
  store i32 0, i32* %i, align 4
  br label %for.cond

for.cond:
  %0 = load i32, i32* %i, align 4
  %cmp = icmp slt i32 %0, %size
  br i1 %cmp, label %for.body, label %for.end

for.body:
  %1 = load i32, i32* %i, align 4
  %arrayidx = getelementptr inbounds i32, i32* %arr, i32 %1
  %2 = load i32, i32* %arrayidx, align 4
  %cmp.threshold = icmp sgt i32 %2, %threshold
  br i1 %cmp.threshold, label %add.to.sum, label %for.inc

add.to.sum:
  %3 = load i32, i32* %sum, align 4
  %4 = load i32, i32* %arrayidx, align 4
  %add = add nsw i32 %3, %4
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

; Linked list traversal
define i32 @list_length(%struct.Node* %head) {
entry:
  %count = alloca i32, align 4
  %current = alloca %struct.Node*, align 8
  store i32 0, i32* %count, align 4
  store %struct.Node* %head, %struct.Node** %current, align 8
  br label %while.cond

while.cond:
  %0 = load %struct.Node*, %struct.Node** %current, align 8
  %cmp = icmp ne %struct.Node* %0, null
  br i1 %cmp, label %while.body, label %while.end

while.body:
  %1 = load i32, i32* %count, align 4
  %inc = add nsw i32 %1, 1
  store i32 %inc, i32* %count, align 4
  %2 = load %struct.Node*, %struct.Node** %current, align 8
  %next = getelementptr inbounds %struct.Node, %struct.Node* %2, i32 0, i32 1
  %3 = load %struct.Node*, %struct.Node** %next, align 8
  store %struct.Node* %3, %struct.Node** %current, align 8
  br label %while.cond

while.end:
  %4 = load i32, i32* %count, align 4
  ret i32 %4
}