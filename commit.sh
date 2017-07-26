#!/bin/sh
git status
git add .
echo -n "请输入本次提交内容的描述:"
read message
git commit -m "$message"
git pull
git push
