#!/usr/bin/env bash

sh scripts/copyFiles.sh build
npx tsc --build tsconfig.json -v
sh scripts/correctImports.sh