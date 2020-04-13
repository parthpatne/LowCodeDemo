# Function to setup TSLint
function SetupLint() {
	# Get ActionResources root
	$root = git rev-parse --show-toplevel
	$actionResourcesRoot = "$root\src\KaizalaAggregationService\ActionResources"

	# TSLint root
	$tsLintRoot = "$actionResourcesRoot\TSlint"
	
	"Setting up TSLint dependencies..."
	cd $tsLintRoot
	yarn install --frozen-lockfile
}

# Function to build action package
function StartLint([switch] $WatchMode) {
	# Get ActionResources root
	$root = git rev-parse --show-toplevel
	$actionResourcesRoot = "$root\src\KaizalaAggregationService\ActionResources"
	
	# TSLint root
	$tsLintRoot = "$actionResourcesRoot\TSlint"
	
	# Build package
	cd $tsLintRoot
	if ($WatchMode) {
		"Linting in watch mode..."
		Start-Process -FilePath "npm-watch" -ArgumentList "lint"
	} else {
		"Linting..."
		npm run lint
	}
}
