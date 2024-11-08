#!/bin/bash
CURDIR=$(dirname $0)

export PATH=$PATH:${CURDIR}/../node_modules/.bin

clear

# Function to log messages
log_message() {
    echo "[`date +"%Y-%m-%d %H:%M:%S"`] $1"
}

EXTENSION_DIR=$(dirname "$0") # Assumes pack.sh is in the main directory
DIST_DIR="${EXTENSION_DIR}/dist"

# Check if schemas are compiled
if [ ! -f ./schemas/gschemas.compiled ]; then
    command -v glib-compile-schemas >/dev/null 2>&1 || { echo >&2 "glib-compile-schemas is required but it's not installed. Aborting."; exit 1; }

    log_message "Compiling schemas..."
    glib-compile-schemas ./schemas
fi

# Check if tsc is installed
command -v tsc >/dev/null 2>&1 || { log_message "Error: tsc is required but it's not installed. Aborting."; exit 1; }

# Compile TypeScript
log_message "Building typescript files..."
npm install
tsc

# Check for errors
if [ $? -ne 0 ]; then
    log_message "Failed to compile TypeScript"
    exit 1
fi

exit 0
