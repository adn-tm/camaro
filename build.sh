#!/bin/bash

set -e

export OPTIMIZE="-O3"

echo "1/2 Compiling pugixml"

cp src/pugiconfig.hpp node_modules/pugixml/src/pugiconfig.hpp

(
  emcc \
    --bind \
    ${OPTIMIZE} \
    -s WASM=1 \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s ASSERTIONS=0 \
    -DNDEBUG \
    -s 'EXPORT_NAME="pugixml"' \
    -I node_modules/pugixml/src \
    -c node_modules/pugixml/src/pugixml.cpp \
    -o ./dist/pugixml.o
)

echo "2/2 Compiling camaro wasm bindings"
(
  emcc \
    --bind \
    ${OPTIMIZE} \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s MODULARIZE=1 \
    -s ASSERTIONS=0 \
    -DNDEBUG \
    -s 'MALLOC="emmalloc"' \
    -s 'EXPORT_NAME="camaro"' \
    -I node_modules/pugixml/src \
    -I node_modules/json/single_include/nlohmann \
    -o dist/camaro.js \
    -Wno-deprecated-register \
    -Wno-writable-strings \
    --closure 1 \
    --llvm-lto 1 \
    dist/*.o \
    src/camaro.cpp
)

echo "DONE!"

echo "Run \`docker pull emscripten/emsdk\` to get latest docker image"
