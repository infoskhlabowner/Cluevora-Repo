#!/bin/bash
if npm run lint; then
  echo "Lint success"
else
  echo "Lint failed"
fi
