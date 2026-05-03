; ModuleID = 'conditionals.c'
source_filename = "conditionals.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

; Simple if-else
define i32 @max(i32 %a, i32 %b) {
entry:
  %cmp = icmp sgt i32 %a, %b
  br i1 %cmp, label %if.then, label %if.else

if.then:
  ret i32 %a

if.else:
  ret i32 %b
}

; Nested if-else
define i32 @classify_number(i32 %n) {
entry:
  %cmp1 = icmp sgt i32 %n, 0
  br i1 %cmp1, label %if.positive, label %if.not.positive

if.positive:
  %cmp2 = icmp sgt i32 %n, 100
  br i1 %cmp2, label %if.large, label %if.small

if.large:
  ret i32 2

if.small:
  ret i32 1

if.not.positive:
  %cmp3 = icmp eq i32 %n, 0
  br i1 %cmp3, label %if.zero, label %if.negative

if.zero:
  ret i32 0

if.negative:
  ret i32 -1
}

; Switch statement
define i32 @day_of_week(i32 %day) {
entry:
  switch i32 %day, label %default [
    i32 1, label %monday
    i32 2, label %tuesday
    i32 3, label %wednesday
    i32 4, label %thursday
    i32 5, label %friday
    i32 6, label %saturday
    i32 7, label %sunday
  ]

monday:
  ret i32 1

tuesday:
  ret i32 2

wednesday:
  ret i32 3

thursday:
  ret i32 4

friday:
  ret i32 5

saturday:
  ret i32 6

sunday:
  ret i32 7

default:
  ret i32 0
}

; Complex conditional with logical operators
define i1 @is_valid_range(i32 %x, i32 %min, i32 %max) {
entry:
  %cmp1 = icmp sge i32 %x, %min
  br i1 %cmp1, label %check.max, label %return.false

check.max:
  %cmp2 = icmp sle i32 %x, %max
  br i1 %cmp2, label %return.true, label %return.false

return.true:
  ret i1 true

return.false:
  ret i1 false
}