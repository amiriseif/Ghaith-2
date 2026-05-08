#!/usr/bin/env python3
"""
GHAITH - Run Script
Installs all dependencies if needed and starts the development server
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Execute a shell command and handle errors"""
    print(f"\n{'='*60}")
    print(f"▶ {description}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(command, shell=True, cwd=os.getcwd())
        if result.returncode != 0:
            print(f"\n❌ Error: {description} failed with code {result.returncode}")
            return False
        print(f"\n✅ {description} completed successfully")
        return True
    except Exception as e:
        print(f"\n❌ Error executing command: {e}")
        return False

def main():
    print("\n")
    print("╔" + "="*58 + "╗")
    print("║" + " "*58 + "║")
    print("║" + "  GHAITH - Water System Monitor                    ".center(58) + "║")
    print("║" + "  Initialization & Launch Script                   ".center(58) + "║")
    print("║" + " "*58 + "║")
    print("╚" + "="*58 + "╝")
    
    # Check if package.json exists
    if not Path("package.json").exists():
        print("\n❌ Error: package.json not found!")
        print("   Make sure you're in the project root directory")
        sys.exit(1)
    
    print("\n📦 Checking Node.js and npm...")
    try:
        result = subprocess.run("node --version", shell=True, capture_output=True, text=True)
        print(f"   ✓ Node.js {result.stdout.strip()}")
        
        result = subprocess.run("npm --version", shell=True, capture_output=True, text=True)
        print(f"   ✓ npm {result.stdout.strip()}")
    except Exception as e:
        print(f"❌ Node.js or npm not found: {e}")
        print("   Please install Node.js from https://nodejs.org/")
        sys.exit(1)
    
    # Install dependencies
    if not run_command("npm install", "Installing dependencies"):
        sys.exit(1)
    
    # Start development server
    print("\n" + "="*60)
    print("🚀 Starting development server...")
    print("="*60)
    print("\n   The app will open in your browser at:")
    print("   📱 http://localhost:3000")
    print("\n   Network access:")
    print("   📱 http://<your-computer-ip>:3000")
    print("\n   Press Ctrl+C to stop the server\n")
    
    if not run_command("npm run dev", "Starting development server"):
        sys.exit(1)

if __name__ == "__main__":
    main()
