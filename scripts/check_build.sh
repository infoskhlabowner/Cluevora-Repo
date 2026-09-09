#!/bin/bash
while true; do
  if npm run build > build_out.txt 2>&1; then
    echo "Build success"
    break
  else
    echo "Build failed, check build_out.txt"
    cat build_out.txt
    break
  fi
done
