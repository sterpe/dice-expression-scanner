PATH := node_modules/.bin:$(PATH)
NPM=.node_modules/.bin/npm
NODE_VERSION=$(shell node --version 2>/dev/null)
NVMRC=$(shell cat .nvmrc)
SOURCE_DIR=src
DIST_DIR=dist
TEST_REPORTS_DIR=test-reports
COVERAGE_REPORTS_DIR=coverage
CODE_REPORTS_DIR=plato
ROOT = index.js
SOURCES = $(ROOT) `find $(SOURCE_DIR)`
SCRIPTS = `find scripts -name "*.js"`
TESTS = `find __tests__ -name "*.js"`
MOCKS = `find __mocks__ -name "*.js"`
JESTRC = .jestrc
JEST_FLAGS =
NODE_ENVIRONMENT=
DEVELOPMENT=development
PRODUCTION=production

LINT = standard
TEST = jest -c $(JESTRC) $(JEST_FLAGS)
BABEL = babel $(ROOT) -d $(DIST_DIR)

define postinstall-message
@echo ""
@echo "**** ATTENTION ****"
@echo "|"
@echo "| Please execute the following command:"
@echo "|   \`npm --version\` should be: `.node_modules/.bin/npm --version`"
@echo "|"
@echo "| If not, please source \`scripts/set_environment.sh\` into the current shell."
@echo "|"
@echo "| Hint: \`. scripts/set_environments.sh\`"
@echo "|"
@echo "**** THANK YOU ****"
@echo ""
endef

all: i test clean build
	$(postinstall-message)

configure:
ifneq "$(shell echo $(NODE_VERSION) | sed 's/^v\(.\).*/\1/')" "$(NVMRC)"
$(info )
$(info | Pro tip: install the node version manager (nvm) to manage multiple nodes.)
$(info | https://github.com/creationix/nvm)
$(info )
$(info | Hint: `nvm install $(NVMRC)`)
$(info )
$(error No or wrong node version.  Found "$(NODE_VERSION)", please install node $(NVMRC))
endif

.npm : | configure
	@echo "| Bootstrapping my \`npm\` with your \`npm\`.";
	@npm i npm@3;
	@echo "| Moving the \`node_modules\` folder out of the way.";
	@mv node_modules .node_modules;
	@echo "| Clearing the local \`npm\` cache.";
	@.node_modules/.bin/npm cache clear;
	@echo "| Installing \`npm\` locally.";
	@.node_modules/.bin/npm i npm@3;
	@rm -rf .node_modules;
	@mv node_modules .node_modules;
	@echo "| Success!  I will now install the project dependencies.";

i: .npm
ifeq "$(NODE_ENVIRONMENT)" "$(DEVELOPMENT)"
	$(NPM) link;
else
	$(NPM) i;
endif
	$(postinstall-message)

build: babel

babel:
	rm -rf $(DIST_DIR);
	$(BABEL);

test: lint
	rm -rf $(TEST_REPORTS_DIR);
	mkdir -p $(TEST_REPORTS_DIR);
	JEST_JUNIT_REPORTS_DIR=$(TEST_REPORTS_DIR) $(TEST);

lint:
	$(LINT) $(SOURCES) $(TESTS) $(MOCKS) $(SCRIPTS);

.clean: clean
	rm -rf .npm;
	rm -rf .node_modules;
	rm -rf node_modules;

clean:
	rm -rf $(DIST_DIR) \
	$(TEST_REPORTS_DIR) \
	$(COVERAGE_REPORTS_DIR) \
	$(CODE_REPORTS_DIR);

watch:

.PHONY : all \
	babel \
	build \
	configure \
	.clean \
	clean \
	i \
	lint \
	test \
	watch
