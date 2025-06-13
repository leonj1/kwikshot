# KwikShot Development Makefile
# Allows customization of development server port and host

# Default configuration
DEV_PORT ?= 3000
DEV_HOST ?= localhost
NODE_ENV ?= development

# Export environment variables
export DEV_PORT
export DEV_HOST
export NODE_ENV

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help install dev dev-custom build build-all clean dist test lint format docker-build docker-run docker-dev

# Default target
help: ## Show this help message
	@echo "$(GREEN)KwikShot Development Commands$(NC)"
	@echo ""
	@echo "$(YELLOW)Development:$(NC)"
	@echo "  make dev                    Start development server (default port 3000)"
	@echo "  make dev DEV_PORT=8080      Start development server on custom port"
	@echo "  make dev-custom             Start with custom port prompt"
	@echo ""
	@echo "$(YELLOW)Build:$(NC)"
	@echo "  make build                  Build for production"
	@echo "  make build-all              Build and package for all platforms"
	@echo "  make dist                   Create distribution packages"
	@echo ""
	@echo "$(YELLOW)Docker:$(NC)"
	@echo "  make docker-build           Build Docker image"
	@echo "  make docker-run             Run in Docker container"
	@echo "  make docker-dev             Start Docker development environment"
	@echo ""
	@echo "$(YELLOW)Utilities:$(NC)"
	@echo "  make install                Install dependencies"
	@echo "  make clean                  Clean build artifacts"
	@echo "  make test                   Run tests"
	@echo "  make lint                   Run linter"
	@echo "  make format                 Format code"
	@echo ""
	@echo "$(YELLOW)Examples:$(NC)"
	@echo "  make dev DEV_PORT=8080                    # Start on port 8080"
	@echo "  make dev DEV_PORT=4000 DEV_HOST=0.0.0.0  # Start on port 4000, all interfaces"
	@echo "  make docker-dev DEV_PORT=5000            # Docker development on port 5000"

install: ## Install dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	npm install

dev: ## Start development server
	@echo "$(GREEN)Starting development server on $(DEV_HOST):$(DEV_PORT)...$(NC)"
	@echo "$(YELLOW)Press Ctrl+C to stop$(NC)"
	npm run dev

dev-custom: ## Start development server with custom port prompt
	@echo "$(YELLOW)Enter custom port (default: 3000):$(NC)"
	@read -p "Port: " port; \
	if [ -z "$$port" ]; then port=3000; fi; \
	echo "$(GREEN)Starting development server on $(DEV_HOST):$$port...$(NC)"; \
	DEV_PORT=$$port npm run dev

build: ## Build for production
	@echo "$(GREEN)Building for production...$(NC)"
	npm run build

build-all: ## Build and package for all platforms
	@echo "$(GREEN)Building and packaging for all platforms...$(NC)"
	npm run build-all

dist: ## Create distribution packages
	@echo "$(GREEN)Creating distribution packages...$(NC)"
	npm run dist

clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	rm -rf dist/
	rm -rf release/
	rm -rf node_modules/.cache/

test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	@echo "$(YELLOW)No tests configured yet$(NC)"

lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	@echo "$(YELLOW)No linter configured yet$(NC)"

format: ## Format code
	@echo "$(GREEN)Formatting code...$(NC)"
	@echo "$(YELLOW)No formatter configured yet$(NC)"

# Docker targets
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	docker build -t kwikshot:latest .

docker-run: ## Run in Docker container
	@echo "$(GREEN)Running in Docker container on port $(DEV_PORT)...$(NC)"
	docker run -it --rm \
		-p $(DEV_PORT):$(DEV_PORT) \
		-e DEV_PORT=$(DEV_PORT) \
		-e DEV_HOST=0.0.0.0 \
		kwikshot:latest

docker-dev: ## Start Docker development environment
	@echo "$(GREEN)Starting Docker development environment...$(NC)"
	docker-compose up --build

# Status check
status: ## Show current configuration
	@echo "$(GREEN)Current Configuration:$(NC)"
	@echo "  DEV_PORT: $(DEV_PORT)"
	@echo "  DEV_HOST: $(DEV_HOST)"
	@echo "  NODE_ENV: $(NODE_ENV)"
