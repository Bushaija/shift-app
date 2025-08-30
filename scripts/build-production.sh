#!/bin/bash

# Production Build Script for Healthcare Staffing App
# This script automates the production build process

set -e  # Exit on any error

echo "🚀 Starting production build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi

    if ! command -v eas &> /dev/null; then
        print_warning "EAS CLI is not installed. Installing..."
        npm install -g @expo/eas-cli
    fi

    print_status "Dependencies check completed"
}

# Clean previous builds
clean_builds() {
    print_status "Cleaning previous builds..."
    rm -rf node_modules
    rm -rf .expo
    rm -rf dist
    rm -rf build
    print_status "Clean completed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci --production=false
    print_status "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    if npm test -- --passWithNoTests; then
        print_status "Tests passed"
    else
        print_error "Tests failed"
        exit 1
    fi
}

# Lint code
lint_code() {
    print_status "Linting code..."
    if npm run lint; then
        print_status "Linting passed"
    else
        print_warning "Linting issues found, but continuing..."
    fi
}

# Build for different platforms
build_platforms() {
    print_status "Building for different platforms..."

    # Build for iOS
    print_status "Building for iOS..."
    eas build --platform ios --profile production --non-interactive

    # Build for Android
    print_status "Building for Android..."
    eas build --platform android --profile production --non-interactive

    # Build for Web
    print_status "Building for Web..."
    eas build --platform web --profile production --non-interactive

    print_status "All platform builds completed"
}

# Generate production assets
generate_assets() {
    print_status "Generating production assets..."

    # Create production config
    cp app.config.ts app.config.production.ts

    # Optimize images (if you have image optimization tools)
    if command -v imagemin &> /dev/null; then
        print_status "Optimizing images..."
        # Add image optimization commands here
    fi

    print_status "Assets generated"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."

    # Create deployment directory
    mkdir -p deployment

    # Copy necessary files
    cp -r assets deployment/
    cp app.config.production.ts deployment/
    cp package.json deployment/
    cp eas.json deployment/

    # Create deployment info
    echo "Build Date: $(date)" > deployment/build-info.txt
    echo "Node Version: $(node --version)" >> deployment/build-info.txt
    echo "NPM Version: $(npm --version)" >> deployment/build-info.txt

    print_status "Deployment package created"
}

# Main build process
main() {
    print_status "Starting production build..."

    check_dependencies
    clean_builds
    install_dependencies
    run_tests
    lint_code
    generate_assets
    build_platforms
    create_deployment_package

    print_status "🎉 Production build completed successfully!"
    print_status "Deployment package is ready in the 'deployment' directory"
}

# Run main function
main "$@"
