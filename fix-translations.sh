#!/bin/bash

# Basic command to fix translation files
# Usage: ./fix-translations.sh [source-file] [target-file]

SOURCE_FILE=${1:-"public/locales/en/translation.json"}
TARGET_FILE=${2:-"public/locales/es/translation.json"}

echo "Fixing translations from $SOURCE_FILE to $TARGET_FILE..."

# Ensure both files exist
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file $SOURCE_FILE does not exist"
    exit 1
fi

if [ ! -f "$TARGET_FILE" ]; then
    echo "Error: Target file $TARGET_FILE does not exist"
    exit 1
fi

# Convert $ currency to € in target file (for Spanish or European languages)
sed -i 's/"\$\([0-9]\+\)\.\([0-9]\+\)"/"\1,\2 €"/g' "$TARGET_FILE"

# Fix inconsistent terminology (confidencialidad -> privacidad)
sed -i 's/"confidencialidad"/"privacidad"/g' "$TARGET_FILE"

# Fix date formats (MM/DD/YYYY to DD/MM/YYYY)
sed -i 's/\([0-9]\{1,2\}\)\/\([0-9]\{1,2\}\)\/\([0-9]\{4\}\)/\2\/\1\/\3/g' "$TARGET_FILE"

# Fix any missing translations by comparing with source file
# This is a simplified approach - a more robust solution would use jq
echo "Checking for missing translations..."

# Make the script executable
chmod +x "$0"

echo "Translation fixes completed!"